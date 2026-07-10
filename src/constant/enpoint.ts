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
  ROLE: {
    GET_ALL: "/api/role"
  },
};
