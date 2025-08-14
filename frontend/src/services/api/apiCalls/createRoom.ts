import { axiosInstance } from "@/services/axiosInstance";
import { apiErrorHandler } from "../apiErrorHandling";

export const createRoomAPI = async (name: string) => {
  try {
    const response = await axiosInstance.post("/create-room", {
        name
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
