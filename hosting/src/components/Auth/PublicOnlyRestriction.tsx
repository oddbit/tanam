import Loader from "@/components/common/Loader";
import {useAuthUserState} from "@/contexts/AuthUserContext";
import {useRouter} from "next/navigation";
import {Suspense, useEffect} from "react";

interface PublicOnlyRestrictionProps {
  children: React.ReactNode;
}

export default function PublicOnlyRestriction({children}: PublicOnlyRestrictionProps) {
  const {state} = useAuthUserState();
  const router = useRouter();

  useEffect(() => {
    if (state.userInfo) {
      router.replace("/");
    }
  }, [state.userInfo, router]);

  if (state.userInfo) {
    return (
      <Suspense fallback={<Loader />}>
        <Loader />
      </Suspense>
    );
  }

  return <>{children}</>;
}
