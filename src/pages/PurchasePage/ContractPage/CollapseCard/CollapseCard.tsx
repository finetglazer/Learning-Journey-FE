import classNames from "classnames";
import { PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import { IcArrowDown } from "assets/icons";
import "./CollapseCard.scss";

type CollapseCardProps = PropsWithChildren<{
  title?: string;
}>;

const CollapseCard = (props: CollapseCardProps) => {
  const [translate] = useTranslation();
  const { children = "", title = `${translate("PP.base")}` } = props;
  const [collapse, setCollapse] = useState<boolean>(true);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <>
      <div className="collapse-card-header">
        <div className="collapse-card-title">{title}</div>
        <div onClick={handleChangeCollapse}>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && children}
    </>
  );
};

export default CollapseCard;
