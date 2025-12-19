// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('🔗 Connecting to API at:', API_URL);

// API Client with credentials (cookies)
const apiClient = async (endpoint, options = {}) => {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // Important: send cookies
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Auth API
export const authAPI = {
    // Register
    register: async (email, password, full_name) => {
        return apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name }),
        });
    },

    // Secret Register
    registerSecret: async (email) => {
        return apiClient('/auth/register-secret', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    // Login
    login: async (email, password) => {
        return apiClient('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    // Get current user
    getMe: async () => {
        return apiClient('/auth/me');
    },

    // Logout
    logout: async () => {
        return apiClient('/auth/logout', {
            method: 'POST',
        });
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
        return apiClient('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },

    // Accept Terms
    acceptTerms: async () => {
        return apiClient('/auth/accept-terms', {
            method: 'PUT',
        });
    },
};

export default apiClient;

// Lesson API
export const lessonAPI = {
    // Get lesson content
    getLesson: async (dayNumber) => {
        return apiClient(`/lessons/${dayNumber}`);
    },

    // Get available lessons (days with content in database)
    getAvailableLessons: async () => {
        return apiClient('/lessons/available');
    },

    // Complete lesson
    completeLesson: async (dayNumber, score, timeSpent) => {
        return apiClient(`/lessons/${dayNumber}/complete`, {
            method: 'POST',
            body: JSON.stringify({ score, timeSpent }),
        });
    },

    // Save progress (auto-save answers)
    saveProgress: async (dayNumber, answers) => {
        return apiClient(`/lessons/${dayNumber}/save`, {
            method: 'POST',
            body: JSON.stringify({ answers }),
        });
    }
};
