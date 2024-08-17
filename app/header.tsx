import NavBar from "@/components/navbar";

export default function Header() {
    const posts = [
        {id: 1, href: '/', title: 'Home'},
        {id: 2, href: 'http://localhost:3002/api/login', title: 'Login'}
    ];

    return (
        <header>
            <div className="header_nav">
                <NavBar posts={posts} />
            </div>
        </header>
    );
}