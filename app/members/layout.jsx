'use client'

import { AuthProvider } from "@/app/api/user/auth";
import Header from './header';
import Footer from './footer';

export default function Layout({ children }) {
    return (
        <AuthProvider>
            <Header />
            {children}
            <Footer />
        </AuthProvider>
    )
}