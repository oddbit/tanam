import "@/assets/scss/layout-authentication.scss";
import {Metadata} from "next";
import BlankLayout from "@/components/Layouts/BlankLayout";
import FirebaseUi from "@/components/FirebaseUi";
import ClientOnly from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "Tanam | Signup",
  description: "Signup in Tanam",
};

export default function SigninPage() {
  return (
    <BlankLayout>
      <section className="l-authentication">
        <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="flex justify-center">
            <img src="/favicon.ico" width={80} height={80} />
            <h1 className="text-gray-500 mt-10 text-lg font-bold text-white authentication__title">Signup</h1>
          </div>

          <div className="authentication__wrapper-content">
            <ClientOnly>
              <FirebaseUi isSignUp={true} />
            </ClientOnly>
          </div>
        </div>
      </section>
    </BlankLayout>
  );
}
