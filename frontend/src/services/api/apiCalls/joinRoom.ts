import { axiosInstance } from "@/services/axiosInstance";
import { apiErrorHandler } from "../apiErrorHandling";

export const joinRoomAPI = async (name: string, roomId: string) => {
  try {
    const response = await axiosInstance.post("/join-room", {
        name,
        roomId
    });
    return response.data;
  } catch (err: any) {
    return apiErrorHandler(err);
  }
};
