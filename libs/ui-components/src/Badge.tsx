interface BadgeProps {
  title: string;
  className?: string;
}

export function Badge(props: BadgeProps) {
  const {title, className} = props;

  const badgeClassName = `block border px-3 py-1 text-xs font-semibold rounded-full ${className}`;

  return <span className={badgeClassName}>{title}</span>;
}
