import Link from "next/link";
import {usePathname} from "next/navigation";
import React, {useState} from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";
import {CollapseExpandIcon} from "./icons/CollapseExpandIcon";

interface ExpandableMenuProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
}

export function SidebarExpandableMenu({icon, title, children, isExpanded}: ExpandableMenuProps) {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(isExpanded);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarLinkGroup activeCondition={pathname.includes(title.toLowerCase())}>
      {(handleClick) => (
        <React.Fragment>
          <Link
            href="#"
            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              pathname.includes(title.toLowerCase()) && "bg-graydark dark:bg-meta-4"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleToggle();
              handleClick();
            }}
          >
            {icon}
            {title}
            <CollapseExpandIcon isOpen={isOpen} />
          </Link>
          <div className={`translate transform overflow-hidden ${!isOpen && "hidden"}`}>
            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">{children}</ul>
          </div>
        </React.Fragment>
      )}
    </SidebarLinkGroup>
  );
}

interface SidebarExpandableMenuSubItemProps {
  href: string;
  title: string;
}

export function SidebarExpandableMenuSubItem({href, title}: SidebarExpandableMenuSubItemProps) {
  const pathname = usePathname() ?? "/";

  return (
    <li key={href}>
      <Link
        href={href}
        className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
          pathname === href && "text-white"
        }`}
      >
        {title}
      </Link>
    </li>
  );
}
