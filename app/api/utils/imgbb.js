import ApiError from "./ApiError";

const uploadOnImgBB = async (bufferFile) => {
    if (!bufferFile) throw new ApiError(500, "Buffer file cannot be read");

    const apiKey = process.env.IMGBB_API;
    const formData = new FormData();

    // ImgBB API expects a base64 encoded string or a file
    const base64Image = bufferFile.toString('base64');
    formData.append("image", base64Image);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            throw new ApiError(data.status, data.error.message);
        }
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to upload to ImgBB");
    }
};

export default uploadOnImgBB;
