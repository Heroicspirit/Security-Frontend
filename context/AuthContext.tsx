"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = () => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
            const userData = document.cookie.split('; ').find(row => row.startsWith('user_data='));
            
            if (token) {
                setIsAuthenticated(true);
                if (userData) {
                    const userJson = userData.split('=')[1];
                    const parsedUser = JSON.parse(decodeURIComponent(userJson));
                    setUser(parsedUser);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = () => {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

