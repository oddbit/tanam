"use client";
import Notification from "@/components/common/Notification";
import PageHeader from "@/components/common/PageHeader";
import {CropImage} from "@/components/CropImage";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import {Dropzone} from "@/components/Form/Dropzone";
import {Modal} from "@/components/Modal";
import {useAuthentication} from "@/hooks/useAuthentication";
import {useFirebaseStorage} from "@/hooks/useFirebaseStorage";
import {useTanamUser} from "@/hooks/useTanamUser";
import {UserNotification} from "@/models/UserNotification";
import {AcceptFileType} from "@functions/definitions/AcceptFileType";
import Image from "next/image";
import {useEffect, useState} from "react";

// Default image path if the user has not uploaded a profile picture
const defaultImage = "/images/no-image.png";

export default function Settings() {
  const {authUser} = useAuthentication();
  const {tanamUser, error: userError, saveUserInfo} = useTanamUser(authUser?.uid);
  const {isLoading: uploadLoading, error: storageError, upload, getFile} = useFirebaseStorage();
  const [notification, setNotification] = useState<UserNotification | null>(null);

  // State hooks for controlling UI and data
  const [showDropzone, setShowDropzone] = useState<boolean>(false); // Show or hide the Dropzone component
  const [showCropImage, setShowCropImage] = useState<boolean>(false); // Show or hide the crop image modal
  const [pathUpload, setPathUpload] = useState<string>(); // Path for file upload in Firebase Storage
  const [fileUploadContentType, setFileUploadContentType] = useState<string>(); // Content type of the uploaded file (e.g., image/png)
  const [beforeCropImage, setBeforeCropImage] = useState<string>(); // Image before cropping
  const [afterCropImage, setAfterCropImage] = useState<string>(); // Image after cropping
  const [profilePicture, setProfilePicture] = useState<string>(defaultImage); // Displayed profile picture

  useEffect(() => {
    if (tanamUser) {
      // Call init function when tanamUser or pathUpload changes
      init();
    }
  }, [tanamUser, pathUpload]);

  useEffect(() => {
    setNotification(userError || storageError);
  }, [userError, storageError]);

  /**
   * Initializes component by setting the required state.
   * Loads the profile picture if upload path is available.
   * @return {Promise<void>}
   */
  async function init(): Promise<void> {
    if (!pathUpload) {
      // Set the upload path based on the TanamUser ID
      setPathUpload(`tanam-users/${tanamUser?.id}`);
      return;
    }
    // If upload path is available, reset changes
    await resetChanges();
  }

  /**
   * Resets upload and crop image-related states.
   * @return {Promise<void>}
   */
  async function resetChanges(): Promise<void> {
    // Reset file content type and crop image states
    setFileUploadContentType(undefined);
    resetCropImage();
    // Reload the profile picture
    await fetchProfilePicture();
  }

  /**
   * Resets the crop image states.
   */
  function resetCropImage() {
    // Clear before and after crop images and hide the crop modal
    setBeforeCropImage(undefined);
    setAfterCropImage(undefined);
    setShowCropImage(false);
  }

  /**
   * Fetches the user's profile picture from Firebase Storage.
   * Uses a default image if none is found.
   * @return {Promise<void>}
   */
  async function fetchProfilePicture(): Promise<void> {
    // Retrieve the profile picture URL from Firebase Storage
    const profilePictureUrl = await getFile(`${pathUpload}/profile.png`);
    // Set the profile picture to the retrieved URL or default image if none found
    setProfilePicture(profilePictureUrl ?? defaultImage);
    // Set the before crop image to the retrieved profile picture
    setBeforeCropImage(profilePicture);
  }

  /**
   * Handles the submission of the personal information form.
   * Uploads a new profile picture if provided and saves the user's name.
   * @param {React.FormEvent<HTMLFormElement>} event - Form submission event.
   * @return {Promise<void>}
   */
  async function onPersonalInfoSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setNotification(null);

    try {
      if (uploadLoading) return; // Ignore form submission if upload is in progress

      const form = event.currentTarget;
      const formData = {
        fullName: form.fullName.value, // Get the full name value from the form
      };

      if (fileUploadContentType && profilePicture) {
        // If there is a file content type and profile picture, upload the image to Firebase Storage
        const fileName = "new-profile-image";
        await upload(`${pathUpload}/${fileName}`, profilePicture, fileUploadContentType);
      }

      // Save the user information with the new full name
      await saveUserInfo(formData.fullName);

      setNotification(new UserNotification("success", "Update Profile", "Success to update profile"));
    } catch (error) {
      setNotification(new UserNotification("error", "Update Profile", "Failed to update profile"));
    }
  }

  /**
   * Modal actions for saving or canceling profile picture changes.
   * @constant
   * @type {JSX.Element}
   */
  const modalActionCropImage = (
    <div className="flex flex-col sm:flex-row justify-end gap-3">
      {/* Start button to close the crop image modal */}
      <button
        className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white sm:w-full sm:text-sm"
        onClick={resetCropImage}
      >
        Close
      </button>
      {/* End button to close the crop image modal */}

      {/* Start button to save changes to the profile picture after cropping */}
      <button
        className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90 sm:w-full sm:text-sm"
        onClick={() => {
          if (!afterCropImage) {
            window.alert("No cropped image");
            return;
          }
          // Set the profile picture with the cropped image and reset crop image states
          setProfilePicture(afterCropImage);
          resetCropImage();
        }}
      >
        Save
      </button>
      {/* End button to save changes to the profile picture after cropping */}
    </div>
  );

  return (
    <div className="mx-auto max-w-270">
      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} />
      )}

      <PageHeader pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        {/* Start System Settings Section */}
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
        {/* End System Settings Section */}

        {/* Start Personal Information Section */}
        <div className="col-span-5 xl:col-span-7">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Personal Information</h3>
            </div>
            <div className="p-7">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full">
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      className="w-14 h-14 rounded-full object-cover"
                      src={profilePicture}
                      width={80}
                      height={80}
                      alt="User"
                    />

                    <div>
                      <span className="mb-1.5 text-black dark:text-white">Edit your photo</span>
                      <span className="flex gap-2.5">
                        <button
                          className="text-sm hover:text-primary"
                          onClick={async () => {
                            await fetchProfilePicture();
                            setBeforeCropImage(undefined);
                          }}
                        >
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary" onClick={() => setShowDropzone(!showDropzone)}>
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  {showDropzone && (
                    <Dropzone
                      value={beforeCropImage}
                      accept={AcceptFileType.Images}
                      onChange={(valueString, valueBlob) => {
                        if (!valueString) return;

                        setBeforeCropImage(valueString);
                        setFileUploadContentType(valueBlob?.type);
                        setShowCropImage(true);
                      }}
                    />
                  )}
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
        {/* End Personal Information Section */}
      </div>

      {/* Start modal crop image */}
      <Modal
        isOpen={showCropImage}
        disableOverlayClose={true}
        onClose={resetCropImage}
        actions={modalActionCropImage}
        title="Crop Profile Picture"
      >
        <CropImage src={beforeCropImage} contentType={fileUploadContentType} onCropComplete={setAfterCropImage} />
      </Modal>
      {/* End modal crop image */}
    </div>
  );
}
