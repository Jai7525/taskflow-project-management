const supertest = require('supertest');
const app = require('../src/app');
const { registerTestUser, loginTestUser, createTestTask } = require('./helpers');
const { Task } = require('../src/models');

const request = supertest(app);

describe('Tasks API Endpoints', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Set up default authenticated user session
    const email = 'test@example.com';
    const password = 'Password123!';
    const regRes = await registerTestUser(request, { email, password });
    userId = regRes.body.data.id;

    const loginRes = await loginTestUser(request, { email, password });
    token = loginRes.body.data.token;
  });

  describe('POST /api/tasks', () => {
    it('should successfully create a new task with valid details', async () => {
      // Act
      const response = await request
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Clean the kitchen',
          description: 'Sweep and mop the floor.',
          status: 'Pending',
          priority: 'High',
          dueDate: '2025-12-31T00:00:00.000Z',
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Clean the kitchen');
      expect(response.body.data.userId).toBe(userId);

      // Verify DB state
      const dbTask = await Task.findByPk(response.body.data.id);
      expect(dbTask).not.toBeNull();
      expect(dbTask.title).toBe('Clean the kitchen');
    });

    it('should reject task creation when required title field is missing', async () => {
      // Act
      const response = await request
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Description without a title',
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.errors).not.toBeNull();
    });
  });

  describe('GET /api/tasks', () => {
    it("should retrieve the authenticated user's tasks", async () => {
      // Arrange
      await createTestTask(request, token, { title: 'User Task 1' });
      await createTestTask(request, token, { title: 'User Task 2' });

      // Create a task for another user to verify isolation
      await registerTestUser(request, {
        email: 'other@example.com',
        password: 'Password123!',
      });
      const otherLoginRes = await loginTestUser(request, {
        email: 'other@example.com',
        password: 'Password123!',
      });
      const secondToken = otherLoginRes.body.data.token;
      await createTestTask(request, secondToken, { title: 'Other User Task' });

      // Act
      const response = await request
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.tasks.length).toBe(2);
      expect(response.body.data.tasks[0].title).toContain('User Task');
    });

    it('should support pagination via page and limit query parameters', async () => {
      // Arrange
      for (let i = 1; i <= 5; i++) {
        await createTestTask(request, token, { title: `Task ${i}` });
      }

      // Act
      const response = await request
        .get('/api/tasks?page=1&limit=3')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(3);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.total).toBe(5);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });

    it('should support searching tasks by title match', async () => {
      // Arrange
      await createTestTask(request, token, { title: 'Design home page mockup' });
      await createTestTask(request, token, { title: 'Clean database logs' });

      // Act
      const response = await request
        .get('/api/tasks?search=mockup')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.tasks.length).toBe(1);
      expect(response.body.data.tasks[0].title).toBe('Design home page mockup');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task details successfully', async () => {
      // Arrange
      const createRes = await createTestTask(request, token, { title: 'Old Title' });
      const taskId = createRes.body.data.id;

      // Act
      const response = await request
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Brand New Title',
          description: 'This is an updated task description.',
          status: 'In Progress',
          priority: 'High',
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.title).toBe('Brand New Title');
      expect(response.body.data.status).toBe('In Progress');

      // Verify DB state
      const dbTask = await Task.findByPk(taskId);
      expect(dbTask.title).toBe('Brand New Title');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task status to Completed', async () => {
      // Arrange
      const createRes = await createTestTask(request, token, { title: 'Incomplete Task', status: 'Pending' });
      const taskId = createRes.body.data.id;

      // Act
      const response = await request
        .patch(`/api/tasks/${taskId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('Completed');

      // Verify DB state
      const dbTask = await Task.findByPk(taskId);
      expect(dbTask.status).toBe('Completed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      // Arrange
      const createRes = await createTestTask(request, token, { title: 'To Delete' });
      const taskId = createRes.body.data.id;

      // Act
      const response = await request
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);

      // Verify DB state
      const dbTask = await Task.findByPk(taskId);
      expect(dbTask).toBeNull();
    });
  });

  describe('Authorization and Validation Rules', () => {
    it("should prevent a user from retrieving another user's task details", async () => {
      // Arrange — Register a second user and create a task under their account
      await registerTestUser(request, {
        email: 'otherowner@example.com',
        password: 'Password123!',
      });
      const otherOwnerLoginRes = await loginTestUser(request, {
        email: 'otherowner@example.com',
        password: 'Password123!',
      });
      const secondToken = otherOwnerLoginRes.body.data.token;
      const taskRes = await createTestTask(request, secondToken, { title: 'Secret Task' });
      const secretTaskId = taskRes.body.data.id;

      // Act — Access the task using the primary user's token
      const response = await request
        .get(`/api/tasks/${secretTaskId}`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return a validation error on PUT with invalid fields', async () => {
      // Arrange
      const createRes = await createTestTask(request, token);
      const taskId = createRes.body.data.id;

      // Act — Send an empty title update
      const response = await request
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '',
        });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.errors).not.toBeNull();
    });

    it('should return 404 not found on DELETE when task does not exist', async () => {
      // Arrange - Valid version 4 UUID format that does not exist
      const nonExistingTaskId = 'a0000000-0000-4000-a000-000000000000';

      // Act
      const response = await request
        .delete(`/api/tasks/${nonExistingTaskId}`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
