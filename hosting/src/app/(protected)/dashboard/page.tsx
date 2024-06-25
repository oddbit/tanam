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
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {useTanamDocumentFields} from "@/hooks/useTanamDocumentFields";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {TanamDocumentField} from "@functions/models/TanamDocumentField";
import {Timestamp} from "firebase/firestore";
import {Suspense} from "react";

export default function DashboardPage() {
  const {data: document, error: docError} = useTanamDocument();
  const {data: documentType, error: typeError} = useTanamDocumentType(document?.documentType);
  const {data: documentFields, error: fieldsError} = useTanamDocumentFields(document?.documentType);
  const viewMode = true;

  const renderFormElement = (field: TanamDocumentField, value: any) => {
    switch (field.type) {
      case "input-text":
      case "text-line":
        return (
          <FormGroup label={field.title.translated} disabled={viewMode}>
            <Input type="text" disabled={viewMode} placeholder={field.title.translated} value={value || ""} />
          </FormGroup>
        );
      case "textbox-rich":
      case "text-rich":
        return (
          <FormGroup disabled={viewMode} label={field.title.translated}>
            <TextArea disabled={viewMode} rows={6} placeholder={field.title.translated} value={value || ""} />
          </FormGroup>
        );
      case "datepicker":
      case "date":
        return (
          <DatePicker
            disabled={viewMode}
            label={field.title.translated}
            placeholder="mm/dd/yyyy"
            defaultValue={(value as Timestamp).toDate()}
          />
        );
      case "file-upload":
        return <FileUpload disabled={viewMode} label={field.title.translated} />;
      case "switcher":
        return <Switcher disabled={viewMode} defaultChecked={value} />;
      case "radio":
        return <RadioButton disabled={viewMode} label={field.title.translated} />;
      case "checkbox":
        return <Checkbox />;
      case "dropdown":
        return <Dropdown disabled={viewMode} options={[]} placeholder={field.title.translated} id={""} />;
      default:
        return null;
    }
  };

  if (docError || typeError || fieldsError) {
    return (
      <>
        <PageHeader pageName={documentType?.titleSingular.translated ?? "Document details"} />
        <Notification
          type="error"
          title="Error loading document"
          message={docError?.message || typeError?.message || "Unknown error"}
        />
      </>
    );
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titleSingular.translated} /> : <Loader />}
      </Suspense>
      {documentType && document && (
        <div className="grid grid-cols-1 gap-9">
          <ContentCard key={document.id} title={document.data[documentType.documentTitleField] as string}>
            <Suspense fallback={<Loader />}>
              {documentFields.map((field) => renderFormElement(field, document.data[field.id]))}
            </Suspense>
          </ContentCard>
        </div>
      )}
    </>
  );
}
