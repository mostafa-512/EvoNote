// src/config/api.js
const getBaseUrl = () => {
  const { protocol, hostname , host} = window.location;

  // لو انت في لوكال و الباك اند على بورت تاني
  if (hostname === 'localhost') {
    return `${protocol}//${hostname}:5002`;
  }

    if (hostname === '127.0.0.1') {
    return `${protocol}//${host}`;
  }

  // في البرودكشن نفس الدومين
  return `${protocol}//${hostname}`;
};

const API_BASE_URL = getBaseUrl();
export default API_BASE_URL;