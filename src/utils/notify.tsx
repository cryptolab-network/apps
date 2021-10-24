import { toast, ToastOptions } from 'react-toastify';

export const notifyWarn = (msg: string) => {
  toast.warn(`${msg}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

export const notifyInfo = (msg: string | React.ReactElement) => {
  const options: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  };

  if (typeof msg === 'string') {
    toast.info(`${msg}`, options);
  } else {
    toast.info(msg, options);
  }
};

export const notifySuccess = (msg: string) => {
  toast.success(`${msg}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    onClose: () => {
      toast.dismiss();
    },
  });
};

export const notifyFailed = (msg: string) => {
  toast.error(`${msg}`, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    onClose: () => {
      toast.dismiss();
    },
  });
};

export const notifyProcessing = (msg: string) => {
  toast.success(`${msg}`, {
    position: 'top-right',
    autoClose: 30000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};
