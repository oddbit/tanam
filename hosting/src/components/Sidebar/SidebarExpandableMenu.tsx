import Link from "next/link";
import {usePathname} from "next/navigation";
import React, {useState} from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";

interface ExpandableMenuProps {
  icon: React.ReactNode;
  title: string;
  menuItems: Array<{href: string; title: string}>;
  isExpanded: boolean;
}

export function SidebarExpandableMenu({icon, title, menuItems, isExpanded}: ExpandableMenuProps) {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(isExpanded);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const isActive = menuItems.some((item) => pathname.includes(item.href));

  return (
    <SidebarLinkGroup activeCondition={isActive}>
      {(handleClick) => (
        <React.Fragment>
          <Link
            href="#"
            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              isActive && "bg-graydark dark:bg-meta-4"
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleToggle();
              handleClick();
            }}
          >
            {icon}
            {title}
            <Image
              width={20}
              height={20}
              alt="Collapse Expand Icon"
              src={"/icons/sidebar/collapse-expand-icon.svg"}
              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${isOpen && "rotate-180"}`}
            />
          </Link>
          {/* <!-- Dropdown Menu Start --> */}
          <div className={`translate transform overflow-hidden ${!isOpen && "hidden"}`}>
            <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                      pathname === item.href && "text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <!-- Dropdown Menu End --> */}
        </React.Fragment>
      )}
    </SidebarLinkGroup>
  );
}
