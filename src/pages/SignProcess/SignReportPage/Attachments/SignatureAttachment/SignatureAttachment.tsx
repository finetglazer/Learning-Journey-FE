import React, { useState, useRef } from "react";
import { SignatureComponent } from "./SignatureComponent/SignatureComponent";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { utilService } from "core/services/common-services/util-service";
import { DragActions, TextMode } from "config/const";

interface Props {
  signatureType?: number;
  xCoordinate?: number;
  yCoordinate?: number;
  text?: string;
  width?: number;
  height?: number;
  pageWidth: number;
  pageHeight: number;
  updateTextAttachment: (
    object: Partial<RequestFormConfigurationContent>
  ) => void;
  getAttachment: () => void;
  removeSignature: () => void;
}

export const SignatureAttachment = ({
  signatureType,
  xCoordinate,
  yCoordinate,
  text,
  width,
  height,
  pageHeight,
  pageWidth,
  removeSignature,
  updateTextAttachment,
  getAttachment,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(yCoordinate);
  const [positionLeft, setPositionLeft] = useState(xCoordinate);
  const [operation, setOperation] = useState<DragActions>(
    DragActions.NO_MOVEMENT
  );
  const [textMode] = useState<TextMode>(TextMode.COMMAND);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (mouseDown) {
      const { top, left } = utilService.getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );
      setPositionTop(top);
      setPositionLeft(left);
    }
  };

  const handleMousedown = () => {
    if (textMode !== TextMode.COMMAND) {
      return;
    }
    setMouseDown(true);
    setOperation(DragActions.MOVE);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (textMode !== TextMode.COMMAND) {
      return;
    }
    setMouseDown(false);
    if (operation === DragActions.MOVE) {
      const { top, left } = utilService.getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );
      updateTextAttachment({
        xCoordinate: left,
        yCoordinate: top,
        width: width,
        height: height,
      });
    }
    setOperation(DragActions.NO_MOVEMENT);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    if (operation === DragActions.MOVE) {
      handleMouseUp(event);
    }
  };

  const deleteSignature = () => {
    removeSignature();
  };

  const onClick = () => {
    getAttachment();
  };

  return (
    <SignatureComponent
      signatureType={signatureType}
      text={text}
      width={width}
      height={height}
      mode={textMode}
      inputRef={inputRef}
      onClick={onClick}
      positionTop={positionTop}
      positionLeft={positionLeft}
      handleMouseUp={handleMouseUp}
      handleMouseOut={handleMouseOut}
      handleMouseDown={handleMousedown}
      handleMouseMove={handleMouseMove}
      deleteSignature={deleteSignature}
      updateSignature={updateTextAttachment}
    />
  );
};
