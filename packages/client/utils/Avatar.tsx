import React from "react";
import Blockies from "react-blockies";

export default function Avatar({
  address,
  size = 10,
  scale = 3,
}: {
  address: string;
  size?: number;
  scale?: number;
}) {
  return (
    <Blockies
      seed={address}
      size={size}
      scale={scale}
      color="#0B6BCB"
      bgColor="#97C3F0"
      spotColor="#1565c0"
      className="rounded-full"
    />
  );
}
