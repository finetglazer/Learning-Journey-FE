import React from "react";
import { Button } from "react-components-design-system";
import "./EmptyTable.scss";
import classNames from "classnames";
import { AddIcon } from "assets/icons";

type props = {
  content?: JSX.Element;
  textButton?: string;
  icon?: JSX.Element;
  onHandleClickAdd?: () => void;
  disableButton?: boolean;
  isSolid?: boolean;
};
const EmptyTable = ({
  textButton,
  icon,
  content,
  onHandleClickAdd,
  disableButton = false,
}: props) => {
  return (
    <div className={classNames("empty-data-table__body")}>
      {icon}
      <div className="empty-data-table__body__content">
        <span className="content">{content}</span>
      </div>
    </div>
  );
};

export default EmptyTable;
