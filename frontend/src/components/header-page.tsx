const HeaderPage = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <header className="bg-none w-full max-w-7xl px-0 py-2">
      <div className="flex flex-col h-16 text-left space-y-2 px-0 py-2">
        <h1 className="text-lg font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
};

export default HeaderPage;
