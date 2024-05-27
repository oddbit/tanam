import React from "react";
import ContentCard from "@/components/Containers/ContentCard";
import {
  FormGroup,
  Input,
  MultiSelect,
  TextArea,
  DatePicker,
  FileUpload,
  Switcher,
  RadioButton,
  Checkbox,
} from "@/components/Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="FormElements" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <ContentCard title="Input Fields">
          <FormGroup label="Default Input">
            <Input type="text" placeholder="Default Input" />
          </FormGroup>
          <FormGroup label="Active Input">
            <Input type="text" placeholder="Active Input" />
          </FormGroup>
          <FormGroup label="Disabled label">
            <Input type="text" placeholder="Disabled label" disabled />
          </FormGroup>
        </ContentCard>

        <ContentCard title="Toggle switch input">
          <Switcher style="default" />
          <Switcher style="rounded" />
          <Switcher style="withCheck" />
        </ContentCard>

        <ContentCard title="Time and date">
          <DatePicker label="Date picker" placeholder="mm/dd/yyyy" styleType="default" />
          <DatePicker label="Select date" placeholder="mm/dd/yyyy" styleType="withArrows" />
        </ContentCard>

        <ContentCard title="File upload">
          <FormGroup label="Attach file">
            <FileUpload label="Choose File" />
          </FormGroup>
          <FormGroup label="Attach file">
            <FileUpload label="Choose File" />
          </FormGroup>
        </ContentCard>

        <ContentCard title="TextArea Fields">
          <FormGroup label="Default textarea">
            <TextArea rows={6} placeholder="Default textarea" />
          </FormGroup>
          <FormGroup label="Active textarea">
            <TextArea rows={6} placeholder="Active textarea" />
          </FormGroup>
          <FormGroup label="Disabled textarea">
            <TextArea rows={6} placeholder="Disabled textarea" disabled />
          </FormGroup>
        </ContentCard>

        <ContentCard title="Checkbox and radio">
          <Checkbox style="checkmark" />
          <Checkbox style="xmark" />
          <Checkbox style="filled" />
          <RadioButton style="filled" label="Filled Radio" />
          <RadioButton style="outline" label="Outline Radio" />
        </ContentCard>

        <ContentCard title="Select input">
          <SelectGroupTwo />
          <MultiSelect id="multiSelect" />
        </ContentCard>
      </div>
    </DefaultLayout>
  );
};

export default FormElementsPage;
