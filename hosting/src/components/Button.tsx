import React, { useState } from "react";

interface ButtonProps {
  title: string;
  onClick: () => Promise<void> | void;
  style?: "normal" | "rounded" | "outline" | "icon";
  color?: "primary" | "meta-3" | "black";
  children?: React.ReactNode;
}

export function Button({title, onClick, style = "rounded", color = "primary", children}: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  const styles = [
    "inline-flex",
    "items-center",
    "justify-center",
    "px-6",
    "py-2",
    "text-center",
    "font-medium",
    "hover:bg-opacity-90",
    isLoading ? "opacity-50 cursor-not-allowed" : "",
  ];

  switch (color) {
    case "primary":
      styles.push("bg-primary text-gray hover:bg-opacity-90");
      break;
    case "meta-3":
      styles.push("bg-meta-3 text-white hover:bg-opacity-90");
      break;
    case "black":
      styles.push("bg-black text-white hover:bg-opacity-90");
      break;
    default:
      styles.push("bg-primary text-gray hover:bg-opacity-90");
  }

  switch (style) {
    case "normal":
      break;
    case "rounded":
      styles.push("rounded-md");
      break;
    case "outline":
      styles.push("border border-stroke text-black hover:shadow-1 dark:border-strokedark dark:text-white");
      break;
    case "icon":
      break;
    default:
      break;
  }

  return (
    <button onClick={handleClick} className={styles.join(" ")} disabled={isLoading}>
      {children}
      {style !== "icon" && <span>{title}</span>}
    </button>
  );
}
