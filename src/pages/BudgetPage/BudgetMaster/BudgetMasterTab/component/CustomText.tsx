import { Tooltip } from "antd";
import classNames from "classnames";
import { useMemo } from "react";
import styles from "./CustomText.module.scss";

interface CustomTextProps {
  value: string;
  tooltipColor?: string;
  className?: string;
}

const TOOLTIP_MAX_WIDTH = 320;

export const CustomText = ({
  value,
  tooltipColor = "white",
  className,
}: CustomTextProps) => {
  const { overlayInnerStyle, overlayStyle } = useMemo(
    () => ({
      overlayInnerStyle: {
        color: "#0C2042",
      },
      overlayStyle: {
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "4px",
        maxWidth: TOOLTIP_MAX_WIDTH,
      },
    }),
    []
  );

  return (
    <Tooltip
      title={value}
      color={tooltipColor}
      placement="top"
      autoAdjustOverflow
      overlayInnerStyle={overlayInnerStyle}
      overlayStyle={overlayStyle}
    >
      <span className={classNames(styles["text-content"], className)}>
        {value}
      </span>
    </Tooltip>
  );
};
