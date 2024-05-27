import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {Metadata} from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Next.js Alerts | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Alerts page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

const Alerts = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Alerts" />

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          {/* <!-- Alerts Item --> */}
          <div className="flex w-full border-l-6 border-warning bg-warning bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning bg-opacity-30">
              <Image width={19} height={16} alt="Icon Alerts" src={"/icons/sidebar/alerts-icon.svg"} />
            </div>
            <div className="w-full">
              <h5 className="mb-3 text-lg font-semibold text-[#9D5425]">Attention needed</h5>
              <p className="leading-relaxed text-[#D0915C]">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when
              </p>
            </div>
          </div>
          {/* <!-- Alerts Item --> */}
          <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
              <Image width={16} height={12} alt="Checked Icon" src={"/icons/sidebar/checked-icon.svg"} />
            </div>
            <div className="w-full">
              <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">Message Sent Successfully</h5>
              <p className="text-base leading-relaxed text-body">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
            </div>
          </div>
          {/* <!-- Alerts Item --> */}
          <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
              <Image width={13} height={13} alt="Icon Close" src={"/icons/sidebar/icon-close.svg"} />
            </div>
            <div className="w-full">
              <h5 className="mb-3 font-semibold text-[#B45454]">There were 1 errors with your submission</h5>
              <ul>
                <li className="leading-relaxed text-[#CD5D5D]">Lorem Ipsum is simply dummy text of the printing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Alerts;
