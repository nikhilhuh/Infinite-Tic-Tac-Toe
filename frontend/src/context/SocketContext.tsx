import { createContext, useContext, ReactNode } from "react";
import { useSocket } from "@/hooks/useSocket";

const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketData = useSocket();

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used inside SocketProvider");
  }
  return context;
};
