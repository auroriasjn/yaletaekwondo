import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

// Larger authentication provider.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:3002/api/check-auth', { withCredentials: true });
                setUser(res.data.user);
                setAdmin(res.data.user.admin);
                setLoading(false);
            } catch (error) {
                console.error('Authentication error:', error);
                setUser(null);
                setLoading(false);
                setAdmin(false);
                router.push('/noaccess'); // Redirect to login page if authentication fails
            }
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const res = await axios.post('http://localhost:3002/api/login', credentials, { withCredentials: true });
            setUser(res.data.user);
            router.push('/'); // Redirect to homepage after successful login
        } catch (error) {
            console.error('Login error:', error);
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:3002/api/logout', null, { withCredentials: true });
            setUser(null);
            router.push('/'); // Redirect to login page after logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// This saves the user authentication context environment for use to protect pages.
export const useAuth = () => useContext(AuthContext);



