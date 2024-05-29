import "@/assets/scss/layout-authentication.scss";
import ClientOnly from "@/components/ClientOnly";
import FirebaseUi from "@/components/FirebaseUi";
import {Metadata} from "next";
import Image from "next/image";
import {useRouter} from "next/router";

export const metadata: Metadata = {
  title: "Tanam | Authentication",
  description: "Authentication in Tanam",
};

export default function AuthPage() {
  const router = useRouter();
  const {authAction} = router.query;
  const isSignUp = authAction === "signup";

  return (
    <>
      <section className="l-authentication">
        <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="flex justify-center">
            <Image src="/favicon.ico" width={80} height={80} alt="tanam icon" />
            <h1 className="text-gray-500 mt-10 text-lg font-bold authentication__title">
              {isSignUp ? "Signup" : "Signin"}
            </h1>
          </div>

          <div className="authentication__wrapper-content">
            <ClientOnly>
              <FirebaseUi isSignUp={isSignUp} />
            </ClientOnly>
          </div>
        </div>
      </section>
    </>
  );
}
