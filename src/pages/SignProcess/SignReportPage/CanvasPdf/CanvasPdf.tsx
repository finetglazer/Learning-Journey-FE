/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dimensions } from "core/services/service-types";
import React from "react";

interface Props {
  id: string;
  page: any;
  pageIndex: number;
  dimensions?: Dimensions;
  updateDimensions: ({ width, height }: Dimensions) => void;
  addText?: ({ xCoordinate, yCoordinate, pageIndex }: any) => void;
}

const CanvasPdf = ({
  id,
  page,
  dimensions,
  updateDimensions,
  addText,
  pageIndex,
}: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = React.useState(
    (dimensions && dimensions.width) || 0
  );
  const [height, setHeight] = React.useState(
    (dimensions && dimensions.height) || 0
  );

  const handleDrop = React.useCallback(
    (event: any) => {
      const dataTransfer = JSON.parse(
        event.dataTransfer.getData("dragPosition") || {}
      );
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      const dropPosition = {
        xCoordinate: event.clientX - canvasRect.left - 80,
        yCoordinate: event.clientY - canvasRect.top - 40,
        signatureType: dataTransfer.typeId || 1,
        pageIndex,
      };
      addText(dropPosition);
    },
    [addText, pageIndex]
  );

  React.useEffect(() => {
    const renderPage = async (p: Promise<any>) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);

        if (context) {
          await _page.render({
            canvasContext: canvasRef.current?.getContext("2d"),
            viewport,
          }).promise;

          const newDimensions = {
            width: viewport.width,
            height: viewport.height,
          };

          updateDimensions(newDimensions as Dimensions);
        }
      }
    };
    renderPage(page);
  }, [page, updateDimensions]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      width={width}
      height={height}
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()} // Add this line to allow onDrop to fire
    />
  );
};

export default CanvasPdf;
