import axios from "axios";
import {
  ClipResponse,
  GenerateResponse,
  StylizedResponse,
  GenerateRequest,
  StylizedRequest,
  ClipRequest,
} from "../types/api";

const API_BASE = "http://localhost:5000";

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000, // 5秒超时
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

// 视频采样接口
export const clipVideo = async (params: ClipRequest): Promise<ClipResponse> => {
  const formData = new FormData();
  formData.append("video", params.video);

  const response = await apiClient.post<ClipResponse>("/clip", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// 生成PLY文件接口
export const generatePly = async (
  params: GenerateRequest
): Promise<GenerateResponse> => {
  const response = await apiClient.post<GenerateResponse>("/generate", params, {
    responseType: "blob",
  });

  return response.data;
};

// 风格化接口
export const stylizePly = async (
  params: StylizedRequest
): Promise<StylizedResponse> => {
  const formData = new FormData();
  formData.append("scene_path", params.scene_path);
  formData.append("style_image", params.style_image);

  const response = await apiClient.post<StylizedResponse>(
    "/stylized",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob",
    }
  );

  return response.data;
};
