const HeaderPage = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <header className="bg-none w-full max-w-7xl px-0 py-4 pt-8">
      <div className="flex flex-col text-left space-y-2 px-0 ">
        <h1 className="text-lg font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
    </header>
  );
};

export default HeaderPage;
