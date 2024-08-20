"use client";
import PageHeader from "@/components/common/PageHeader";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import { Dropzone } from "@/components/Form/Dropzone";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useFirebaseStorage } from '@/hooks/useFirebaseStorage';
import { useTanamUser } from "@/hooks/useTanamUser";
import Image from "next/image";
import { useEffect, useState } from 'react';

const defaultImage = "/images/no-image.png";

export default function Settings() {
  const {authUser} = useAuthentication();
  const {tanamUser, saveUserInfo} = useTanamUser(authUser?.uid);
  const {loading: uploadLoading, upload, getFile} = useFirebaseStorage();

  const [showDropzone, setShowDropzone] = useState<boolean>(false);
  const [pathUpload, setPathUpload] = useState<string>();
  const [fileUploadContentType, setFileUploadContentType] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>(defaultImage);

  useEffect(() => {
    if (tanamUser) {
      init();
    }

    return () => resetChanges();
  }, [tanamUser, pathUpload]);

  async function init() {
    if (!pathUpload) {
      setPathUpload(`tanam-users/${tanamUser?.id}`);

      return
    }

    const profilePictureUrl = await getFile(`${pathUpload}/profile.png`);
    setProfilePicture(profilePictureUrl ?? defaultImage);
  }

  function resetChanges() {
    setFileUploadContentType(undefined);
    setProfilePicture(defaultImage);
  }

  async function onPersonalInfoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploadLoading) return

    const form = event.currentTarget;
    const formData = {
      fullName: form.fullName.value,
    };

    // Do upload when have profilePicture and contentType file
    if (fileUploadContentType && profilePicture) {
      const fileName = "new-profile-image"
      await upload(`${pathUpload}/${fileName}`, profilePicture, fileUploadContentType);
    }
    
    await saveUserInfo(formData.fullName);
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <PageHeader pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-7">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">System</h3>
              </div>
              <div className="p-7">
                <div className="mb-4 gap-3">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="emailAddress">
                    Dark mode
                  </label>
                  <div className="relative">
                    <DarkModeSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5 xl:col-span-7">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
              </div>
              <div className="p-7">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <div className="mb-4 flex items-center gap-3">
                      <Image className="w-14 h-14 rounded-full object-cover" src={profilePicture} width={80} height={80} alt="User" />
                      
                      <div>
                        <span className="mb-1.5 text-black dark:text-white">Edit your photo</span>
                        <span className="flex gap-2.5">
                          <button className="text-sm hover:text-primary" onClick={() => setProfilePicture(defaultImage)}>Delete</button>
                          <button className="text-sm hover:text-primary" onClick={() => setShowDropzone(!showDropzone)}>Update</button>
                        </span>
                      </div>
                    </div>

                    {
                      showDropzone && (
                        <Dropzone 
                          value={profilePicture}
                          onChange={
                            (valueString, valueBlob) => {
                              if (!valueString) return
                              
                              setProfilePicture(valueString)
                              setFileUploadContentType(valueBlob?.type)
                            }
                          }
                        />
                      )
                    }
                  </div>
                </div>

                <form onSubmit={onPersonalInfoSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="fullName">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 i-ic-outline-person w-[24px] h-[24px]" />
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="Your full name"
                          defaultValue={tanamUser?.name}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="reset"
                      onClick={resetChanges}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
