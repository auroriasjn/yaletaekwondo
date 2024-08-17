'use client'

import NavBar from "@/components/navbar";
import { useAuth } from "@/app/api/user/auth";
import NavLink from "@/components/navlinks";

export default function Header() {
    const { user, loading, logout } = useAuth(); // Get the user data here

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!user) {
        return <div>Access denied.</div>
    }

    const posts = [
        {id: 1, href: '/members', title: 'Home'},
        {id: 2, href: '/members/team/directory', title: 'Directory'},
        {id: 2, href: '/members/team/resources', title: 'Resources'},
        {id: 2, href: '/members/team/tournaments', title: 'Tournaments'},
        {id: 2, href: '/members/team/events', title: 'Events'},
        {id: 3, href: '/members/equipment', title: 'Equipment'},
        {id: 4, href: '/members/shop', title: 'Shop'},
        {id: 5, href: '/members/settings', title: 'Settings'},
    ];

    return (
        <header>
            <div className="header_nav">
                <div className="header_profile">
                    <h3 id="header_welcome">Welcome, {user.firstName}.</h3>
                </div>
                <div className="admin_gateway">
                    {(user.admin) ?
                        <NavLink href="/admin">Admin Portal</NavLink>
                        : null
                    }
                </div>
                <NavBar posts={posts} />
                <button onClick={logout}>Logout!</button>
            </div>
        </header>
    );
}