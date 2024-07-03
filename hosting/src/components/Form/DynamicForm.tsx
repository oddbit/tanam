import React, {Suspense, useCallback, useEffect, useState} from "react";
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
  onFieldsChange?: (fields: {[key: string]: any}) => void;
}

export const initialProps: DynamicFormProps = {
  readonlyMode: false,
  fields: []
}

export function DynamicForm({
  readonlyMode,
  fields,
  onFieldsChange
}: DynamicFormProps) {
  const [formValues, setFormValues] = useState(() => {
    return fields.reduce((acc, field) => {
      acc[field.id] = field.value || "";
      return acc;
    }, {} as { [key: string]: any });
  });

  useEffect(() => {
    if (onFieldsChange) {
      onFieldsChange(formValues);
    }
  }, [formValues, onFieldsChange]);

  const handleOnChange = useCallback((id: string, value: any) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [id]: value
    }));
  }, []);

  const renderFormElement = useCallback((field: DynamicFormField, fieldIndex: number) => {
    const formId = uuidv4();
    const formgroupKey = `formgroup-${formId}-${fieldIndex}`;
    const inputKey = `input-${formId}-${fieldIndex}`;

    switch (field.fieldType) {
      case FieldType.InputText:
      case FieldType.TextLine:
        return (
          <FormGroup key={formgroupKey} label={field.label} disabled={field.disabled || readonlyMode}>
            <Input key={inputKey} type={field.inputType || "text"} disabled={field.disabled || readonlyMode} placeholder={field.placeholder} value={field.value} onChange={(e) => handleOnChange(field.id, e.target.value)} />
          </FormGroup>
        );
      case FieldType.TextboxRich:
      case FieldType.TextRich:
        return (
          <FormGroup key={formgroupKey} label={field.label} disabled={field.disabled || readonlyMode}>
            <TextArea key={inputKey} rows={6} disabled={field.disabled || readonlyMode} placeholder={field.placeholder} value={field.value} onChange={(e) => handleOnChange(field.id, e.target.value)} />
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
        return <FileUpload key={inputKey} label={field.label} disabled={field.disabled || readonlyMode} onChange={(e) => handleOnChange(field.id, e.target.value)} />;
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
  }, [formValues, readonlyMode, handleOnChange]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        {fields.map((field, index) => renderFormElement(field, index))}
      </Suspense>
    </>
  )
}