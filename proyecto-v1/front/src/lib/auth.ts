import { jwtDecode } from "jwt-decode";

type TokenData = {
  id: number;
  email: string;
  gender_id: number;
  is_admin: boolean;
};

export const removeAuth = () => {
  localStorage.removeItem("token");
};

export const setAuth = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuth = () => {
  const result: {
    data: null | TokenData;
    token: string | null;
    error: string | null;
  } = {
    data: null,
    token: null,
    error: null,
  };
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw "Token inválido o inexistente.";
    }
    result.token = token;
    const decodedToken = jwtDecode(token) as TokenData;
    result.data = decodedToken;
  } catch (error) {
    result.error = `Error al obtener token: ${error}`;
  }
  return result;
};
