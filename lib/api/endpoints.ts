export const API = {
    AUTH: {
        REGISTER : "/api/auth/register",
        LOGIN : "/api/auth/login",
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    PRODUCTS: {
        GET_ALL: '/api/products',
        GET_FEATURED: '/api/products/featured',
        GET_BY_CATEGORY: (category: string) => `/api/products/category/${category}`,
        GET_BY_ID: (id: string) => `/api/products/${id}`,
        CREATE: '/api/products',
        UPDATE: (id: string) => `/api/products/${id}`,
        DELETE: (id: string) => `/api/products/${id}`,
    },
}