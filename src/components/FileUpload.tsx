import { ChangeEvent, useRef, useState } from "react";

interface FileUploadProps {
  accept: string; // 接受的文件类型
  onUpload: (file: File) => void; // 上传回调
  disabled?: boolean; // 是否禁用
  maxSize?: number; // 最大文件大小(MB)
  description?: string; // 上传描述文本
}

export const FileUpload = ({
  accept,
  onUpload,
  disabled = false,
  maxSize = 100,
  description = "点击或拖拽文件到此处上传",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件验证
  const validateFile = (file: File): boolean => {
    setError("");

    // 检查文件类型
    if (!file.type.match(accept.replace("/*", "/"))) {
      setError("文件类型不支持");
      return false;
    }

    // // 检查文件大小
    // if (file.size > maxSize * 1024 * 1024) {
    //   setError(`文件大小不能超过 ${maxSize}MB`);
    //   return false;
    // }

    return true;
  };

  // 处理文件选择
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onUpload(file);
    }
    // 重置 input 值以允许重复上传相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 处理拖拽事件
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  // 处理文件放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files[0];
    if (file && validateFile(file)) {
      onUpload(file);
    }
  };

  // 触发文件选择
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
            relative
            border-2 border-dashed rounded-lg
            p-8
            text-center
            cursor-pointer
            transition-colors
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-blue-500"
            }
          `}
        onClick={disabled ? undefined : handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={disabled ? undefined : handleDrop}
      >
        {/* 隐藏的文件输入框 */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {/* 上传图标 */}
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path d="M24 8v32m16-16H8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* 上传文本 */}
        <p className="text-gray-600">{description}</p>
        <p className="text-sm text-gray-500 mt-2">
          支持{accept.split(",").join("、")}格式
          {maxSize && `，大小不超过 ${maxSize}MB`}
        </p>

        {/* 错误提示 */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};
