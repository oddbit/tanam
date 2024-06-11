"use client";
import {Button} from "@/components/Button";
import ContentCard from "@/components/Containers/ContentCard";
import {Table, TableRowLabel} from "@/components/Table";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useCreateDocumentType} from "@/hooks/useCreateDocumentType";
import {useTanamDocumentTypes} from "@/hooks/useTanamDocumentTypes";
import {UserNotification} from "@/models/UserNotification";
import {getDocumentTypeArticle, getDocumentTypePerson} from "@/utils/documentTypeGenerator";
import Link from "next/link";
import {Suspense, useEffect, useState} from "react";

export default function DocumentTypeDocumentsPage() {
  const {data: documentTypes, error: typesError} = useTanamDocumentTypes();
  const {createType, error: createError} = useCreateDocumentType();
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
          headers={["Title", "Status", "Documents"]}
          rows={documentTypes.map((type, key) => [
            <Link key={`${key}-${type.id}-title`} href={`/content/${type.id}`}>
              <p className="text-black dark:text-white">{type.titlePlural.translated}</p>
            </Link>,
            <p key={`${key}-${type.id}-count`} className="text-black dark:text-white">
              {0}
            </p>,
            <TableRowLabel
              key={`${key}-${type.id}-status`}
              title={type.isEnabled ? "Enabled" : "Disabled"}
              status={type.isEnabled ? "success" : "info"}
            />,
          ])}
        />
      </Suspense>
    </>
  );
}
