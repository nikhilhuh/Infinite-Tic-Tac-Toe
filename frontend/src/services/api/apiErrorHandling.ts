import { isAxiosError } from "axios";

export const apiErrorHandler = (err: any) => {
  if (isAxiosError(err)) {
    if (err.code === "ECONNABORTED") {
      return { success: false, message: "Request Timed Out" };
    } else if (err.response) {
      const { status, data } = err.response;
      const message = data?.message || "Something went wrong";

      return {
        success: false,
        message,
        status,
      };
    } else if (err.request) {
      return { success: false, message: "No response from server" };
    }
  }

  if (err instanceof Error) {
    return { success: false, message: err.message || "Unexpected error occurred" };
  }

  return { success: false, message: "An unknown error occurred" };
};
