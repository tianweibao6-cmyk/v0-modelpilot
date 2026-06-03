"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    setUploadedFile(file);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-3xl" />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
          ${isDragging 
            ? "border-primary bg-primary/10 scale-[1.02]" 
            : "border-border hover:border-primary/50 hover:bg-card/50"
          }
        `}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {!uploadedFile ? (
          <div className="flex flex-col items-center gap-6">
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary"}
            `}>
              <Upload className="w-10 h-10" />
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                拖拽赛题文件到这里
              </h3>
              <p className="text-muted-foreground mb-4">
                或者点击此处选择文件
              </p>
              <p className="text-sm text-muted-foreground/70">
                支持 PDF、Word、TXT 格式，最大 50MB
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-md">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                {uploadProgress === 100 ? (
                  <CheckCircle className="w-6 h-6 text-primary" />
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              {uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    上传中... {uploadProgress}%
                  </p>
                </div>
              )}
              
              {uploadProgress === 100 && (
                <div className="mt-6 text-center">
                  <p className="text-primary font-medium mb-2">文件上传成功！</p>
                  <p className="text-muted-foreground text-sm">
                    请购买服务后，AI 将为您生成完整建模方案
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
