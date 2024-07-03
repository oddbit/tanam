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

  const [entry, setEntry] = useState<DynamicFormProps>({
    readonlyMode: false,
    fields: []
  });

  useEffect(() => {
    if (documentFields) {
      setEntry({
        ...entry,
        fields: documentFields.map((field) => ({
          id: field.id,
          label: field.title.translated,
          placeholder: field.title.translated,
          fieldType: field.fieldType,
          value: ""
        }))
      });
    }
  }, [documentFields]);

  const handleFormChange = (updatedFields: { [key: string]: any }) => {
    // setEntry((prevEntry) => ({
    //   ...prevEntry,
    //   fields: prevEntry.fields.map((field) => ({
    //     ...field,
    //     value: updatedFields[field.id]
    //   }))
    // }));
    console.log("Updated form values:", updatedFields);
  };

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
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titleSingular.translated} /> : <Loader />}
      </Suspense>
      {documentType && (
        <div className="grid grid-cols-1 gap-9">
          <ContentCard title={`Create New ${documentType.titleSingular.translated}`}>
            <DynamicForm readonlyMode={entry.readonlyMode} fields={entry.fields} onFieldsChange={handleFormChange} />
          </ContentCard>
        </div>
      )}
    </>
  );
};

export default DocumentCreatePage;
