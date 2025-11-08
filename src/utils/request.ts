import axios, { AxiosError, AxiosResponse } from "axios";

export const getRequest = async <TResponse>(
  url: string,
  params: Record<string, unknown> = {},
  headers: Record<string, string> = {}
): Promise<TResponse> => {
  try {
    const response: AxiosResponse<TResponse> = await axios.get(url, {
      params,
      headers: {
        "Accept-Language": "en",
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error);
    throw error;
  }
};

export const postRequest = async <TResponse, TBody = unknown>(
  url: string,
  body: TBody,
  headers: Record<string, string> = {}
): Promise<TResponse> => {
  try {
    const response: AxiosResponse<TResponse> = await axios.post(url, body, {
      headers: {
        "Accept-Language": "en",
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error);
    throw error;
  }
};

export const putRequest = async <TResponse, TBody = unknown>(
  url: string,
  body: TBody,
  headers: Record<string, string> = {}
): Promise<TResponse> => {
  try {
    const response: AxiosResponse<TResponse> = await axios.put(url, body, {
      headers: {
        "Accept-Language": "en",
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error);
    throw error;
  }
};

export const deleteRequest = async <TResponse>(
  url: string,
  headers: Record<string, string> = {}
): Promise<TResponse> => {
  try {
    const response: AxiosResponse<TResponse> = await axios.delete(url, {
      headers: {
        "Accept-Language": "en",
        "Content-Type": "application/json",
        ...headers,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error);
    throw error;
  }
};

const handleAxiosError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status ?? "Unknown";
    const message =
      axiosError.response?.data?.message ?? axiosError.message ?? "Unknown error";
    console.error(`[HTTP ${status}] ${message}`);
  } else {
    console.error("[HTTP ERROR] Unexpected error:", error);
  }
};
