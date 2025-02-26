// 视频采样接口响应类型
export interface ClipResponse {
  output_images_path: string; // 输出图片目录路径
}

// 生成PLY接口响应类型
export interface GenerateResponse {
  ply_file: Blob; // PLY文件二进制数据
}

// 风格化接口响应类型
export interface StylizedResponse {
  ply_file: Blob; // 风格化后的PLY文件二进制数据
}

// 请求参数类型
export interface GenerateRequest {
  images_path: string;
}

export interface StylizedRequest {
  scene_path: string;
  style_image: File;
}

export interface ClipRequest {
  video: File;
}
