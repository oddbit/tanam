interface PlaceholderAvatarProps {
  size?: number;
}

export default function PlaceholderAvatar({size = 24}: PlaceholderAvatarProps) {
  return (
    <div className="flex items-center justify-center">
      <span className="i-ic-baseline-person" style={{fontSize: size}} />
    </div>
  );
}
