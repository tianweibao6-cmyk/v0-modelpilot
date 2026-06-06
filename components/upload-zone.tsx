"use client";

import { useState, useCallback } from "react";
import { Upload } from "lucide-react";

export function UploadZone({ onPurchase }: { onPurchase: () => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      onPurchase();
    },
    [onPurchase]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onPurchase}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer text-left
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-[#d4d4d8] bg-[#f4f4f5] hover:border-primary/50 hover:bg-secondary/70"
          }
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDragging ? "btn-gradient scale-110" : "bg-primary/10 text-primary"}
          `}>
            <Upload className="w-10 h-10" />
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              拖拽赛题文件到这里
            </h3>
            <p className="text-muted-foreground mb-4">
              或者点击此处开始
            </p>
            <p className="text-sm text-muted-foreground/70">
              支持 PDF、Word、TXT 格式，最大 50MB
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

