import React from "react";

interface SidebarMenuGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarMenuGroup({ title, children }: SidebarMenuGroupProps) {
  return (
    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
        {title}
      </h3>
      <ul className="mb-6 flex flex-col gap-1.5">{children}</ul>
    </div>
  );
}
