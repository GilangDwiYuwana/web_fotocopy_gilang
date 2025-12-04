'use client';
import { useState, useEffect } from 'react';

const USER_STORAGE_KEY = 'user_session_id';
const ROLE_STORAGE_KEY = 'user_role';

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Cek LocalStorage saat komponen dimuat
        const storedUserId = localStorage.getItem(USER_STORAGE_KEY);
        const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as 'user' | 'admin' | null;
        
        if (storedUserId) {
            setIsLoggedIn(true);
            setUserRole(storedRole);
        }
        setIsChecking(false);
    }, []);

    // Fungsi untuk menandai login berhasil (dipanggil dari LoginPage)
    const login = (userId: string, role: 'user' | 'admin') => {
        localStorage.setItem(USER_STORAGE_KEY, userId);
        localStorage.setItem(ROLE_STORAGE_KEY, role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    // Fungsi untuk logout
    const logout = () => {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ROLE_STORAGE_KEY);
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return { isLoggedIn, userRole, isChecking, login, logout };
}