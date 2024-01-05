"use server";
import fs, { unlinkSync } from "fs";
import { writeFile } from "fs/promises";
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
    return false;
  }
  let images = [];

  for (const file of files) {
    const extention = file.name.split(".").pop();

    if (!extention || !["jpg", "jpeg", "png"].includes(extention)) {
      return false;
    }
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/images/products/${Date.now()}.${extention}`;
    try {
      await writeFile(path, buffer);
      images.push(path);
    } catch (e) {
      return false;
    }
  }
  return images;
};

export const deleteFiles = (images) => {
  // delete files 1st
  images.forEach((img) => {
    try {
      unlinkSync(img);
    } catch {
      console.log(`There have no file named: ${img}`);
    }
  });
};
