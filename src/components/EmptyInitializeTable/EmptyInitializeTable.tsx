import React from "react";
import { Button } from "react-components-design-system";
import "./EmptyInitializeTable.scss";
import classNames from "classnames";
import { AddIcon } from "assets/icons";

type props = {
  content: JSX.Element;
  textButton: string;
  icon: JSX.Element;
  onHandleClickAdd: () => void;
  disableButton?: boolean;
  isSolid?: boolean;
  buttonIcon?: JSX.Element;
};
const EmptyInitializeTable = ({
  textButton,
  icon,
  content,
  onHandleClickAdd,
  disableButton = false,
  buttonIcon,
}: props) => {
  return (
    <div className={classNames("empty-data-table__body")}>
      {icon}
      <div className="empty-data-table__body__content">
        <span className="content">{content}</span>
        <div
          className={classNames(
            "empty-data-table__body__content__button",
            disableButton ? "disable_button_icon" : ""
          )}
        >
          <Button
            icon={
              buttonIcon || (
                <img src={AddIcon} alt="img" width={12} height={12} />
              )
            }
            iconPlace="left"
            type="secondary"
            onClick={onHandleClickAdd}
            disabled={disableButton}
          >
            {textButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyInitializeTable;
