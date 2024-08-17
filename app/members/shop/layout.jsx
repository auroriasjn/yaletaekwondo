'use client'

import { AuthProvider } from "@/app/api/user/auth";
import { PurchasingCartProvider } from "@/app/api/user/shop";

export default function Layout({ children }) {
    return (
        <AuthProvider>
            <PurchasingCartProvider>
                {children}
            </PurchasingCartProvider>
        </AuthProvider>
    )
}