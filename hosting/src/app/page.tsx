import "@/assets/css/satoshi.css";
import "@/assets/css/style.css";
import {Metadata} from "next";
import BlankLayout from "@/components/Layouts/BlankLayout";

export const metadata: Metadata = {
  title: "Tanam CMS",
  description: "Tanam CMS",
};

export default function LandingPage() {
  return (
    <>
      <BlankLayout>
        <section className="bg-gray">
          pink
        </section>
        
        <div className="fixed left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform text-center">
          <h1 className="text-3xl font-bold text-red">Ups..</h1>
          <p className="text-gray-500 mt-10 text-lg font-bold">
            Something went wrong
          </p>
          <p>We are working on fixing this issue. Please try again</p>
          <button
            className="hover:bg-primary-dark mt-10 rounded-md bg-primary px-4 py-2 text-white transition-colors"
          >
            Try again
          </button>
        </div>
      </BlankLayout>
    </>
  );
}
