interface OutlinedInfoIconProps {
  fillColor?: string;
}

const OutlinedInfoIcon = ({ fillColor = "#7A869A" }: OutlinedInfoIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_17110_202413)">
        <path
          d="M14.6654 8.0013C14.6654 4.3194 11.6806 1.33464 7.9987 1.33464C4.3168 1.33464 1.33203 4.3194 1.33203 8.0013C1.33203 11.6832 4.3168 14.668 7.9987 14.668C11.6806 14.668 14.6654 11.6832 14.6654 8.0013Z"
          stroke={fillColor}
          strokeWidth="1.5"
        />
        <path
          d="M8.15885 11.334V8.00065C8.15885 7.68638 8.15885 7.52925 8.06122 7.43162C7.96359 7.33398 7.80646 7.33398 7.49219 7.33398"
          stroke={fillColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.99206 5.33398H7.99805"
          stroke={fillColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_17110_202413">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default OutlinedInfoIcon;
