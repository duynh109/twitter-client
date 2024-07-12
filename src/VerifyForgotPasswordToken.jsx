import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useQueryParams from './useQueryParams';

export default function VerifyForgotPasswordToken() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useQueryParams();
  // Sử dụng useRef để giữ controller giữa các render
  const controllerRef = useRef(null);

  useEffect(() => {
    if (token) {
      // Khởi tạo AbortController mới nếu chưa có hoặc nếu đã bị hủy
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();

      axios
        .post(
          '/users/verify-forgot-password', //URL xác thực token forgot password bên backend
          { forgot_password_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
            signal: controllerRef.current.signal,
          }
        )
        .then(() => {
          // Cách 1: lưu forgot_passwrod_token vào localstorage và trang ResetPassword chỉ cần get ra và dùng

          // Cách 2: dùng state của React Router để truyền forgot_password_token qua trang ResetPassword
          navigate('/reset-password', { state: { forgot_password_token: token } });
        })
        .catch((error) => {
          setMessage(error.response.data.message);
        });
    }

    return () => {
      // Hủy yêu cầu khi component unmount hoặc query thay đổi
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [token, navigate]);
  return <div>{message}</div>;
}
