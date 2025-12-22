import React from 'react';

export default function LayoutHeader() {
    return (
        <header className="w-full py-6 px-8 flex items-center justify-between bg-transparent">
            <div className="flex items-center gap-2">
                <span className="font-bold text-2xl tracking-tight text-black">AI Image Editor</span>
            </div>
            <div className="flex items-center gap-8">
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-black">About</a>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 rounded-xl border border-blue-500 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
                        Try Free
                    </button>
                    <a
                        href="/code-generator"
                        className="px-5 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors"
                    >
                        Code Generator
                    </a>
                </div>
            </div>
        </header>
    );
}
