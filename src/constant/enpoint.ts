export const API_ENDPOINT = {
  AUTH: {
    SIGN_IN: "/api/auth/sign-in",
    SIGN_OUT: "/api/auth/sign-out",
    SIGN_UP: "/api/auth/sign-up",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },
  KPI_CATEGORY: {
    GET_ALL: "/api/kpi-category",
    GET_BY_ID: (id: number) => `/api/kpi-category/${id}`,
    CREATE: "/api/kpi-category",
    UPDATE: (id: number) => `/api/kpi-category/${id}`,
    DELETE: (id: number) => `/api/kpi-category/${id}`,
  },
   DEPARTMENT: {
    GET_ALL: "/api/department",
    GET_BY_ID: (id: number) => `/api/department/${id}`,
    CREATE: "/api/department",
    UPDATE: (id: number) => `/api/department/${id}`,
    DELETE: (id: number) => `/api/department/${id}`,
  },
  USER: {
    GET_ALL: "/api/user",
    GET_BY_ID: (id: number) => `/api/user/${id}`,
    CREATE: "/api/auth/sign-up",
    UPDATE: (id: number) => `/api/user/${id}`,
    DELETE: (id: number) => `/api/user/${id}`,
  },
  
  ROLE: {
    GET_ALL: "/api/role"
  },
};
