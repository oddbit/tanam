interface NotificationProps {
  type: "warning" | "success" | "error";
  title: string;
  message: string;
}

export function Notification({type, title, message}: NotificationProps) {
  let colorClasses = "";
  let IconComponent = null;

  switch (type) {
    case "warning":
      colorClasses = "border-warning bg-warning bg-opacity-[15%] text-[#9D5425]";
      IconComponent = WarningIcon;
      break;
    case "success":
      colorClasses = "border-[#34D399] bg-[#34D399] bg-opacity-[15%] text-black dark:text-[#34D399]";
      IconComponent = SuccessIcon;
      break;
    case "error":
      colorClasses = "border-[#F87171] bg-[#F87171] bg-opacity-[15%] text-[#B45454]";
      IconComponent = ErrorIcon;
      break;
  }

  return (
    <div
      className={`flex w-full border-l-6 ${colorClasses} px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9 mb-4`}
    >
      {IconComponent && <IconComponent />}
      <div className="w-full">
        <h5 className="mb-3 text-lg font-semibold">{title}</h5>
        <p className="leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <div className="mr-5 flex h-9 w-9 items-center justify-center rounded-lg bg-warning bg-opacity-30">
      <span className="i-ic-round-warning  w-[22px] h-[22px] text-warning" />
    </div>
  );
}

function SuccessIcon() {
  return (
    <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
      <span className="i-ic-round-check  w-[22px] h-[22px] text-white" />
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
      <span className="i-ic-round-close w-[22px] h-[22px] text-white" />
    </div>
  );
}
