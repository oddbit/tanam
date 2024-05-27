import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {Metadata} from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Next.js Buttons | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Buttons page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Buttons = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Buttons" />

      {/* <!-- Normal Button Items --> */}
      <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Normal Button</h3>
        </div>

        <div className="p-4 md:p-6 xl:p-9">
          <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-20">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>
          </div>

          <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-20">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-meta-3 px-10 py-4 text-center font-medium text-meta-3 hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>
          </div>

          <div className="flex flex-wrap gap-5 xl:gap-20">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-black px-10 py-4 text-center font-medium text-black hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Button
            </Link>
          </div>
        </div>
      </div>

      {/* <!-- Button With Icon Items --> */}
      <div className="mb-10 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Button With Icon</h3>
        </div>

        <div className="p-4 md:p-6 xl:p-9">
          <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Email" src={"/icons/sidebar/email-icon-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Email" src={"/icons/sidebar/email-icon-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Email" src={"/icons/sidebar/email-icon-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Email Purple" src={"/icons/sidebar/email-icon-purple.svg"} />
              </span>
              Button With Icon
            </Link>
          </div>

          <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-7.5">
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Trolley" src={"/icons/sidebar/icon-trolley-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Trolley" src={"/icons/sidebar/icon-trolley-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Trolley" src={"/icons/sidebar/icon-trolley-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Trolley" src={"/icons/sidebar/icon-trolley-purple.svg"} />
              </span>
              Button With Icon
            </Link>
          </div>

          <div className="flex flex-wrap gap-5 xl:gap-7.5">
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Person" src={"/icons/sidebar/icon-person-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Person" src={"/icons/sidebar/icon-person-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-black px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Person" src={"/icons/sidebar/icon-person-white.svg"} />
              </span>
              Button With Icon
            </Link>

            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <Image width={20} height={20} alt="Icon Person" src={"/icons/sidebar/icon-person-purple.svg"} />
              </span>
              Button With Icon
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Buttons;
