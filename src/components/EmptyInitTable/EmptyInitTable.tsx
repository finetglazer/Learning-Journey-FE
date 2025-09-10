import React from "react";
import { Button } from "react-components-design-system";
import "./EmptyInitTable.scss";
import classNames from "classnames";
import { AddIcon } from "assets/icons";

type props = {
  content: JSX.Element;
  textButtonLeft: string;
  textButtonRight: string;
  icon: JSX.Element;
  onHandleClickAddLeft?: () => void;
  disableButtonLeft?: boolean;
  isSolid?: boolean;
  buttonIconLeft?: JSX.Element;
  buttonIconRight?: JSX.Element;
  disableButtonRight?: boolean;
  onHandleClickAddRight?: () => void;
};
const EmptyInitTable = ({
  textButtonLeft,
  textButtonRight,
  icon,
  content,
  onHandleClickAddLeft,
  disableButtonLeft = false,
  disableButtonRight = false,
  buttonIconLeft,
  buttonIconRight,
  onHandleClickAddRight,
}: props) => {
  return (
    <div className={classNames("empty-data-table__body")}>
      {icon}
      <div className="empty-data-table__body__content">
        <span className="content">{content}</span>
        <div className="d-flex">
          <div
            className={classNames(
              "empty-data-table__body__content__button m-r--2xs",
              disableButtonLeft ? "disable_button_icon" : ""
            )}
          >
            <Button
              icon={
                buttonIconLeft || (
                  <img src={AddIcon} alt="img" width={14} height={14} />
                )
              }
              iconPlace="left"
              type="secondary"
              onClick={onHandleClickAddLeft}
              disabled={disableButtonLeft}
            >
              {textButtonLeft}
            </Button>
          </div>
          <div
            className={classNames(
              "empty-data-table__body__content__button",
              disableButtonRight ? "disable_button_icon" : ""
            )}
          >
            <Button
              icon={
                buttonIconRight || (
                  <img src={AddIcon} alt="img" width={14} height={14} />
                )
              }
              iconPlace="left"
              type="tertiary"
              onClick={onHandleClickAddRight}
              disabled={disableButtonRight}
            >
              {textButtonRight}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyInitTable;
