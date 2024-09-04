import React, {useState} from "react";

interface ButtonProps {
  title: string;
  onClick: () => Promise<void> | void;
  style?: "normal" | "rounded" | "outline" | "outline-rounded" | "icon" | "icon-rounded";
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

  let styles = [
    "inline-flex",
    "items-center",
    "justify-center",
    "px-4",
    "py-2",
    "text-center",
    "font-medium",
    "hover:bg-opacity-90",
    isLoading ? "opacity-50 cursor-not-allowed" : "",
  ];

  switch (color) {
    case "primary":
      styles.push("bg-primary", "text-white");
      break;
    case "meta-3":
      styles.push("bg-meta-3", "text-white");
      break;
    case "black":
      styles.push("bg-black", "text-white");
      break;
    default:
      styles.push("bg-primary", "text-white");
  }

  switch (style) {
    case "normal":
      break;
    case "rounded":
      styles.push("rounded-md");
      break;
    case "outline":
      styles = styles.filter((style) => style !== "text-white");
      styles.push(`border`, `border-${color}`, `text-${color}`, `bg-transparent`);
      break;
    case "outline-rounded":
      styles = styles.filter((style) => style !== "text-white");
      styles.push(`border`, `border-${color}`, `text-${color}`, `bg-transparent`, "rounded-md");
      break;
    case "icon":
      break;
    case "icon-rounded":
      styles.push("rounded-md");
      break;
    default:
      break;
  }

  return (
    <button onClick={handleClick} className={styles.join(" ")} disabled={isLoading}>
      {children}
      {style !== "icon" && style !== "icon-rounded" && <span>{title}</span>}
    </button>
  );
}
