'use client'

import { AuthProvider, useAuth } from "@/app/api/user/auth";
import Header from './header';

export default function Layout({ children }) {
    return (
        <AuthProvider>
            <Header />
            {children}
        </AuthProvider>
    )
}