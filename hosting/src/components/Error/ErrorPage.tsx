import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";

interface ErrorPageProps {
  pageName: string;
  notificationType: "warning" | "success" | "error";
  notificationTitle: string;
  notificationMessage: string;
}

export function ErrorPage({pageName, notificationType, notificationTitle, notificationMessage}: ErrorPageProps) {
  return (
    <>
      <PageHeader pageName={pageName ?? "Error"} />
      <Notification
        type={notificationType ?? "error"}
        title={notificationTitle ?? "Error"}
        message={notificationMessage ?? "Unknown error"}
      />
    </>
  );
};