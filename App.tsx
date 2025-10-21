
import React, { useState, useCallback } from 'react';
import { generateImageFromPrompt, editImageWithPrompt, removeBackground, enhanceImage } from './services/geminiService';
import { LoadingStates } from './types';
import ImageUpload from './components/ImageUpload';
import ImageResultGrid from './components/ImageResultGrid';
import ActionButton from './components/ActionButton';
import ImageCompareSlider from './components/ImageCompareSlider';
import Loader from './components/Loader';

interface UploadedFile {
    file: File;
    preview: string;
}

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [originalImage, setOriginalImage] = useState<UploadedFile | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [bgRemovedImage, setBgRemovedImage] = useState<string | null>(null);
    const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<LoadingStates>({
        isGenerating: false,
        isEditing: false,
        isRemovingBg: false,
        isEnhancing: false,
    });

    const clearResults = () => {
        setGeneratedImages([]);
        setBgRemovedImage(null);
        setEnhancedImage(null);
        setError(null);
    }

    const handleImageUpload = useCallback((file: File) => {
        setOriginalImage({
            file,
            preview: URL.createObjectURL(file),
        });
        clearResults();
    }, []);

    const handleImageRemove = useCallback(() => {
        if(originalImage) {
            URL.revokeObjectURL(originalImage.preview);
        }
        setOriginalImage(null);
        clearResults();
    }, [originalImage]);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Vui lòng nhập mô tả gợi ý.');
            return;
        }
        clearResults();
        setLoading(prev => ({ ...prev, isGenerating: true }));
        try {
            const images = await generateImageFromPrompt(prompt);
            setGeneratedImages(images);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
        } finally {
            setLoading(prev => ({ ...prev, isGenerating: false }));
        }
    };

    const handleEdit = async () => {
        if (!originalImage) {
            setError('Vui lòng tải ảnh gốc lên.');
            return;
        }
        if (!prompt) {
            setError('Vui lòng nhập mô tả gợi ý để sửa ảnh.');
            return;
        }
        clearResults();
        setLoading(prev => ({ ...prev, isEditing: true }));
        try {
            const images = await editImageWithPrompt(prompt, originalImage.file);
            setGeneratedImages(images);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
        } finally {
            setLoading(prev => ({ ...prev, isEditing: false }));
        }
    };

    const handleRemoveBackground = async () => {
        if (!originalImage) {
            setError('Vui lòng tải ảnh gốc lên.');
            return;
        }
        clearResults();
        setLoading(prev => ({ ...prev, isRemovingBg: true }));
        try {
            const image = await removeBackground(originalImage.file);
            setBgRemovedImage(image);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
        } finally {
            setLoading(prev => ({ ...prev, isRemovingBg: false }));
        }
    };
    
    const handleEnhanceImage = async () => {
        if (!originalImage) {
            setError('Vui lòng tải ảnh gốc lên.');
            return;
        }
        clearResults();
        setLoading(prev => ({ ...prev, isEnhancing: true }));
        try {
            const image = await enhanceImage(originalImage.file);
            setEnhancedImage(image);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
        } finally {
            setLoading(prev => ({ ...prev, isEnhancing: false }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        CHỈNH SỬA ẢNH, GHÉP ẢNH BẰNG GOOGLE STUDIO
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">Công cụ AI mạnh mẽ để biến ý tưởng của bạn thành hình ảnh tuyệt đẹp</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cot dieu khien */}
                    <div className="flex flex-col gap-6 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div>
                            <label htmlFor="prompt" className="block text-lg font-medium text-gray-200 mb-2">Nhập mô tả gợi ý của bạn</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ví dụ: một chú mèo phi hành gia đang cưỡi ngựa trên sao hỏa..."
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
                                rows={4}
                            />
                        </div>
                        
                        <ActionButton 
                            onClick={handleGenerate} 
                            text="Tạo ảnh từ mô tả gợi ý" 
                            iconClass="fas fa-magic" 
                            isLoading={loading.isGenerating}
                        />
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-600"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm">HOẶC</span>
                            <div className="flex-grow border-t border-gray-600"></div>
                        </div>

                        <ImageUpload onImageUpload={handleImageUpload} imagePreview={originalImage?.preview ?? null} onImageRemove={handleImageRemove}/>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                             <ActionButton 
                                onClick={handleEdit} 
                                text="Sửa ảnh theo ảnh gốc và lời mô tả gợi ý" 
                                iconClass="fas fa-edit" 
                                isLoading={loading.isEditing}
                                disabled={!originalImage}
                            />
                             <ActionButton 
                                onClick={handleRemoveBackground} 
                                text="Xóa nền của ảnh gốc tải lên" 
                                iconClass="fas fa-eraser" 
                                isLoading={loading.isRemovingBg}
                                disabled={!originalImage}
                            />
                             <ActionButton 
                                onClick={handleEnhanceImage} 
                                text="Làm nét ảnh từ ảnh gốc tải lên" 
                                iconClass="fas fa-sparkles" 
                                isLoading={loading.isEnhancing}
                                disabled={!originalImage}
                                className="sm:col-span-2"
                            />
                        </div>

                        {error && <p className="text-red-400 mt-2 text-center p-3 bg-red-900/50 rounded-md">{error}</p>}
                    </div>

                    {/* Cot ket qua */}
                    <div className="flex flex-col gap-8">
                        {/* Ket qua tao/sua anh */}
                        <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                           <h2 className="text-2xl font-bold mb-4 text-gray-100">Kết quả tạo ảnh bằng Google Studio</h2>
                           <ImageResultGrid images={generatedImages} isLoading={loading.isGenerating || loading.isEditing} />
                        </div>

                        {/* Anh da xoa nen */}
                        { (loading.isRemovingBg || bgRemovedImage) &&
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4 text-gray-100">Ảnh đã xóa nền</h2>
                                {loading.isRemovingBg ? <div className="flex justify-center items-center h-48"><Loader/></div> :
                                bgRemovedImage && 
                                <div className="relative group flex justify-center">
                                    <img src={bgRemovedImage} alt="Ảnh đã xóa nền" className="max-w-full max-h-96 h-auto rounded-md bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIwIiB5PSIwIiBmaWxsPSIjZGRkIj48L3JlY3Q+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMCIgeT0iMTAiIGZpbGw9IiNkZGQiPjwvcmVjdD48L3N2Zz4=')] bg-repeat" />
                                     <a href={bgRemovedImage} download="background-removed.png" className="absolute bottom-2 right-2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <i className="fas fa-download"></i>
                                    </a>
                                </div>
                                }
                            </div>
                        }

                        {/* Ket qua lam net anh */}
                        { (loading.isEnhancing || enhancedImage) &&
                            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                                <h2 className="text-2xl font-bold mb-4 text-gray-100">Kết quả làm nét ảnh</h2>
                                {loading.isEnhancing ? <div className="flex justify-center items-center h-48"><Loader/></div> :
                                (enhancedImage && originalImage) && 
                                <ImageCompareSlider originalImage={originalImage.preview} enhancedImage={enhancedImage} />
                                }
                            </div>
                        }
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
