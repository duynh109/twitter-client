import useQueryParams from './useQueryParams';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function VerifyEmail() {
  const [message, setMessage] = useState();
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
          '/users/verify-email', //URL xác thực email bên backend
          { email_verify_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
            signal: controllerRef.current.signal,
          }
        )
        .then((res) => {
          setMessage(res.data.message);
          if (res.data.result) {
            const { access_token, refresh_token } = res.data.result;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
          }
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
  }, [token]);

  return <div>{message}</div>;
}
