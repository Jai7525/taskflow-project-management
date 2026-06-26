export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  TASKS: {
    BASE: '/tasks',
    DETAIL: (id) => `/tasks/${id}`,
    COMPLETE: (id) => `/tasks/${id}/complete`,
  },
  WORKSPACE: {
    STATISTICS: '/workspace/statistics',
    ACTIVITY: '/workspace/activity',
  },
};
