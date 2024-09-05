"use client";
import { SidebarExpandableMenu, SidebarExpandableMenuSubItem } from "@tanam/cms/components/Sidebar/SidebarExpandableMenu";
import { SidebarMenuGroup } from "@tanam/cms/components/Sidebar/SidebarMenuGroup";
import { SidebarMenuItem } from "@tanam/cms/components/Sidebar/SidebarMenuItem";
import { useAuthentication } from "@tanam/cms/hooks/useAuthentication";
import { useTanamDocumentTypes } from "@tanam/cms/hooks/useTanamDocumentTypes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
  const pathname = usePathname() ?? "/";
  const {data: documentTypes} = useTanamDocumentTypes();
  const {authUser, signout} = useAuthentication();

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({key}: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // close sidebar when page is changed or window resize
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, windowSize]);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return (
    <aside
      className={`absolute left-0 top-0 z-99 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/" className="flex items-center space-x-2">
          <Image width={32} height={32} src={"/images/logo.svg"} alt="Logo" priority />
          <h1 className="text-3xl font-bold leading-none">Tanam</h1>
        </Link>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <SidebarMenuGroup title="MENU">
            <SidebarMenuItem
              href="/dashboard"
              icon={<span className="i-ic-outline-dashboard w-[24px] h-[24px]" />}
              title="Dashboard"
            />
            <SidebarExpandableMenu
              icon={<span className="i-ic-twotone-format-indent-decrease w-[24px] h-[24px]" />}
              title="Content"
              isExpanded={pathname.includes("/content/")}
            >
              {documentTypes.map((docType) => (
                <SidebarExpandableMenuSubItem
                  key={docType.id}
                  href={`/content/${docType.id}`}
                  title={docType.titlePlural.translated}
                />
              ))}
            </SidebarExpandableMenu>
            <SidebarMenuItem
              href="/settings"
              icon={<span className="i-ic-outline-settings w-[24px] h-[24px]" />}
              title="Settings"
            />
            {authUser && (
              <>
                <hr />
                <SidebarMenuItem
                  href="#"
                  icon={<span className="i-ic-outline-logout w-[24px] h-[24px]" />}
                  title="Signout"
                  onClick={signout}
                />
              </>
            )}
          </SidebarMenuGroup>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
