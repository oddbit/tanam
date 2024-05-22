"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTanamDocumentTypes } from "../../hooks/useTanamDocumentTypes";
import { TanamDocumentType } from "../../models/TanamDocumentType";
import { SidebarExpandableMenu } from "./SidebarExpandableMenu";
import { SidebarMenuGroup } from "./SidebarMenuGroup";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { DashboardIcon } from "./icons/DashboardIcon";
import { FormsIcon } from "./icons/FormsIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { SettingsIcon } from "./icons/SettingsIcon";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname() ?? "/";
  const site = pathname.split("/")[1];
  const [documentTypes, setDocumentTypes] = useState<TanamDocumentType[]>([]);

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const { streamDocumentTypes } = useTanamDocumentTypes(site ?? "foo");

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // Get tanam document types
  useEffect(() => {
    const unsubscribe = streamDocumentTypes((documentTypes) => {
      setDocumentTypes(documentTypes);
    });
    return () => unsubscribe();
  }, [streamDocumentTypes]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
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

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            width={32}
            height={32}
            src={"/images/logo/logo.svg"}
            alt="Logo"
            priority
          />
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
              href="/"
              icon={<DashboardIcon />}
              title="Dashboard"
            />
            <SidebarMenuItem
              href="/profile"
              icon={<ProfileIcon />}
              title="Profile"
            />
            <SidebarExpandableMenu
              icon={<FormsIcon />}
              title="Content"
              isExpanded={pathname.includes("/document-types/")}
              menuItems={documentTypes.map((doc) => ({
                href: `/document-types/${doc.id}`,
                title: doc.title,
              }))}
            />
            <SidebarMenuItem
              href="/settings"
              icon={<SettingsIcon />}
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
