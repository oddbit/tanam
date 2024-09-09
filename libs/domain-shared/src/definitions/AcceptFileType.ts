// Enum to define acceptable file types for the Dropzone component
export enum AcceptFileType {
  AllImages = "image/*",
  Images = "image/jpg, image/jpeg, image/png, image/svg",
  Pdf = "application/pdf",
  Word = "application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  Excel = "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PowerPoint = "application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation",
  Text = "text/plain",
  Audio = "audio/*",
  Video = "video/*",
  Zip = "application/zip, application/x-rar-compressed, application/x-7z-compressed",
  Csv = "text/csv",
  AllFiles = "*/*",
}
