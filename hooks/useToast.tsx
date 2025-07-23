import { useState } from 'react';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      message,
      type,
      visible: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };

}

