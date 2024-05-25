import "@/assets/scss/layout-landing-page.scss";
import {Metadata} from "next";
import BlankLayout from "@/components/Layouts/BlankLayout";

export const metadata: Metadata = {
  title: "Tanam | Signin",
  description: "Signin in Tanam",
};

export default function SigninPage() {
  return (
    <BlankLayout>
      <section className="l-landing-page">
        <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <div className="flex justify-center">
            <img src="/favicon.ico" width={80} height={80} />
            <h1 className="text-gray-500 mt-10 text-lg font-bold text-white landing-page__title">Tanam CMS | Signin</h1>
          </div>
        </div>
      </section>
    </BlankLayout>
  );
}
