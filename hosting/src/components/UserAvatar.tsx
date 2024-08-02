import {useTanamUserImage} from "@/hooks/useTanamUser";
import Image from "next/image";
import {Suspense} from "react";

interface UserImageProps {
  uid?: string;
  size?: number;
}

export default function UserAvatar({uid, size = 112}: UserImageProps) {
  const {imageUrl} = useTanamUserImage(uid);

  return (
    <Suspense fallback={<PlaceholderAvatar size={size} />}>
      {imageUrl ? (
        <Image
          id={`UserAvatar-${uid}`}
          width={size}
          height={size}
          src={imageUrl}
          style={{width: "auto", height: "auto"}}
          alt="User Profile picture"
        />
      ) : (
        <PlaceholderAvatar size={size} />
      )}
    </Suspense>
  );
}

function PlaceholderAvatar({size}: {size: number}) {
  return (
    <div className="flex items-center justify-center">
      <span className="i-ic-baseline-person" style={{fontSize: size}} />
    </div>
  );
}
