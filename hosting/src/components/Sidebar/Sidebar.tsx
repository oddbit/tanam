"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTanamDocumentTypes } from "../../hooks/useTanamDocumentTypes";
import { SidebarExpandableMenu, SidebarExpandableMenuSubItem } from "./SidebarExpandableMenu";
import { SidebarMenuGroup } from "./SidebarMenuGroup";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
  const pathname = usePathname() ?? "/";
  const {data: documentTypes} = useTanamDocumentTypes();

  const storedSidebarExpanded = "true";

  const [sidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({key}: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  // close sidebar when page is changed
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
          </SidebarMenuGroup>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
