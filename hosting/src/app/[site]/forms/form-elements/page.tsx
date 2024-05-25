import React from "react";
import {DatePicker, FileUpload, Input, Select, Switch, Textarea} from "@/components/Form";
import {Metadata} from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="FormElements" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Input Fields */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Input Fields</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <Input label="Default Input" placeholder="Default Input" />
              <Input label="Active Input" placeholder="Active Input" />
              <Input label="Disabled Input" placeholder="Disabled Input" disabled />
            </div>
          </div>

          {/* Toggle Switch Input */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Toggle Switch Input</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <Switch label="Switcher One" checked={false} onChange={() => {}} />
              <Switch label="Switcher Two" checked={true} onChange={() => {}} />
            </div>
          </div>

          {/* Time and Date */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Time and Date</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <DatePicker label="Date Picker One" placeholder="mm/dd/yyyy" />
              <DatePicker label="Date Picker Two" placeholder="mm/dd/yyyy" />
            </div>
          </div>

          {/* File Upload */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">File Upload</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <FileUpload label="Attach file" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* Textarea Fields */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Textarea Fields</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <Textarea label="Default Textarea" placeholder="Default textarea" />
              <Textarea label="Active Textarea" placeholder="Active textarea" />
              <Textarea label="Disabled Textarea" placeholder="Disabled textarea" disabled />
            </div>
          </div>

          {/* Checkbox and Radio */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Checkbox and Radio</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* Checkbox and radio components will be similar to Switch component */}
            </div>
          </div>

          {/* Select input */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Select input</h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <Select
                label="Select Group One"
                options={[
                  {value: "1", label: "Option 1"},
                  {value: "2", label: "Option 2"},
                ]}
              />
              <Select
                label="MultiSelect"
                options={[
                  {value: "1", label: "Option 1"},
                  {value: "2", label: "Option 2"},
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FormElementsPage;
