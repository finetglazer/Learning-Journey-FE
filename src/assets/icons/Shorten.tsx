/* eslint-disable react/no-unknown-property */
import React from "react";
import { SVGIconProps } from "./SVGIconProps";

function Shorten(props: SVGIconProps) {
  const {
    width = 16,
    height = 16,
    fillColor = "var(--palette-base-neutral-6)",
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 8H2.5"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1V6"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4L8 6L6 4"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 15V10"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12L8 10L10 12"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default Shorten;
