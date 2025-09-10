/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import { Button } from "antd";
import React, { RefObject, MouseEventHandler } from "react";
import "./SignatureComponent.scss";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import classNames from "classnames";
import { TextMode } from "config/const";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  text?: string;
  mode: string;
  width: number;
  size?: number;
  height: number;
  positionTop: number;
  positionLeft: number;
  signatureType: number;
  handleMouseDown: MouseEventHandler<HTMLDivElement>;
  handleMouseUp: MouseEventHandler<HTMLDivElement>;
  handleMouseMove: MouseEventHandler<HTMLDivElement>;
  handleMouseOut: MouseEventHandler<HTMLDivElement>;
  deleteSignature: () => void;
  updateSignature: (object: Partial<RequestFormConfigurationContent>) => void;
  onClick: () => void;
}

export const SignatureComponent: React.FC<Props> = ({
  text,
  width,
  height,
  mode,
  positionTop,
  positionLeft,
  signatureType,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  deleteSignature,
  updateSignature,
  onClick,
}) => {
  const [size, setSize] = React.useState({ x: width, y: height });

  const handler = React.useCallback(
    (mouseDownEvent: any) => {
      const startSize = size;
      const startPosition = {
        x: mouseDownEvent.pageX,
        y: mouseDownEvent.pageY,
      };
      mouseDownEvent.stopPropagation();
      function onMouseMove(mouseMoveEvent: any) {
        mouseMoveEvent.stopPropagation();
        const widthValue = startSize.x - startPosition.x + mouseMoveEvent.pageX;
        const heightValue =
          startSize.y - startPosition.y + mouseMoveEvent.pageY;
        setSize(() => ({
          x: widthValue,
          y: heightValue,
        }));
        updateSignature({
          xCoordinate: positionLeft,
          yCoordinate: positionTop,
          width: widthValue,
          height: heightValue,
        });
      }
      function onMouseUp() {
        document.body.removeEventListener("mousemove", onMouseMove);
      }

      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseup", onMouseUp, { once: true });
    },
    [positionLeft, positionTop, size, updateSignature]
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      onClick={onClick}
      className={classNames("signature-box", {
        orange: signatureType === 2,
        critical: signatureType === 3,
      })}
      style={{
        cursor: mode === TextMode.COMMAND ? "move" : "default",
        top: positionTop,
        left: positionLeft,
        wordWrap: "break-word",
        padding: 0,
        position: "absolute",
        width: size.x,
        height: size.y,
      }}
      tabIndex={0}
    >
      <div className="signature-box__text" onMouseDown={() => false}>
        {text}
      </div>
      <Button
        type="primary"
        style={{}}
        className="signature-box__delete-button"
        size="small"
        onClick={deleteSignature}
      >
        X
      </Button>
      <Button
        type="primary"
        onMouseDown={handler}
        className="signature-box__resize-button"
        size="small"
      >
        <span className="glyphicon glyphicon-resize-full"></span>
      </Button>
    </div>
  );
};
