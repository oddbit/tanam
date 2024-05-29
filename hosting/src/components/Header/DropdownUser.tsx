import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useAuthentication} from "@/hooks/useAuthentication";

const DropdownUser = ({displayName, avatar}: {displayName: string; avatar: string}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const {signout} = useAuthentication();

  // close on click outside
  useEffect(() => {
    const clickHandler = ({target}: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) {
        return;
      }
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({keyCode}: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link ref={trigger} onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-4" href="#">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">{displayName}</span>
          <span className="block text-xs">UX Designer</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={avatar ?? "/images/user/user-01.png"}
            style={{width: "auto", height: "auto"}}
            alt="User"
          />
        </span>

        <img
          src="/icons/dropdown-arrow.svg"
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          alt="Dropdown Arrow"
        />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? "block" : "hidden"}`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <DropdownItem href="/profile" icon="/icons/profile.svg" label="My Profile" />
          <DropdownItem href="/settings" icon="/icons/settings.svg" label="Account Settings" />
        </ul>
        <button
          onClick={signout}
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          <img src="/icons/sign-out.svg" className="fill-current" width="22" height="22" alt="Log Out" />
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

const DropdownItem = ({href, icon, label}: {href: string; icon: string; label: string}) => (
  <li>
    <Link
      href={href}
      className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
    >
      <img src={icon} className="fill-current" width="22" height="22" alt={label} />
      {label}
    </Link>
  </li>
);

export default DropdownUser;
