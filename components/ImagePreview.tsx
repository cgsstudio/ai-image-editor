"use client";

import React, { useState, useEffect } from 'react';
import { useImageStore } from '@/store/useImageStore';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ImagePreview() {
    const {
        originalImage,
        processedImage,
        selectedTool,
        isProcessing,
        setIsProcessing,
        setProcessedImage,
        setError,
    } = useImageStore();

    const [prompt, setPrompt] = useState('');
    const [width, setWidth] = useState(1024);
    const [height, setHeight] = useState(1024);

    // Reset local state when tool changes
    useEffect(() => {
        setPrompt('');
        setError(null);
    }, [selectedTool, setError]);

    const handleProcess = async () => {
        if (!selectedTool || !originalImage) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Convert base64 to Blob
            const response = await fetch(originalImage);
            const blob = await response.blob();
            const file = new File([blob], "image.png", { type: "image/png" });

            const formData = new FormData();
            formData.append('image', file);

            if (selectedTool === 'edit') {
                formData.append('prompt', prompt);
            }
            if (selectedTool === 'resize') {
                formData.append('width', width.toString());
                formData.append('height', height.toString());
            }

            const apiResponse = await fetch(`/api/${selectedTool}`, {
                method: 'POST',
                body: formData,
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to process image');
            }

            const data = await apiResponse.json();
            if (data.error) throw new Error(data.error);

            setProcessedImage(data.image);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!originalImage) return null;

    return (
        <div className="w-full h-full flex flex-col relative">
            {/* Main Preview Area */}
            <div className="relative w-full h-full min-h-[400px] bg-gray-100 rounded-3xl overflow-hidden shadow-inner border border-gray-200">
                <Image
                    src={processedImage || originalImage}
                    alt="Preview"
                    fill
                    className="object-contain p-4"
                />

                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                        <p className="text-gray-600 font-medium animate-pulse">Processing Image...</p>
                    </div>
                )}

                {/* Success Badge */}
                {processedImage && !isProcessing && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Check size={12} /> Processed
                    </div>
                )}
            </div>

            {/* Tool Controls Overlay (Floating) */}
            {selectedTool && !processedImage && !isProcessing && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-10 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 capitalize">{selectedTool.replace('-', ' ')}</h3>
                        </div>

                        {selectedTool === 'edit' && (
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your edit..."
                                className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 bg-white"
                            />
                        )}

                        {selectedTool === 'resize' && (
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Width</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(Number(e.target.value))}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Height</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleProcess}
                            disabled={selectedTool === 'edit' && !prompt}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                        >
                            Apply {selectedTool.replace('-', ' ')} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
