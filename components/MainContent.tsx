"use client";

import React from 'react';
import { useImageStore } from '@/store/useImageStore';
import UploadBox from './UploadBox';
import ImagePreview from './ImagePreview';

export default function MainContent() {
    const { originalImage } = useImageStore();

    return (
        <div className="flex-1 flex flex-col">
            {!originalImage ? (
                <div className="flex-1 flex items-center justify-center">
                    <UploadBox />
                </div>
            ) : (
                <ImagePreview />
            )}
        </div>
    );
}
