"use client";

import LayoutHeader from '@/components/LayoutHeader';
import ToolsPanel from '@/components/ToolsPanel';
import MainContent from '@/components/MainContent';

export default function ImageEditorPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-7xl bg-white rounded-[2.5rem] shadow-xl overflow-hidden min-h-[85vh] flex flex-col">
        <LayoutHeader />

        <div className="flex-1 p-8 lg:p-12 flex flex-col">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
              Edit Your Images Instantly with AI
            </h1>
            <p className="text-gray-500 text-lg">
              Remove background, upscale, resize, and more — all in one click.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 h-full flex-1">
            {/* Left Side: Canvas / Upload */}
            <div className="flex-1 bg-transparent rounded-3xl overflow-hidden min-h-[400px] flex flex-col">
              <MainContent />
            </div>

            {/* Right Side: Tools */}
            <div className="w-full lg:w-[360px] flex-shrink-0">
              <ToolsPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


