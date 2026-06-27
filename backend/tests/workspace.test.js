const supertest = require('supertest');
const app = require('../src/app');
const { getAuthToken, createTestTask } = require('./helpers');
const { ActivityLog } = require('../src/models');

const request = supertest(app);

describe('Workspace Dashboard API Endpoints', () => {
  let token;

  beforeEach(async () => {
    // Register and authenticate default test session
    token = await getAuthToken(request);
  });

  describe('GET /api/workspace/statistics', () => {
    it('should return correct task metric count aggregates', async () => {
      // Arrange — create distinct status tasks to verify aggregator metrics
      await createTestTask(request, token, { title: 'T1', status: 'Pending' });
      await createTestTask(request, token, { title: 'T2', status: 'In Progress' });
      await createTestTask(request, token, { title: 'T3', status: 'In Progress' });
      await createTestTask(request, token, { title: 'T4', status: 'Completed' });

      // Act
      const response = await request
        .get('/api/workspace/statistics')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toEqual({
        total: 4,
        pending: 1,
        inProgress: 2,
        completed: 1,
      });
    });
  });

  describe('GET /api/workspace/activity', () => {
    it('should return the latest activity log entries for the user', async () => {
      // Arrange
      await createTestTask(request, token, { title: 'Design home page' });

      // Act
      const response = await request
        .get('/api/workspace/activity')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('action');
      expect(response.body.data[0]).toHaveProperty('task');
    });

    it('should return recent activity entries sorted with the newest first', async () => {
      // Arrange — Create multiple tasks sequentially to verify order sorting
      await createTestTask(request, token, { title: 'First Task Created' });
      // Short delay or manual millisecond mock offset to ensure different creation timestamps
      await new Promise((resolve) => setTimeout(resolve, 500));
      await createTestTask(request, token, { title: 'Second Task Created' });

      // Act
      const response = await request
        .get('/api/workspace/activity')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      const activities = response.body.data;
      expect(activities.length).toBeGreaterThanOrEqual(2);

      // Verify chronological order (newest first)
      const firstDate = new Date(activities[0].createdAt).getTime();
      const secondDate = new Date(activities[1].createdAt).getTime();
      expect(firstDate).toBeGreaterThanOrEqual(secondDate);
    });
  });
});
