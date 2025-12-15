import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureButtonProps {
    icon: LucideIcon;
    label: string;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export default function FeatureButton({ icon: Icon, label, isActive, onClick, disabled }: FeatureButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                isActive
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100",
                disabled && "opacity-50 cursor-not-allowed"
            )}
        >
            <Icon size={20} className={cn(isActive ? "text-white" : "text-gray-500")} />
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
}
