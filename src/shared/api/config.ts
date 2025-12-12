// 개발 환경에서는 Vite proxy를 사용하고, 프로덕션에서는 직접 API를 호출
const isDevelopment = import.meta.env.MODE === 'development';

export const API_BASE_URL = isDevelopment 
  ? '/api'  // 개발: Vite proxy 사용
  : 'https://dummyjson.com';  // 프로덕션: 직접 API 호출


