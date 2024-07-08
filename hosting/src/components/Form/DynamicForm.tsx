import React, {Suspense, useEffect, useState} from "react";
import {
  Checkbox,
  DatePicker,
  Dropdown,
  FileUpload,
  FormGroup,
  Input,
  RadioButton,
  Switcher,
  TextArea
} from "@/components/Form";
import {Button} from "@/components/Button";
import Loader from "@/components/common/Loader";
import {FieldType} from "@functions/definitions/FieldType";
import {Timestamp} from 'firebase/firestore';
import {Option} from '@/components/Form/Dropdown';

export interface DynamicFormField {
  id: string;
  fieldType: FieldType | string;
  inputType?: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  value?: any;
  dropdownOptions?: Option[];
}

export interface DynamicFormProps {
  readonlyMode: boolean;
  fields: DynamicFormField[];
  onSave?: (fields: { [key: string]: any }) => void;
  onSubmit?: (fields: { [key: string]: any }) => void;
}

export const initialProps: DynamicFormProps = {
  readonlyMode: false,
  fields: []
}

export function DynamicForm({
  readonlyMode,
  fields,
  onSave,
  onSubmit
}: DynamicFormProps) {
  const [formValues, setFormValues] = useState<{ [key: string]: any }>([]);

  useEffect(() => {
    const initialValues = fields.reduce((acc, field) => {
      acc[field.id] = field.value || "";
      return acc;
    }, {} as { [key: string]: any });
    setFormValues(initialValues);
  }, [fields]);

  const handleOnChange = (fieldKey: string, e: any) => {
    if (!fieldKey && !e) return

    const {value} = e.target
    
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldKey]: value
    }));
  }

  const handleSave = () => {
    if (onSave) {
      onSave(formValues);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formValues);
    }
  }

  const renderFormElement = (field: DynamicFormField, fieldIndex: number) => {
    const formgroupKey = `formgroup-${fieldIndex}`;
    const inputKey = `input-${fieldIndex}`;

    switch (field.fieldType) {
      case FieldType.InputText:
      case FieldType.TextLine:
        return (
          <FormGroup key={formgroupKey} label={field.label} disabled={field.disabled || readonlyMode}>
            <Input key={inputKey} type="text" placeholder={field.placeholder} disabled={field.disabled || readonlyMode} onChange={(e) => handleOnChange(field.id, e)} />
          </FormGroup>
        );
      case FieldType.TextboxRich:
      case FieldType.TextRich:
        return (
          <FormGroup key={formgroupKey} label={field.label} disabled={field.disabled || readonlyMode}>
            <TextArea key={inputKey} rows={6} disabled={field.disabled || readonlyMode} placeholder={field.placeholder} value={field.value} onChange={(e) => handleOnChange(field.id, e)} />
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
            onChange={(e) => handleOnChange(field.id, e)}
            defaultValue={(field.value as Timestamp).toDate()}
          />
        );
      case FieldType.FileUpload:
        return <FileUpload key={inputKey} label={field.label} disabled={field.disabled || readonlyMode} onChange={(e) => handleOnChange(field.id, e)} />;
      case FieldType.Switcher:
        return <Switcher key={inputKey} disabled={field.disabled || readonlyMode} defaultChecked={field.value} onChange={(e) => handleOnChange(field.id, e)} />;
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
      formValues :: {JSON.stringify(formValues)}
      <Suspense fallback={<Loader />}>
        <form onSubmit={handleSubmit}>
          {fields.map((field, index) => renderFormElement(field, index))}

          <Button key="actionButton" onClick={handleSave} title="Save" />
        </form>
      </Suspense>
    </>
  )
}