import { getAuth, removeAuth } from "@/lib/auth";
import fetcher from "@/lib/fetcher";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function useFetcher<ResponseDataType>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ResponseDataType | null>(null);
  const [error, setError] = useState<null | string>(null);

  const navigate = useNavigate();

  async function fetch(
    payload?: unknown,
    contentType: "formdata" | "json" = "json"
  ) {
    setLoading(() => true);
    const headers: HeadersInit = {};
    const token = getAuth().token;
    if (token) {
      headers["authorization"] = `Bearer ${token}`;
    }
    if (contentType === "json") {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(payload);
    }
    const response = await fetcher<ResponseDataType>(
      endpoint,
      method,
      headers,
      payload
    );
    if (response.status === 401) {
      removeAuth();
      navigate("/");
    }
    setData(response.data);
    setError(response.error);
    setLoading(() => false);
    return response;
  }

  return {
    fetch,
    loading,
    data,
    error,
    response: { data, error },
  };
}

export default useFetcher;
