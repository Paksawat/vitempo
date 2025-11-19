import { X } from 'lucide-react';
import React from 'react';

export default function InfoModal({
  open,
  onClose,
  title,
  instructions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  instructions: string[];
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-100 text-slate-600 dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer flex justify-end w-full mb-2"
        >
          <X size={16} className="dark:text-slate-200 cursor-pointer " />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-slate-600 dark:text-slate-200">
          {title} Instructions
        </h3>

        <ul className="space-y-3 mb-6 text-slate-600 dark:text-slate-200">
          {instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-bold text-slate-600 dark:text-slate-200">
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
