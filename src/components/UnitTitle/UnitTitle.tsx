import { useTranslation } from "react-i18next";
import "./UnitTitle.scss";
import classNames from "classnames";
import React from "react";
import { Tooltip } from "antd";

interface UnitTitleProps {
  title: string;
  unit?: React.ReactNode | string;
  className?: string;
  isShowUnit?: boolean;
  required?: boolean;
  isEllipsis?: boolean;
}

export const UnitTitle = ({
  title,
  unit,
  className,
  isShowUnit = true,
  required = false,
  isEllipsis = false,
}: UnitTitleProps) => {
  const [translate] = useTranslation();

  return (
    <div className={classNames("unit-title__container", className)}>
      <span
        className={classNames("text-title", isEllipsis ? "text-ellipsis" : "")}
      >
        <Tooltip title={title}>{title}</Tooltip>
        {required && <span className="text-red">{`  *`}</span>}
      </span>
      {isShowUnit && (
        <span className="text-unit">
          {unit || translate("PM.payment_currency_unit")}
        </span>
      )}
    </div>
  );
};
