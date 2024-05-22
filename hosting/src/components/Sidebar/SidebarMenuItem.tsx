import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarMenuProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

export function SidebarMenuItem({ href, icon, title }: SidebarMenuProps) {
  const pathname = usePathname() ?? "/";

  const isActive = pathname.includes(href);

  return (
    <li>
      <Link
        href={href}
        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
          isActive && "bg-graydark dark:bg-meta-4"
        }`}
      >
        {icon}
        {title}
      </Link>
    </li>
  );
}
