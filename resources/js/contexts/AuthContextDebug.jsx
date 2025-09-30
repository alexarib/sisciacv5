import React, { createContext, useContext, useState, useEffect } from 'react';

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

    useEffect(() => {
        // Simular carga inicial
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Intento de login:', { username, password });

            // Simular validación simple
            if (username === 'admin' && password === 'admin123') {
                const userData = {
                    id: 1,
                    name: 'Administrador SCIAC',
                    username: 'admin',
                    email: 'admin@sciac.gov.ve',
                    role: 'admin'
                };

                setUser(userData);
                setIsAuthenticated(true);

                return { success: true, user: userData };
            } else {
                return { success: false, message: 'Credenciales inválidas' };
            }
        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, message: 'Error de conexión' };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 