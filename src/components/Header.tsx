import Logo from "./Logo";
import StyledLink from "./StyledLink";

export default function Header() {
  return (
    <header className="gap-2 h-14 flex items-center container-2xl">
      <nav className="flex flex-1 items-center justify-between gap-1 text-xl font-medium">
        <div className="flex items-center gap-1">
          <Logo className="w-10 h-10" />
          <StyledLink to="/">Fermi Labs</StyledLink>
        </div>

        <div className="flex items-center gap-8">
          <StyledLink to="/">Docs</StyledLink>
          <StyledLink to="/">Whitepaper</StyledLink>
          <StyledLink to="/">Trade</StyledLink>
        </div>
      </nav>
    </header>
  );
}
