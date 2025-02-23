import { useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { processVideo } from "../api/gs3d";

interface ProcessState {
  currentStep: number;
  loading: boolean;
  videoPath: string;
  imagesPath: string;
  scenePath: string;
  styleImagePath: string;
  resultPath: string;
}

export const ProcessingPage = () => {
  const [state, setState] = useState<ProcessState>({
    currentStep: 0,
    loading: false,
    videoPath: "",
    imagesPath: "",
    scenePath: "",
    styleImagePath: "",
    resultPath: "",
  });

  // 处理视频上传
  const handleVideoUpload = async (file: File) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await processVideo.uploadVideo(file);
      setState((prev) => ({
        ...prev,
        videoPath: res.data.videoPath,
      }));
      await handleClipFrames(res.data.videoPath);
    } catch (error) {
      console.error("视频上传失败:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // 处理帧提取
  const handleClipFrames = async (videoPath: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await processVideo.clipFrames(videoPath);
      setState((prev) => ({
        ...prev,
        imagesPath: res.data.imagesPath,
        currentStep: 1,
      }));
      await handleGenerate(res.data.imagesPath);
    } catch (error) {
      console.error("帧提取失败:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // 处理3D场景生成
  const handleGenerate = async (imagesPath: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await processVideo.generateScene(imagesPath);
      setState((prev) => ({
        ...prev,
        scenePath: res.data.scenePath,
        currentStep: 2,
      }));
    } catch (error) {
      console.error("场景生成失败:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // 处理风格图片上传
  const handleStyleUpload = async (file: File) => {
    // 这里应该先上传风格图片到服务器
    setState((prev) => ({
      ...prev,
      styleImagePath: URL.createObjectURL(file),
    }));
  };

  // 处理风格迁移
  const handleStylize = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await processVideo.stylizeScene(
        state.scenePath,
        state.styleImagePath
      );
      setState((prev) => ({
        ...prev,
        resultPath: res.data.resultPath,
        currentStep: 3,
      }));
    } catch (error) {
      console.error("风格迁移失败:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">3D场景生成与风格化</h1>

      {/* 步骤指示器 */}
      <div className="flex justify-between mb-8">
        {["上传视频", "提取帧", "生成场景", "风格迁移"].map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index <= state.currentStep ? "text-blue-500" : "text-gray-400"
            }`}
          >
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
              {index + 1}
            </div>
            <span className="ml-2">{step}</span>
          </div>
        ))}
      </div>

      {/* 主要内容区 */}
      <div className="space-y-8">
        {/* 步骤1: 视频上传 */}
        <div className={state.currentStep === 0 ? "" : "hidden"}>
          <FileUpload
            accept="video/*"
            onUpload={handleVideoUpload}
            disabled={state.loading}
          />
        </div>

        {/* 步骤2: 帧序列展示 */}
        <div className={state.currentStep === 1 ? "" : "hidden"}>
          <p>正在处理帧序列...</p>
        </div>

        {/* 步骤3: 3D场景预览 */}
        <div className={state.currentStep === 2 ? "" : "hidden"}>
          <FileUpload
            accept="image/*"
            onUpload={handleStyleUpload}
            disabled={state.loading}
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => handleStylize()}
            disabled={!state.styleImagePath || state.loading}
          >
            开始风格迁移
          </button>
        </div>

        {/* 步骤4: 结果展示 */}
        <div className={state.currentStep === 3 ? "" : "hidden"}>
          <p>处理完成！结果路径: {state.resultPath}</p>
        </div>

        {/* 加载提示 */}
        {state.loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">处理中...</div>
          </div>
        )}
      </div>
    </div>
  );
};
