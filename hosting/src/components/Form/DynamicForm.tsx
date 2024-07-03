import React, {Suspense} from "react";
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
import {FieldType} from "@functions/definitions/FieldType";
import {v4 as uuidv4} from "uuid";
import {Timestamp} from 'firebase/firestore';
import {Option} from '@/components/Form/Dropdown';

export interface DynamicFormField {
  fieldType: FieldType | string;
  inputType?: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  value?: any;
  dropdownOptions?: Option[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date | boolean) => void;
}

export interface DynamicFormProps {
  readonlyMode: boolean;
  fields: DynamicFormField[];
}

export const initialProps: DynamicFormProps = {
  readonlyMode: false,
  fields: []
}

export function DynamicForm({
  readonlyMode,
  fields
}: DynamicFormProps) {
  const renderFormElement = (field: DynamicFormField) => {
    const formId = uuidv4();
    const formgroupKey = `formgroup-${formId}`;
    const inputKey = `input-${formId}`;

    switch (field.fieldType) {
      case FieldType.InputText:
      case FieldType.TextLine:
        return (
          <FormGroup key={formgroupKey} label={field.label} disabled={field.disabled || readonlyMode}>
            <Input key={inputKey} type={field.inputType || "text"} disabled={field.disabled || readonlyMode} placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
          </FormGroup>
        );
      case FieldType.TextboxRich:
      case FieldType.TextRich:
        return (
          <FormGroup key={formgroupKey} label={field.label} disabled={field.disabled || readonlyMode}>
            <TextArea key={inputKey} rows={6} disabled={field.disabled || readonlyMode} placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
          </FormGroup>
        );
      case FieldType.DatePicker:
      case FieldType.Date:
        return (
          <DatePicker
            key={inputKey}
            label={field.label}
            disabled={field.disabled || readonlyMode}
            placeholder={field.placeholder || "mm/dd/yyyy"}
            onChange={field.onChange}
            defaultValue={(field.value as Timestamp).toDate()}
          />
        );
      case FieldType.FileUpload:
        return <FileUpload key={inputKey} label={field.label} disabled={field.disabled || readonlyMode} onChange={field.onChange} />;
      case FieldType.Switcher:
        return <Switcher key={inputKey} disabled={field.disabled || readonlyMode} defaultChecked={field.value} onChange={field.onChange} />;
      case FieldType.Radio:
        return <RadioButton key={inputKey} disabled={field.disabled || readonlyMode} label={field.label} defaultChecked={field.value} />;
      case FieldType.Checkbox:
        return <Checkbox key={inputKey} />;
      case FieldType.Dropdown:
        return <Dropdown key={inputKey} disabled={field.disabled || readonlyMode} options={field.dropdownOptions || []} placeholder={field.placeholder} id={""} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        {fields.map((field) => renderFormElement(field))}
      </Suspense>
    </>
  )
}