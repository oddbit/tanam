"use client";
import { ReactNode, useState } from "react";

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
  hide?: boolean;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
  hide,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  if (hide) return null;

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
