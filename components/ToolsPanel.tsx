"use client";

import React from 'react';
import { useImageStore } from '@/store/useImageStore';
import { Eraser, Maximize2, Scaling, Edit3, Expand, Download, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ToolsPanel() {
    const { selectedTool, setSelectedTool, isProcessing, originalImage, processedImage, reset } = useImageStore();

    const tools = [
        { id: 'remove-bg', label: 'Background Remove', desc: 'Image scrants', icon: Eraser },
        { id: 'upscale', label: 'Upscale', desc: 'Rite rorver', icon: Maximize2 },
        { id: 'resize', label: 'Resize', desc: 'Color griton', icon: Scaling },
        { id: 'edit', label: 'Prompt Edit', desc: 'Image expand', icon: Edit3 },
        { id: 'expand', label: 'Image Expand', desc: 'Down builet', icon: Expand },
    ] as const;

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `edited-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full max-w-sm flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        disabled={isProcessing || !originalImage}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left border",
                            selectedTool === tool.id
                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                : "bg-white border-transparent hover:border-gray-100 shadow-sm hover:shadow-md",
                            (isProcessing || !originalImage) && "opacity-50 cursor-not-allowed grayscale"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border",
                            selectedTool === tool.id ? "bg-blue-100 border-blue-200 text-blue-600" : "bg-white border-gray-100 text-gray-600"
                        )}>
                            <tool.icon size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("font-bold text-sm", selectedTool === tool.id ? "text-blue-900" : "text-gray-900")}>
                                {tool.label}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                {tool.desc}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={handleDownload}
                    disabled={!processedImage}
                    className="flex-1 py-3 px-4 bg-white border border-gray-100 shadow-sm rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Download
                </button>
                <button
                    onClick={reset}
                    className="flex-1 py-3 px-4 bg-white border border-gray-100 shadow-sm rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Try Another Tool
                </button>
            </div>
        </div>
    );
}
