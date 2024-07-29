import {useTanamUserImage} from "@/hooks/useTanamUser";
import Image from "next/image";

interface UserImageProps {
  uid?: string;
  size?: number;
}

export default function UserAvatar({uid, size = 112}: UserImageProps) {
  const {imageUrl} = useTanamUserImage(uid);

  return imageUrl ? (
    <Image
      id={`UserAvatar-${uid}`}
      width={size}
      height={size}
      src={imageUrl}
      style={{width: "auto", height: "auto"}}
      alt="User Profile picture"
    />
  ) : (
    // Placeholder Avatar
    <div className="flex items-center justify-center">
      <span className="i-ic-baseline-person" style={{fontSize: size}} />
    </div>
  );
}
