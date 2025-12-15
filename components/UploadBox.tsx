"use client";

import React, { useCallback, useState } from 'react';
import { useImageStore } from '@/store/useImageStore';
import { cn } from '@/lib/utils';

export default function UploadBox() {
    const { setOriginalImage } = useImageStore();
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [setOriginalImage]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }, [handleFile]);

    return (
        <div className="w-full h-full min-h-[300px]">
            <label
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={cn(
                    "flex flex-col items-center justify-center w-full h-full rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 bg-gray-50/50",
                    isDragging
                        ? "border-blue-400 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                )}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors mb-4">
                        Upload Image
                    </div>
                    <p className="text-gray-500 font-medium">
                        or drag and drop
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />
            </label>
        </div>
    );
}
