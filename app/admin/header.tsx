
'use client'

import NavBar from "@/components/navbar";
import { useAuth } from "@/app/api/user/auth";
import NavLink from "@/components/navlinks";

export default function Header() {
    const { user, admin, loading, logout } = useAuth(); // Get the user data here

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!user || !admin) {
        return <div>Access denied.</div>
    }

    const posts = [
        {id: 1, href: '/admin', title: 'Home'},
        {id: 2, href: '/admin/team', title: 'Team'},
        {id: 3, href: '/admin/team/directory', title: 'Directory'},
        {id: 4, href: '/admin/shop', title: 'Shop'},
        {id: 4, href: '/admin/equipment', title: 'Equipment'}
    ];

    return (
        <header>
            <div className="header_nav">
                <NavBar posts={posts} />
                <button onClick={logout}>Logout!</button>
                <div className="member_gateway">
                    <NavLink href="/members">Member Portal</NavLink>
                </div>
            </div>
        </header>
    );
}