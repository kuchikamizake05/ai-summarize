const Header = ({ title }) => {
  return (
    <header className="bg-[var(--theme-bg-primary)] border-b border-[var(--theme-divider-color)] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <h1 className="text-xl font-medium text-[var(--theme-text-primary)]">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
