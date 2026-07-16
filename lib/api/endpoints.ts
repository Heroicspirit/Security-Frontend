export const API = {
    AUTH: {
        REGISTER : "/api/auth/register",
        LOGIN : "/api/auth/login",
        WHOAMI: '/api/auth/whoami',
        UPDATEPROFILE: '/api/auth/update-profile',
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
        MFA_GENERATE_SECRET: '/api/auth/mfa/generate-secret',
        MFA_ENABLE: '/api/auth/mfa/enable',
        MFA_VERIFY: '/api/auth/mfa/verify',
        MFA_DISABLE: '/api/auth/mfa/disable',
        CHECK_PASSWORD_STRENGTH: '/api/auth/check-password-strength',
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