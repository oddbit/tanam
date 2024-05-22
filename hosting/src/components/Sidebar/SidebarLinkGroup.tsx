"use client";
import { ReactNode, useState } from "react";

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

function SidebarLinkGroup({
  children,
  activeCondition,
}: SidebarLinkGroupProps) {
  const [open, setOpen] = useState<boolean>(activeCondition);

  function handleClick() {
    setOpen(!open);
  }

  return <li>{children(handleClick, open)}</li>;
}

export default SidebarLinkGroup;
