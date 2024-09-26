interface BadgeProps {
  title: string;
  className?: string;
  onRemove?: () => void;
}

export function Badge(props: BadgeProps) {
  const {title, className, onRemove} = props;

  let badgeClassName = "border px-3 py-1 text-xs font-semibold rounded-full";
  badgeClassName = className ? badgeClassName.concat(` ${className}`) : badgeClassName;

  return (
    <div className={badgeClassName}>
      <div className="relative w-full inline-flex items-center justify-between">
        <span>{title}</span>

        {onRemove && (
          <button onClick={onRemove} aria-label="Remove badge" className="ml-2">
            <span className="relative top-[2px] i-ic-close" />
          </button>
        )}
      </div>
    </div>
  );
}
