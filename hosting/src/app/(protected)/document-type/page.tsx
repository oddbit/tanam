// hosting/src/app/[site]/document-type/page.tsx
"use client";
import {Button} from "@/components/Button";
import ContentCard from "@/components/Containers/ContentCard";
import {Table, TableRowActions, TableRowLabel} from "@/components/Table";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useCreateDocumentType} from "@/hooks/useCreateDocumentType";
import {useTanamDocumentTypes} from "@/hooks/useTanamDocumentTypes";
import {UserNotification} from "@/models/UserNotification";
import {getDocumentTypeArticle, getDocumentTypePerson} from "@/utils/documentTypeGenerator";
import {useRouter} from "next/navigation";
import {Suspense, useEffect, useState} from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documentTypes, error: typesError} = useTanamDocumentTypes();
  const {createType, error: createError} = useCreateDocumentType();
  const router = useRouter();
  const [notification, setNotification] = useState<UserNotification | null>(null);

  useEffect(() => {
    setNotification(typesError || createError);
  }, [typesError, createError]);

  const handleCreateArticle = async () => {
    const {data, fields} = getDocumentTypeArticle();
    await createType(data, fields);
  };

  const handleCreatePerson = async () => {
    const {data, fields} = getDocumentTypePerson();
    await createType(data, fields);
  };

  const hasArticleType = documentTypes.some((type) => type.id === "article");
  const hasPersonType = documentTypes.some((type) => type.id === "person");

  return (
    <>
      <PageHeader pageName="Content types" />
      {(!hasArticleType || !hasPersonType) && (
        <ContentCard>
          {!hasArticleType && <Button onClick={handleCreateArticle} title="Create Article Type" />}
          {!hasPersonType && <Button onClick={handleCreatePerson} title="Create Person Type" />}
        </ContentCard>
      )}
      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}
      <Suspense fallback={<Loader />}>
        <Table
          headers={["Id", "Title", "Status", "Documents", "Actions"]}
          rows={documentTypes.map((type, key) => [
            <div key={`${key}-${type.id}-id`}>
              <h5 className="font-medium text-black dark:text-white">{type.id}</h5>
            </div>,
            <p key={`${key}-${type.id}-title`} className="text-black dark:text-white">
              {type.titlePlural.translated}
            </p>,
            <p key={`${key}-${type.id}-count`} className="text-black dark:text-white">
              {0}
            </p>,
            <TableRowLabel
              key={`${key}-${type.id}-status`}
              title={type.isEnabled ? "Enabled" : "Disabled"}
              status={type.isEnabled ? "success" : "info"}
            />,
            <TableRowActions
              key={`${key}-${type.id}-actions`}
              onView={() => router.push(`/document-type/${type.id}`)}
            />,
          ])}
        />
      </Suspense>
    </>
  );
}
