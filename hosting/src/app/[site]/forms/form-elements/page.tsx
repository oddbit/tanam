import React from "react";
import ContentCard from "@/components/Containers/ContentCard";
import {Checkbox, FormGroup, Input, MultiSelect, RadioButton, Switcher, TextArea} from "@/components/Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import {DatePickerOne} from "@/components/Form/DatePickerOne";
import {DatePickerTwo} from "@/components/Form/DatePickerTwo";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

function FormElementsPage() {
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
          <Switcher style="default" />
        </ContentCard>

        <ContentCard title="Time and date">
          <DatePickerOne />
          <DatePickerTwo />
        </ContentCard>

        <ContentCard title="File upload">
          <FormGroup label="Attach file">
            <input
              type="file"
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </FormGroup>
          <FormGroup label="Attach file">
            <input
              type="file"
              className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
            />
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
          <Checkbox label="Checkbox Text" style="filled" />
          <Checkbox label="Checkbox Text" style="checkmark" />
          <Checkbox label="Checkbox Text" style="xmark" />
          <RadioButton label="Checkbox Text" style="filled" />
          <RadioButton label="Checkbox Text" style="outline" />
        </ContentCard>

        <ContentCard title="Select input">
          <SelectGroupTwo />
          <MultiSelect id="multiSelect" />
        </ContentCard>
      </div>
    </DefaultLayout>
  );
}

export default FormElementsPage;
