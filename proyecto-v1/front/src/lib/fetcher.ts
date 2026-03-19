async function fetcher<ResponseDataType>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  headers: Record<string, string>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const preflight = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      body: payload,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": "*",
      },
    });

    const response: {
      data: null | ResponseDataType;
      error: null | string;
      status: number;
    } = { ...(await preflight.json()), status: preflight.status };

    return response;
  } catch {
    return {
      data: null,
      error: "Error al realizar la petición.",
      status: 500,
    };
  }
}

export default fetcher;
