import React, {useEffect, useState} from "react";

interface ButtonProps {
  title: string;
  onClick: () => Promise<void> | void;
  style?: "normal" | "rounded" | "outline" | "outline-rounded" | "icon" | "icon-rounded";
  color?: "primary" | "meta-3" | "black";
  type?: "button" | "reset" | "submit";
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps) {
  const {title, onClick, style = "rounded", color = "primary", children, loading, disabled, type} = props;

  const [isLoading, setIsLoading] = useState(loading ?? false);
  const [isDisabled, setIsDisabled] = useState(disabled ?? false);

  useEffect(() => {
    return () => pruneState();
  }, []);

  function pruneState() {
    setIsLoading(false);
    setIsDisabled(false);
  }

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
    isLoading || isDisabled ? "disabled:opacity-50 opacity-50 cursor-not-allowed" : "",
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
    <button onClick={handleClick} className={styles.join(" ")} disabled={isLoading || isDisabled} type={type}>
      {isLoading && (
        <>
          <svg
            className={`animate-spin -ml-1 mr-3 h-5 w-5 ${style === "outline" || style === "outline-rounded" ? "text-white" : "text-" + color}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          <span>Processing...</span>
        </>
      )}

      {!isLoading && (
        <>
          {children}
          {style !== "icon" && style !== "icon-rounded" && <span>{title}</span>}
        </>
      )}
    </button>
  );
}
