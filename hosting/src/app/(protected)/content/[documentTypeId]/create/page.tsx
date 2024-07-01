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
import {TanamDocumentField} from "@functions/models/TanamDocumentField";
import {Timestamp} from "firebase/firestore";
import {useParams} from "next/navigation";
import {Suspense, useState} from "react";

const DocumentCreatePage = () => {
  const {documentTypeId} = useParams<{documentTypeId: string;}>() ?? {};
  const {data: documentType, error: typeError} = useTanamDocumentType(documentTypeId);
  const {data: documentFields, error: fieldsError} = useTanamDocumentFields(documentTypeId);

  console.info('documentTypeId :: ', documentTypeId)

  const [readonlyMode] = useState<boolean>(false);

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
          <ContentCard title={`Create New ${documentType.titleField}`}>
            <Suspense fallback={<Loader />}>
              {documentFields.map((field) => renderFormElement(field, ""))}
            </Suspense>
          </ContentCard>
        </div>
      )}
    </>
  );
};

export default DocumentCreatePage;
