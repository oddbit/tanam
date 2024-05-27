"use client";
import PageHeader from "@/components/common/PageHeader";
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
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Loader from "@/components/common/Loader";
import Notification from "@/components/common/Notification";
import {useTanamDocumentType} from "@/hooks/useTanamDocumentTypes";
import {useTanamDocument} from "@/hooks/useTanamDocuments";
import {TanamDocumentField} from "@/models/TanamDocumentField";
import {Timestamp} from "firebase/firestore";
import {Suspense} from "react";

const DocumentDetailsPage = () => {
  const {data: document, error: docError} = useTanamDocument();
  const {data: documentType, error: typeError} = useTanamDocumentType(document?.documentType);
  const viewMode = true;

  const renderFormElement = (field: TanamDocumentField, value: any) => {
    switch (field.type) {
      case "input-text":
      case "text-line":
        return (
          <FormGroup label={field.title} disabled={viewMode}>
            <Input type="text" disabled={viewMode} placeholder={field.title} value={value || ""} />
          </FormGroup>
        );
      case "textbox-rich":
      case "text-rich":
        return (
          <FormGroup disabled={viewMode} label={field.title}>
            <TextArea disabled={viewMode} rows={6} placeholder={field.title} value={value || ""} />
          </FormGroup>
        );
      case "datepicker":
      case "date":
        return (
          <DatePicker
            disabled={viewMode}
            label={field.title}
            placeholder="mm/dd/yyyy"
            defaultValue={(value as Timestamp).toDate()}
          />
        );
      case "file-upload":
        return <FileUpload disabled={viewMode} label={field.title} />;
      case "switcher":
        return <Switcher disabled={viewMode} defaultChecked={value} />;
      case "radio":
        return <RadioButton disabled={viewMode} label={field.title} />;
      case "checkbox":
        return <Checkbox />;
      case "dropdown":
        return <Dropdown disabled={viewMode} options={[]} placeholder={field.title} id={""} />;
      default:
        return null;
    }
  };

  if (docError || typeError) {
    return (
      <DefaultLayout>
        <PageHeader pageName={documentType?.titleSingular ?? "Document details"} />
        <Notification
          type="error"
          title="Error loading document"
          message={docError?.message || typeError?.message || "Unknown error"}
        />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Suspense fallback={<Loader />}>
        {documentType ? <PageHeader pageName={documentType.titleSingular} /> : <Loader />}
      </Suspense>
      {documentType && document && (
        <div className="grid grid-cols-1 gap-9">
          <ContentCard key={document.id} title={document.data[documentType.documentTitleField]}>
            {documentType.fields.map((field) => renderFormElement(field, document.data[field.key]))}
          </ContentCard>
        </div>
      )}
    </DefaultLayout>
  );
};

export default DocumentDetailsPage;
