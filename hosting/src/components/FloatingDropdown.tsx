import { useEffect, useRef } from "react";
import tippy, { Props } from "tippy.js";
// import "tippy.js/dist/tippy.css";

interface DropdownProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  content: React.ReactNode;
}

export function FloatingDropdown({ buttonRef, content }: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current && dropdownRef.current) {
      tippy(buttonRef.current, {
        // appendTo: () => document.body,
        content: dropdownRef.current,
        allowHTML: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom",
      } as Partial<Props>);
    }
  }, [buttonRef]);

  return (
    <>
      <div ref={dropdownRef} className="hidden">{content}</div>
    </>
  );
};