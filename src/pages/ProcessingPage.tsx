import { useState } from "react";
import { clipVideo, generatePly, stylizePly } from "../api/gs3d";

const PlyViewer = ({ plyUrl }: { plyUrl: string }) => {
  return (
    <iframe
      src={`https://playcanvas.com/supersplat/editor?load=${encodeURIComponent(
        plyUrl
      )}`}
      className="w-full h-[600px] border-0 rounded-lg"
      title="PLY查看器"
    />
  );
};

export const ProcessingPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [styleImage, setStyleImage] = useState<File | null>(null);
  const [imagesPath, setImagesPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [finalPlyUrl, setFinalPlyUrl] = useState<string>("");

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleStyleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setStyleImage(e.target.files[0]);
    }
  };

  const handleClipVideo = async () => {
    if (!videoFile) return;
    setLoading(true);
    try {
      const response = await clipVideo({ video: videoFile });
      setImagesPath(response.output_images_path);
      setCurrentStep(2);
    } catch (error) {
      console.error("视频处理失败:", error);
    }
    setLoading(false);
  };

  const handleGeneratePly = async () => {
    if (!imagesPath) return;
    setLoading(true);
    try {
      const response = await generatePly({ images_path: imagesPath });
      const plyBlob = response.ply_file;
      const plyUrl = URL.createObjectURL(plyBlob);
      setCurrentStep(3);
      setFinalPlyUrl(plyUrl);
    } catch (error) {
      console.error("生成PLY失败:", error);
    }
    setLoading(false);
  };

  const handleStylizePly = async () => {
    if (!styleImage || !imagesPath) return;
    setLoading(true);
    try {
      const response = await stylizePly({
        scene_path: imagesPath,
        style_image: styleImage,
      });
      const finalPlyBlob = response.ply_file;
      const url = URL.createObjectURL(finalPlyBlob);
      setFinalPlyUrl(url);
    } catch (error) {
      console.error("风格化失败:", error);
    }
    setLoading(false);
  };

  const steps = [
    { id: 1, title: "视频采样", icon: "01" },
    { id: 2, title: "生成PLY", icon: "02" },
    { id: 3, title: "风格化", icon: "03" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">3D模型生成与风格化</h1>

      {/* 标签导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`mr-8 py-4 px-4 border-b-2 font-medium text-sm flex items-center ${
                currentStep === step.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
            >
              <span
                className={`
                w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs
                ${
                  currentStep === step.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }
              `}
              >
                {step.icon}
              </span>
              {step.title}
            </button>
          ))}
        </nav>
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* 步骤1：视频采样 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">点击上传视频</span>
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>
            </div>
            {videoFile && (
              <div className="text-sm text-gray-500">
                已选择文件: {videoFile.name}
              </div>
            )}
            <button
              onClick={handleClipVideo}
              disabled={!videoFile || loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {loading ? "处理中..." : "开始处理"}
            </button>
          </div>
        )}

        {/* 步骤2：生成PLY */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              视频已处理完成，点击下方按钮生成PLY文件
            </p>
            <button
              onClick={handleGeneratePly}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {loading ? "生成中..." : "生成PLY"}
            </button>

            {finalPlyUrl && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">预览结果</h3>
                <PlyViewer plyUrl={finalPlyUrl} />
              </div>
            )}
          </div>
        )}

        {/* 步骤3：风格化 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">上传风格图片</span>
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleStyleImageUpload}
                />
              </label>
            </div>
            {styleImage && (
              <div className="text-sm text-gray-500">
                已选择文件: {styleImage.name}
              </div>
            )}
            <button
              onClick={handleStylizePly}
              disabled={!styleImage || loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {loading ? "风格化中..." : "开始风格化"}
            </button>
          </div>
        )}

        {/* 结果展示 */}
        {finalPlyUrl && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">预览结果</h3>
            <PlyViewer plyUrl={finalPlyUrl} />
          </div>
        )}
      </div>
    </div>
  );
};
