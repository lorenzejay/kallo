import Link from "next/link";
const Header = () => {
  return (
    <header className="flex justify-between items-center h-24 px-10 text-white">
      <Link href="/">
        <h2 className="text-3xl font-bold">FREELANCIN</h2>
      </Link>
      <ul className="flex justify-between items-center w-48 ">
        <li>
          <Link href="/signin">Sign In</Link>
        </li>
        <li>
          <Link href="/signup">Sign Up</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
