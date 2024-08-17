import NavLink from '@/components/navlinks';
export default function NoAccess() {
  return (
    <div>
      <h1>ERROR: Sorry, you do not have access to this page.</h1>
        <NavLink href="/">Home</NavLink>
    </div>
  );
}
