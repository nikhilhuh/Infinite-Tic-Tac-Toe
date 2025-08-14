import React from "react";
import { ClipLoader } from "react-spinners";

const Cliploader: React.FC<{ size: number; color?: string }> = ({
  size,
  color,
}) => {
  return (
    <ClipLoader
      size={size}
      color={color || "white"}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Cliploader;
