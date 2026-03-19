export const MAX_FILE_SIZE = 1024 * 1024 * 1;
export const ACCEPTED_FILE_TYPES = ["jpg", "jpeg", "png"];
export function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (
      ACCEPTED_FILE_TYPES.some(
        (acceptedFileType) => acceptedFileType === fileType
      )
    )
      return true;
  }
  return false;
}
