interface PageHeaderProps {
  pageName: string;
  pageActions?: JSX.Element[];
}

export function PageHeader({pageName, pageActions = []}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">{pageName}</h2>
      {pageActions.length > 0 && <div>{pageActions.map((action) => action)}</div>}
    </div>
  );
}
