import React from "react";
import { Dimensions } from "../service-types";

export interface Pdf {
  file: File;
  pages: Promise<any>[];
}

export const usePdf = () => {
  const [dimensions, setDimensions] = React.useState<Dimensions>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [pages, setPages] = React.useState<any>([]);

  const setDimensionsHandler = React.useCallback(setDimensions, [
    setDimensions,
  ]);

  const initialize = React.useCallback(({ file, pages: _pages }: Pdf) => {
    setPages(_pages);
  }, []);

  return {
    dimensions,
    setDimensions: setDimensionsHandler,
    pages,
    initialize,
  };
};

export type ActionEvent<T> = React.TouchEvent<T> | React.MouseEvent<T>;
