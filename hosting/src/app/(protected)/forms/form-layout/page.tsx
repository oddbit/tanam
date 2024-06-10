import PageHeader from "@/components/common/PageHeader";
import ContentCard from "@/components/Containers/ContentCard";
import {FormGroup, Input, TextArea} from "@/components/Form";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormLayout = () => {
  return (
    <>
      <PageHeader pageName="FormLayout" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <ContentCard title="Contact Form">
            <form action="#">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <FormGroup label="First name">
                  <Input type="text" placeholder="Enter your first name" />
                </FormGroup>
                <FormGroup label="Last name">
                  <Input type="text" placeholder="Enter your last name" />
                </FormGroup>
              </div>

              <FormGroup label="Email *">
                <Input type="email" placeholder="Enter your email address" />
              </FormGroup>

              <FormGroup label="Subject">
                <Input type="text" placeholder="Select subject" />
              </FormGroup>

              <FormGroup label="Message">
                <TextArea rows={6} placeholder="Type your message" />
              </FormGroup>

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Send Message
              </button>
            </form>
          </ContentCard>
        </div>

        <div className="flex flex-col gap-9">
          <ContentCard title="Sign In Form">
            <form action="#">
              <FormGroup label="Email">
                <Input type="email" placeholder="Enter your email address" />
              </FormGroup>

              <FormGroup label="Password">
                <Input type="password" placeholder="Enter password" />
              </FormGroup>

              <div className="mb-5.5 mt-5 flex items-center justify-between">
                <label htmlFor="formCheckbox" className="flex cursor-pointer">
                  <div className="relative pt-0.5">
                    <input type="checkbox" id="formCheckbox" className="taskCheckbox sr-only" />
                    <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark">
                      <span className="text-white opacity-0 i-ic-round-check" />
                    </div>
                  </div>
                  <p>Remember me</p>
                </label>

                <Link href="#" className="text-sm text-primary hover:underline">
                  Forget password?
                </Link>
              </div>

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Sign In
              </button>
            </form>
          </ContentCard>

          <ContentCard title="Sign Up Form">
            <form action="#">
              <FormGroup label="Name">
                <Input type="text" placeholder="Enter your full name" />
              </FormGroup>

              <FormGroup label="Email">
                <Input type="email" placeholder="Enter your email address" />
              </FormGroup>

              <FormGroup label="Password">
                <Input type="password" placeholder="Enter password" />
              </FormGroup>

              <FormGroup label="Re-type Password">
                <Input type="password" placeholder="Re-enter password" />
              </FormGroup>

              <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                Sign Up
              </button>
            </form>
          </ContentCard>
        </div>
      </div>
    </>
  );
};

export default FormLayout;
