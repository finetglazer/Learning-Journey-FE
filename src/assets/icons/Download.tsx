/* eslint-disable react/no-unknown-property */
import React from "react";
import { SVGIconProps } from "./SVGIconProps";

function Download(props: SVGIconProps) {
  const {
    width = 17,
    height = 16,
    fillColor = "var(--palette-base-neutral-6)",
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.54688 9.00879V2.00879"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0469 9.00879V13.0088H3.04688V9.00879"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0469 6.50879L8.54688 9.00879L6.04688 6.50879"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default Download;
