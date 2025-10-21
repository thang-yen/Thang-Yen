
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

export const generateImageFromPrompt = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 4,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error generating image from prompt:", error);
        throw new Error("Không thể tạo ảnh từ mô tả.");
    }
};

const generateSingleImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Không tìm thấy dữ liệu hình ảnh trong phản hồi.");
};

export const editImageWithPrompt = async (prompt: string, imageFile: File): Promise<string[]> => {
    try {
        const imageBase64 = await fileToBase64(imageFile);
        const mimeType = imageFile.type;

        const imagePromises = Array(4).fill(0).map(() => 
            generateSingleImage(prompt, imageBase64, mimeType)
        );
        
        return await Promise.all(imagePromises);

    } catch (error) {
        console.error("Error editing image with prompt:", error);
        throw new Error("Không thể sửa ảnh theo mô tả.");
    }
};


export const removeBackground = async (imageFile: File): Promise<string> => {
    try {
        const imageBase64 = await fileToBase64(imageFile);
        const mimeType = imageFile.type;
        const prompt = "Remove the background of this image completely. Make the new background transparent.";
        return await generateSingleImage(prompt, imageBase64, mimeType);
    } catch (error) {
        console.error("Error removing background:", error);
        throw new Error("Không thể xóa nền ảnh.");
    }
};

export const enhanceImage = async (imageFile: File): Promise<string> => {
    try {
        const imageBase64 = await fileToBase64(imageFile);
        const mimeType = imageFile.type;
        const prompt = "Enhance this image. Increase the sharpness, clarity, and resolution. Improve lighting and color balance to make it look professional and high-quality. Do not crop or change the composition.";
        return await generateSingleImage(prompt, imageBase64, mimeType);
    } catch (error) {
        console.error("Error enhancing image:", error);
        throw new Error("Không thể làm nét ảnh.");
    }
};
