import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({sidebarOpen, setSidebarOpen}: HeaderProps) {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 flex items-center justify-center rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
            style={{width: "40px", height: "40px"}} // Adjust the size as needed
          >
            <span className="i-ic-round-menu w-[24px] h-[24px]" />
          </button>

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image width={32} height={32} src={"/images/logo.svg"} alt="Logo" />
          </Link>
        </div>
      </div>
    </header>
  );
}
