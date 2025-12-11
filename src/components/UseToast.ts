// hooks/useToast.ts
import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'custommm'; // 🆕 Thêm custommm

interface ToastOptions {
  title?: string;
  message: string; // message là bắt buộc
  duration?: number;
}

export const useToast = () => {
  const showToast = (type: ToastType, options: ToastOptions) => {
    Toast.show({
      type,
      text1: options.title || (
        type === 'success' ? 'Thành công' : 
        type === 'error' ? 'Lỗi' : 
        type === 'custommm' ? 'Custom' : // 🆕 Thêm default title
        'Thông tin'
      ),
      text2: options.message,
      position: 'bottom',
      visibilityTime: options.duration || 3000,
    });
  };

  return {
    showSuccess: (message: string, options?: Omit<ToastOptions, 'message'>) => 
      showToast('success', { message, ...options }),
    
    showError: (message: string, options?: Omit<ToastOptions, 'message'>) => 
      showToast('error', { message, ...options }),
    
    showInfo: (message: string, options?: Omit<ToastOptions, 'message'>) => 
      showToast('info', { message, ...options }),
    
    // 🆕 Thêm method cho custom toast
    showCustommm: (message: string, options?: Omit<ToastOptions, 'message'>) => 
      showToast('custommm', { message, ...options }),
  };
};
