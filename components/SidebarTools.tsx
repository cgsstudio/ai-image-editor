"use client";

import React from 'react';
import { useImageStore } from '@/store/useImageStore';
import FeatureButton from './FeatureButton';
import { Eraser, Maximize2, Scaling, Edit3, Expand } from 'lucide-react';

export default function SidebarTools() {
    const { selectedTool, setSelectedTool, isProcessing, originalImage } = useImageStore();

    const tools = [
        { id: 'remove-bg', label: 'Background Remove', icon: Eraser },
        { id: 'upscale', label: 'Upscale', icon: Maximize2 },
        { id: 'resize', label: 'Resize', icon: Scaling },
        { id: 'edit', label: 'Prompt Edit', icon: Edit3 },
        { id: 'expand', label: 'Image Expand', icon: Expand },
    ] as const;

    return (
        <div className="w-full lg:w-80 flex flex-col gap-4 p-6 bg-white border-r border-gray-100 h-full">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Tools</h3>
            <div className="flex flex-col gap-3">
                {tools.map((tool) => (
                    <FeatureButton
                        key={tool.id}
                        icon={tool.icon}
                        label={tool.label}
                        isActive={selectedTool === tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        disabled={isProcessing || !originalImage}
                    />
                ))}
            </div>

            {!originalImage && (
                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                    <p className="text-sm text-gray-500">Upload an image to start editing</p>
                </div>
            )}
        </div>
    );
}
