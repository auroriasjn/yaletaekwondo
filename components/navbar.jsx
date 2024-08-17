import NavLink from './navlinks.jsx';

export default function NavBar({ posts }) {
    return (
      <nav>
          <ul>
              {posts.map((post) => (
                  <li key={post.id}>
                      <NavLink href={post.href} title={post.title} />
                  </li>
              ))}
          </ul>
      </nav>
    );
}