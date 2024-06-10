import Image from "next/image";
import PlaceholderAvatar from "./PlaceholderAvatar";

interface UserImageProps {
  src: string | null;
  size?: number;
}

export default function UserAvatar({src, size = 112}: UserImageProps) {
  return src ? (
    <Image width={size} height={size} src={src} style={{width: "auto", height: "auto"}} alt="User Profile picture" />
  ) : (
    <PlaceholderAvatar size={size} />
  );
}
