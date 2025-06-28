const API_BASE_URL = '/api';

// Check if server is available
const isServerAvailable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

// Properties API
export const propertiesApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    } catch (error) {
      console.warn('API not available, using fallback data');
      // Return empty array as fallback
      return [];
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    } catch (error) {
      console.warn('API not available');
      throw new Error('Property not found');
    }
  },

  create: async (property: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });
      if (!response.ok) throw new Error('Failed to create property');
      return response.json();
    } catch (error) {
      console.warn('API not available');
      throw new Error('Failed to create property - server not available');
    }
  },

  update: async (id: string, property: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property),
      });
      if (!response.ok) throw new Error('Failed to update property');
      return response.json();
    } catch (error) {
      console.warn('API not available');
      throw new Error('Failed to update property - server not available');
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete property');
      return response.ok;
    } catch (error) {
      console.warn('API not available');
      throw new Error('Failed to delete property - server not available');
    }
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    } catch (error) {
      console.warn('API not available, using fallback data');
      return [];
    }
  },

  create: async (booking: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return response.json();
    } catch (error) {
      console.warn('API not available');
      throw new Error('Failed to create booking - server not available');
    }
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
      // Fallback to localStorage
      const savedUsers = localStorage.getItem('bayhaven_users');
      return savedUsers ? JSON.parse(savedUsers) : [];
    }
  },

  create: async (user: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      // Check if we got HTML instead of JSON (API routing issue)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('API routing issue - using localStorage fallback');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      return response.json();
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
      // Fallback to localStorage
      const savedUsers = localStorage.getItem('bayhaven_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      // Validate required fields
      if (!user.username || !user.name || !user.email || !user.password) {
        throw new Error('Username, name, email, and password are required');
      }

      // Check for duplicate username/email
      const existingUser = users.find((u: any) => 
        u.username === user.username || u.email === user.email
      );

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      // Generate unique ID
      const maxId = users.length > 0 ? Math.max(...users.map((u: any) => parseInt(u.id) || 0)) : 0;

      const newUser = {
        ...user,
        id: (maxId + 1).toString(),
        registeredDate: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      };

      users.push(newUser);
      localStorage.setItem('bayhaven_users', JSON.stringify(users));
      return newUser;
    }
  },

  update: async (id: string, user: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }
      return response.json();
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
      const savedUsers = localStorage.getItem('bayhaven_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      const userIndex = users.findIndex((u: any) => u.id == id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users[userIndex] = { ...users[userIndex], ...user };
      localStorage.setItem('bayhaven_users', JSON.stringify(users));
      return users[userIndex];
    }
  },

  delete: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
      return response.json();
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
      const savedUsers = localStorage.getItem('bayhaven_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      const userIndex = users.findIndex((u: any) => u.id == id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      users.splice(userIndex, 1);
      localStorage.setItem('bayhaven_users', JSON.stringify(users));
      return { message: 'User deleted successfully' };
    }
  },
};

// Authentication API
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if we got HTML instead of JSON (API routing issue)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('API routing issue - using localStorage fallback');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      return data;
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
      // Fallback to localStorage authentication with database seeded users
      const savedUsers = localStorage.getItem('bayhaven_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      // Default users matching database seed data
      const defaultUsers = [
        { id: 1, username: "admin", password: "password123", role: "admin", name: "Admin User", email: "admin@bluebay.com" },
        { id: 2, username: "staff", password: "password123", role: "staff", name: "Staff User", email: "staff@bluebay.com" },
        { id: 3, username: "owner", password: "password123", role: "owner", name: "Property Owner", email: "owner@bluebay.com" },
        { id: 4, username: "user", password: "password123", role: "user", name: "Regular User", email: "user@bluebay.com" },
      ];

      const allUsers = [...defaultUsers, ...users];

      const user = allUsers.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );

      if (user) {
        return {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            status: 'active'
          }
        };
      } else {
        throw new Error('Invalid username or password');
      }
    }
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return data;
    } catch (error) {
      console.warn('API not available, using localStorage fallback');
      // Fallback to localStorage registration
      const savedUsers = localStorage.getItem('bayhaven_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      // Check for existing user
      const existingUser = users.find((u: any) => 
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      if (userData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const newUser = {
        id: users.length + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone || '',
        role: 'customer',
        status: 'active',
        registeredDate: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      };

      users.push(newUser);
      localStorage.setItem('bayhaven_users', JSON.stringify(users));

      return {
        success: true,
        message: 'Registration successful',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status
        }
      };
    }
  },
};