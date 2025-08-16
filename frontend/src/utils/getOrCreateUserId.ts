import { v4 as uuidv4 } from "uuid";

export const getOrCreateUserId = () => {
  const existing = localStorage.getItem("user-id");
  if (existing) return existing;
  const newId = uuidv4();
  localStorage.setItem("user-id", newId);
  return newId;
};