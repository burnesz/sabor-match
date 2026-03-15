// frontend/src/hooks/app/useFlashMessage.js
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { notify } from '../../utils/notification.js';

export function useFlashMessage() {
  const location = useLocation();
  const navigate = useNavigate();
  const jaNotificou = useRef(false);

  useEffect(() => {
    if (location.state && location.state.mensagem) {
      if (jaNotificou.current) return;
      
      const { mensagem, tipo } = location.state;

      if (tipo === 'error') notify.error(mensagem);
      else if (tipo === 'warn') notify.warn(mensagem);
      else notify.success(mensagem);

      jaNotificou.current = true;

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);
}