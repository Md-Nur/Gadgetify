import { NextRequest, NextResponse } from "next/server";
import uploadOnImgBB from "../../utils/imgbb";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get("image") as File | null;

        if (!imageFile) {
            return NextResponse.json(new ApiError(400, "No image file provided"), {
                status: 400,
            });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadedUrl = await uploadOnImgBB(buffer);

        return NextResponse.json(
            new ApiResponse(200, { url: uploadedUrl }, "Image uploaded successfully"),
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(new ApiError(500, error.message || "Upload failed"), {
            status: 500,
        });
    }
}
