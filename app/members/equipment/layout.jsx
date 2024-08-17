'use client'

import { AuthProvider } from "@/app/api/user/auth";
import { BorrowingCartProvider } from "@/app/api/user/equipment";

export default function Layout({ children }) {
    return (
        <AuthProvider>
            <BorrowingCartProvider>
                {children}
            </BorrowingCartProvider>
        </AuthProvider>
    )
}