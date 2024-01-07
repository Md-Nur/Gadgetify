import { v2 as cloudinary } from "cloudinary";
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


const deleteOnCloudinary = async (images) => {
  await cloudinary.api
    .delete_resources(images, { type: "upload", resource_type: "image" })
    .then(() => console.info("Images deleted successfully"))
    .catch((e) => console.error(e));
};

export { deleteOnCloudinary };
export default uploadOnCloudinary;
