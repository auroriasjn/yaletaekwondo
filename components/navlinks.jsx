import Link from 'next/link'

export default function NavLink({ href, children, title=null }) {
    return (
        <Link href={href}>
            <h3 className="navlink_title">
                {title}
            </h3>
            {children}
        </Link>
    );
}