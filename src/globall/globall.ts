import axios, { AxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
  data?: T;
  error?: boolean;
  success?: boolean;
  message?: string;
  subcode?: string;
}

interface ApiOptions extends Omit<AxiosRequestConfig, 'url'> {
  url: string;
}

const api = async <T = any>({ 
  url, 
  method = 'GET', 
  data = {}, 
  params,
  ...config 
}: ApiOptions): Promise<ApiResponse<T>> => {
  try {
    const host = "https://gateway.smit.team"; // Thêm domain của bạn vào đây

    const response = await axios({
      url: host + url,
      method,
      data: method !== 'GET' ? JSON.stringify(data) : undefined,
      params,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      withCredentials: true,
      ...config
    });

    if (response.data.error && response.data.message) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (e: any) {
    const message = 
      e?.response?.data?.message ||
      e?.message ||
      'Lỗi không xác định! Vui lòng thử lại sau';

    const subcode = 
      e?.response?.data?.subcode || 
      e?.subcode || 
      'unknown';

    return { 
      error: true, 
      message, 
      subcode 
    };
  } 
};

export default api;
