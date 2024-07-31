import React, {useState} from "react";

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
    "px-10",
    "py-4",
    "text-center",
    "font-medium",
    "hover:bg-opacity-90",
    "lg:px-8",
    "xl:px-10",
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
      styles.push(`border`, `border-${color}`, `text-${color}`, `bg-transparent`);
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
