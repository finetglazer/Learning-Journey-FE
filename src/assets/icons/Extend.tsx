/* eslint-disable react/no-unknown-property */
import React from "react";
import { SVGIconProps } from "./SVGIconProps";

function Extend(props: SVGIconProps) {
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
        d="M8 6V1"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3L8 1L10 3"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10V15"
        stroke={fillColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13L8 15L6 13"
        stroke="#343330"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default Extend;
