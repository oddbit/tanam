"use client";
import ContentCard from "@/components/Containers/ContentCard";
import {
  Checkbox,
  DatePicker,
  Dropdown,
  FileUpload,
  FormGroup,
  Input,
  RadioButton,
  Switcher,
  TextArea,
} from "@/components/Form";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import {ErrorPage} from '@/components/Error/ErrorPage';
import {useTanamDocumentFields} from "@/hooks/useTanamDocumentFields";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {TanamDocumentField} from "@functions/models/TanamDocumentField";
import {Timestamp} from "firebase/firestore";
import {useParams, useRouter} from "next/navigation";
import {Suspense, useState} from "react";

const DocumentDetailsPage = () => {
  const router = useRouter();
  const {documentTypeId, documentId} = useParams<{documentTypeId: string; documentId: string}>() ?? {};
  const {data: document, error: documentError} = useTanamDocument(documentId);
  const {data: documentType, error: typeError} = useTanamDocumentType(documentTypeId);
  const {data: documentFields, error: fieldsError} = useTanamDocumentFields(documentTypeId);

  const [readonlyMode] = useState<boolean>(true);

  if (!!document?.documentType && document?.documentType !== documentTypeId) {
    router.push(`/content/${document?.documentType}/${document?.id}`);
    return <Loader />;
  }

  const renderFormElement = (field: TanamDocumentField, value: any) => {
    const formgroupKey = `formgroup-${field.id}`;
    const inputKey = `input-${field.id}`;
    switch (field.type) {
      case "input-text":
      case "text-line":
        return (
          <FormGroup key={formgroupKey} label={field.title.translated} disabled={readonlyMode}>
            <Input
              key={inputKey}
              type="text"
              disabled={readonlyMode}
              placeholder={field.title.translated}
              value={value || ""}
            />
          </FormGroup>
        );
      case "html":
      case "textbox-rich":
      case "text-rich":
        return (
          <FormGroup key={`formgroup-${field.id}`} disabled={readonlyMode} label={field.title.translated}>
            <TextArea
              key={inputKey}
              disabled={readonlyMode}
              rows={6}
              placeholder={field.title.translated}
              value={value || ""}
            />
          </FormGroup>
        );
      case "datepicker":
      case "date":
        return (
          <DatePicker
            key={inputKey}
            disabled={readonlyMode}
            label={field.title.translated}
            placeholder="mm/dd/yyyy"
            defaultValue={(value as Timestamp).toDate()}
          />
        );
      case "file-upload":
        return <FileUpload key={inputKey} disabled={readonlyMode} label={field.title.translated} />;
      case "switcher":
        return <Switcher key={inputKey} disabled={readonlyMode} defaultChecked={value} />;
      case "radio":
        return <RadioButton key={inputKey} disabled={readonlyMode} label={field.title.translated} />;
      case "checkbox":
        return <Checkbox key={inputKey} />;
      case "dropdown":
        return (
          <Dropdown key={inputKey} disabled={readonlyMode} options={[]} placeholder={field.title.translated} id={""} />
        );
      default:
        return null;
    }
  };

  if (documentError || typeError || fieldsError) {
    return (
      <>
        <ErrorPage 
          pageName={documentType?.titleSingular.translated ?? "Document details"}
          notificationType="error"
          notificationTitle="Error loading document"
          notificationMessage={documentError?.message || typeError?.message || fieldsError?.message || "Unknown error"}
        />
      </>
    );
  }

  return (
    <>
      dynamic idsss
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titleSingular.translated} /> : <Loader />}
      </Suspense>
      {documentType && document && (
        <div className="grid grid-cols-1 gap-9">
          <ContentCard key={document.id} title={document.data[documentType.titleField] as string}>
            <Suspense fallback={<Loader />}>
              {documentFields.map((field) => renderFormElement(field, document.data[field.id]))}
            </Suspense>
          </ContentCard>
        </div>
      )}
    </>
  );
};

export default DocumentDetailsPage;
