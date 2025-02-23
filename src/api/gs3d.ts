import axios from "axios";
import type {
  ApiResponse,
  VideoUploadResponse,
  ClipFramesResponse,
  GenerateSceneResponse,
  StylizeSceneResponse,
} from "../types/api";

const API_BASE = "http://localhost:5000/gs";

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30秒超时
  headers: {
    "Content-Type": "application/json",
  },
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API请求错误:", error);
    return Promise.reject(error);
  }
);

export const processVideo = {
  // 视频上传
  uploadVideo: async (
    file: File
  ): Promise<ApiResponse<VideoUploadResponse>> => {
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 视频帧提取
  clipFrames: async (
    videoPath: string
  ): Promise<ApiResponse<ClipFramesResponse>> => {
    return apiClient.get("/clip", {
      params: { video_path: videoPath },
    });
  },

  // 3D场景生成
  generateScene: async (
    imagesPath: string
  ): Promise<ApiResponse<GenerateSceneResponse>> => {
    return apiClient.get("/generate", {
      params: { images_path: imagesPath },
    });
  },

  // 风格迁移
  stylizeScene: async (
    scenePath: string,
    styleImagePath: string
  ): Promise<ApiResponse<StylizeSceneResponse>> => {
    return apiClient.get("/stylized", {
      params: {
        scene_path: scenePath,
        style_image_path: styleImagePath,
      },
    });
  },

  // 上传风格图片
  uploadStyleImage: async (
    file: File
  ): Promise<ApiResponse<{ stylePath: string }>> => {
    const formData = new FormData();
    formData.append("style", file);
    return apiClient.post("/upload-style", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
