interface BadgeProps {
  title: string;
  className?: string;
  onRemove?: () => void;
}

export function Badge(props: BadgeProps) {
  const {title, className, onRemove} = props;

  const badgeClassName = `block border px-3 py-1 text-xs font-semibold rounded-full ${className}`;

  return (
    <span className={badgeClassName}>
      {title}
      {onRemove && (
        <button onClick={onRemove} aria-label="Remove badge" className="ml-2">
          <span className="i-ic-close w-[10px] h-[10px]" />
        </button>
      )}
    </span>
  );
}
