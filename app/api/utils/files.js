// "use server";
import uploadOnCloudinay, {
  deleteOnCloudinary,
} from "@/app/api/utils/cloudinary";
import ApiError from "./ApiError";
// import { writeFile } from "fs/promises";
// const fs = require("fs")

// export const getFiles = async (dir, files = []) => {
//   // Get an array of all files and directories in the passed directory using fs.readdirSync
//   const fileList = fs.readdirSync(dir);
//   // Create the full path of the file/directory by concatenating the passed directory and file/directory name
//   for (const file of fileList) {
//     const name = `${dir}/${file}`;
//     // Check if the current file/directory is a directory using fs.statSync
//     if (fs.statSync(name).isDirectory()) {
//       // If it is a directory, recursively call the getFiles function with the directory path and the files array
//       getFiles(name, files);
//     } else {
//       // If it is a file, push the full path to the files array
//       files.push(name);
//     }
//   }
//   return files;
// };

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
      let path = await uploadOnCloudinay(buffer);

      images.push(path);
    } catch (e) {
      throw new ApiError(450, e);
    }
  }
  return images;
};

export const deleteFiles = async (images) => {
  if (images.length < 1) {
    throw new ApiError(404, "At least one image is required");
  }
  let imagesUrl = [];
  images.forEach((img) => {
    const urlArr = img.split("/");
    const mainName = urlArr[urlArr.length - 1];
    const nameExt = mainName.split(".");
    const withoutExt = nameExt[0];
    imagesUrl.push(`Gadgetify/products/${withoutExt}`);
  });
  try {
    await deleteOnCloudinary(images); // deleting the previous files
  } catch (e) {
    throw new ApiError(404, `There have no file named: ${images}`, e);
  }
};
