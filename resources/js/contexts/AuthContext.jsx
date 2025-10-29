import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    const token = localStorage.getItem('sisciac_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('sisciac_token');
        if (!token) {
          setLoading(false);
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Intentar cargar usuario desde localStorage; si no existe, pedirlo al backend
        const userData = localStorage.getItem('sisciac_user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            localStorage.removeItem('sisciac_user');
          }
        }

        // Si no hay usuario en localStorage pero sí hay token, consultamos /api/auth/me
        if (!userData) {
          (async () => {
            try {
              const { data } = await axios.get('/api/auth/me');
              if (data?.success && data?.user) {
                localStorage.setItem('sisciac_user', JSON.stringify(data.user));
                setUser(data.user);
                setIsAuthenticated(true);
              } else {
                // Token inválido: limpiar y forzar login
                localStorage.removeItem('sisciac_token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (err) {
              console.error('Auth /me error:', err);
              localStorage.removeItem('sisciac_token');
              delete axios.defaults.headers.common['Authorization'];
              setUser(null);
              setIsAuthenticated(false);
            } finally {
              setLoading(false);
            }
          })();
          return; // Evitar marcar loading=false antes de la llamada
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('sisciac_token');
        localStorage.removeItem('sisciac_user');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // Validate input
      if (!username || !password) {
        return { success: false, message: 'Usuario y contraseña son requeridos' };
      }

      const { data } = await axios.post('/api/auth/login', { username, password });

      if (data?.success && data?.token) {
        localStorage.setItem('sisciac_token', data.token);
        localStorage.setItem('sisciac_user', JSON.stringify(data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, user: data.user };
      }

      return { success: false, message: data?.message || 'Error de autenticación' };
    } catch (error) {
      console.error('Login error:', error);

      if (error.response?.status === 422) {
        return { success: false, message: 'Datos de entrada inválidos' };
      } else if (error.response?.status === 401) {
        return { success: false, message: 'Credenciales inválidas' };
      } else if (error.response?.status === 500) {
        return { success: false, message: 'Error del servidor. Intenta más tarde.' };
      } else if (!error.response) {
        return { success: false, message: 'Error de conexión. Verifica tu internet.' };
      }

      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        return { success: false, message: Array.isArray(firstError) ? firstError[0] : firstError };
      }

      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('sisciac_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);

      if (error.response?.status === 422) {
        return { success: false, message: 'No se encontró una cuenta con ese correo electrónico' };
      }

      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    }
  };

  const resetPassword = async (token, email, password, password_confirmation) => {
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        return { success: false, message: Array.isArray(firstError) ? firstError[0] : firstError };
      }

      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    }
  };

  const changePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
    try {
      const response = await axios.post('/api/auth/change-password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        return { success: false, message: Array.isArray(firstError) ? firstError[0] : firstError };
      }

      return { success: false, message: error.response?.data?.message || 'Error de conexión' };
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      if (data?.success) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: 'No se pudo actualizar la información del usuario' };
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, message: 'Error al actualizar información del usuario' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 