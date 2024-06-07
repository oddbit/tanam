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
import PageHeader from "@/components/common/PageHeader";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  const dropdownOptions = [
    {value: "USA", text: "USA"},
    {value: "UK", text: "UK"},
    {value: "Canada", text: "Canada"},
  ];

  return (
    <>
      <PageHeader pageName="FormElements" />

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
          <Switcher />
          <Switcher style="rounded" />
          <Switcher onIcon="i-ic-round-check" offIcon="i-ic-round-close" />
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
          <FormGroup label="Select Country">
            <Dropdown
              id="countrySelect"
              options={dropdownOptions}
              icon="i-ri-global-line"
              placeholder="Select a country"
            />
          </FormGroup>
          <FormGroup label="Multiselect Dropdown">
            <Dropdown
              icon="i-ri-global-line"
              id="multiSelect"
              options={dropdownOptions}
              multiselect
              placeholder="Select options"
            />
          </FormGroup>
        </ContentCard>
      </div>
    </>
  );
};

export default FormElementsPage;
