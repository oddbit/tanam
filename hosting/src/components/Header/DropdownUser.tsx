import UserAvatar from "@/components/UserAvatar";
import {useAuthentication} from "@/hooks/useAuthentication";
import {clsx} from "clsx";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";

interface DropdownItemProps {
  href: string;
  icon: string;
  label: string;
}

function DropdownItem({href, icon, label}: DropdownItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
      >
        <span className={clsx("w-[24px] h-[24px]", icon)} />
        {label}
      </Link>
    </li>
  );
}

export default function DropdownUser() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);
  const {authUser, signout} = useAuthentication();

  // close on click outside
  useEffect(() => {
    const clickHandler = ({target}: MouseEvent) => {
      if (!dropdown.current || !trigger.current) return;
      if (!dropdownOpen || dropdown.current.contains(target as Node) || trigger.current.contains(target as Node)) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({keyCode}: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  return (
    <div className="relative">
      <Link ref={trigger} onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-4" href="#">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">{authUser?.displayName}</span>
        </span>

        <span className="rounded-full">
          <UserAvatar uid={authUser?.uid} size={40} />
        </span>
        <span className="i-ic-round-keyboard-arrow-down w-[24px] h-[24px]" />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <DropdownItem href="/profile" icon="i-ic-baseline-person-outline" label="My Profile" />
          <DropdownItem href="/settings" icon="i-ic-outline-settings" label="Account Settings" />
        </ul>
        <button
          onClick={signout}
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          <span className="i-ic-outline-logout w-[24px] h-[24px]" />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
}
