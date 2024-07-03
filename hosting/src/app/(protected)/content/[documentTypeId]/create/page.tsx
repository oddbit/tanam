"use client";
import ContentCard from "@/components/Containers/ContentCard";
import {
  DynamicForm,
  DynamicFormProps
} from "@/components/Form";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import {ErrorPage} from '@/components/Error/ErrorPage';
import {useTanamDocumentFields} from "@/hooks/useTanamDocumentFields";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useParams} from "next/navigation";
import {Suspense, useState, useEffect} from "react";

const DocumentCreatePage = () => {
  const {documentTypeId} = useParams<{documentTypeId: string;}>() ?? {};
  const {data: documentType, error: typeError} = useTanamDocumentType(documentTypeId);
  const {data: documentFields, error: fieldsError} = useTanamDocumentFields(documentTypeId);

  console.info('documentTypeId :: ', documentTypeId)

  const [entry, setEntry] = useState<DynamicFormProps>({
    readonlyMode: false,
    fields: []
  });

  useEffect(() => {
    console.info('documentFields :: ', documentFields)

    if (documentFields) {
      setEntry({
        ...entry,
        fields: documentFields.map((field) => {
          console.info('field :: ', field)
          return {
            label: field.title.translated,
            placeholder: field.title.translated,
            fieldType: "input-text"
          }
        })
      })
      console.info('entry if :: ', entry)
    }

    console.info('entry :: ', entry)
  }, [documentFields]);

  if (typeError || fieldsError) {
    return (
      <>
        <ErrorPage 
          pageName={documentType?.titleSingular.translated ?? "Document details"}
          notificationType="error"
          notificationTitle="Error loading document"
          notificationMessage={typeError?.message || fieldsError?.message || "Unknown error"}
        />
      </>
    );
  }

  return (
    <>
      entry :: {JSON.stringify(entry)}
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titleSingular.translated} /> : <Loader />}
      </Suspense>
      {documentType && (
        <div className="grid grid-cols-1 gap-9">
          <ContentCard title={`Create New ${documentType.titleField}`}>
            <DynamicForm readonlyMode={entry.readonlyMode} fields={entry.fields} />
          </ContentCard>
        </div>
      )}
    </>
  );
};

export default DocumentCreatePage;
