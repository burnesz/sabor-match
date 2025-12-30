import { toast } from 'react-toastify';

// Configurações padrão para não repetir código
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

// Objeto exportado com métodos simplificados
export const notify = {
  success: (message) => {
    toast.success(message, defaultOptions);
  },
  error: (message) => {
    toast.error(message, defaultOptions);
  },
  warn: (message) => {
    toast.warn(message, defaultOptions);
  },
  info: (message) => {
    toast.info(message, defaultOptions);
  }
};