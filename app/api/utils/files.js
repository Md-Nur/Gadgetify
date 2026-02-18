import uploadOnImgBB from "./imgbb";
import ApiError from "./ApiError";

// add files

export const fileToUrl = async (files) => {
  if (files.length < 1) {
    throw new ApiError(404, "At least one image is required");
  }
  let images = [];

  for (const file of files) {
    const extention = file.name.split(".").pop();

    if (!extention || !["jpg", "jpeg", "png"].includes(extention)) {
      throw new ApiError(
        500,
        "Files must be and image extention wiht jpg/jpeg/png"
      );
    }
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    try {
      let path = await uploadOnImgBB(buffer);

      images.push(path);
    } catch (e) {
      throw new ApiError(450, e.message || e);
    }
  }
  return images;
};

export const deleteFiles = async (images) => {
  // ImgBB free API does not support programmatic deletion easily via URL
  console.warn("Delete functionality is not supported by ImgBB API");
  return;
};
