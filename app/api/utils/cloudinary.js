import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (bufferFile) => {
  if (!bufferFile) throw new ApiError(500, "Buffer file can not read");
  // upload the file on clodinary
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", folder: "Gadgetify/products" },
        (error, result) => {
          if (error) {
            // console.error("Upload error: ", error);
            reject(error);
          } else {
            // console.log("Upload result: ", result.url);
            resolve(result.url);
          }
        }
      )
      .end(bufferFile);
  });
};

// const images = [
//   "Gadgetify/products/zc44ototmhalxmupiys4",
//   "Gadgetify/products/n5ond6chgim0hpmpo72q",
// ];

const deleteOnCloudinary = async (images) => {
  cloudinary.api
    .delete_resources(images, { type: "upload", resource_type: "auto" })
    .then(() => console.log("Images deleted successfully"))
    .catch((e) => console.error(e));
};

export { deleteOnCloudinary };
export default uploadOnCloudinary;
