import { create } from 'zustand';

type Tool = 'remove-bg' | 'upscale' | 'resize' | 'edit' | 'expand' | null;

interface ImageState {
    originalImage: string | null;
    processedImage: string | null;
    isProcessing: boolean;
    selectedTool: Tool;
    error: string | null;

    setOriginalImage: (image: string | null) => void;
    setProcessedImage: (image: string | null) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    setSelectedTool: (tool: Tool) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
    originalImage: null,
    processedImage: null,
    isProcessing: false,
    selectedTool: null,
    error: null,

    setOriginalImage: (image) => set({ originalImage: image, processedImage: null, error: null }),
    setProcessedImage: (image) => set({ processedImage: image }),
    setIsProcessing: (isProcessing) => set({ isProcessing }),
    setSelectedTool: (tool) => set({ selectedTool: tool, error: null }),
    setError: (error) => set({ error }),
    reset: () => set({
        originalImage: null,
        processedImage: null,
        isProcessing: false,
        selectedTool: null,
        error: null
    }),
}));
