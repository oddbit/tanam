import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ContentCard from "@/components/Containers/ContentCard";
import {FormGroup, Input, TextArea} from "@/components/Form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js Form Layout | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormLayout = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="FormLayout" />

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
                      <span className="text-white opacity-0">
                        <svg
                          className="fill-current"
                          width="10"
                          height="7"
                          viewBox="0 0 10 7"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                            fill=""
                          />
                        </svg>
                      </span>
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
    </DefaultLayout>
  );
};

export default FormLayout;
