import { useTranslation } from "react-i18next";
import "./UnitTitleTable.scss";
import classNames from "classnames";

interface UnitTitleProps {
  title: string;
  unit?: string;
  className?: string;
  isRequire?: boolean;
}

export const UnitTitleTable = ({
  title,
  unit,
  className,
  isRequire,
}: UnitTitleProps) => {
  const [translate] = useTranslation();

  return (
    <>
      {isRequire ? (
        <div className="unit-title__container__required">
          <div className={classNames("unit-title__container", className)}>
            <span className="text-title">{title}</span>
            <span className="text-unit">
              {unit || translate("PM.payment_currency_unit")}
            </span>
          </div>
          <div className="text-danger">&nbsp;*</div>
        </div>
      ) : (
        <div className={classNames("unit-title__container", className)}>
          <span className="text-title">{title}</span>
          <span className="text-unit">
            {unit || translate("PM.payment_currency_unit")}
          </span>
        </div>
      )}
    </>
  );
};
