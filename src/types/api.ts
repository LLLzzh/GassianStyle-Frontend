// API响应的通用类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 视频处理相关的响应类型
export interface VideoUploadResponse {
  videoPath: string;
}

export interface ClipFramesResponse {
  imagesPath: string;
}

export interface GenerateSceneResponse {
  scenePath: string;
}

export interface StylizeSceneResponse {
  resultPath: string;
}
