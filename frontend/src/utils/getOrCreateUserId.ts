import { v4 as uuidv4 } from "uuid";

export const getOrCreateUserId = () => {
  const existing = sessionStorage.getItem("user-id");
  if (existing) return existing;
  const newId = uuidv4();
  sessionStorage.setItem("user-id", newId);
  return newId;
};