import React from "react";
import { Dimensions, Pdf } from "../service-types";
import { externalAssetService } from "./external-asset-service";

interface PDF {
  numPages: number;
  getPage: (index: number) => Promise<any>;
}

export const pdfService = {
  async readAsPDF(fileBlob: Blob): Promise<PDF> {
    const pdfjsLib = await externalAssetService.getAsset("pdfjsLib");
    const url = window.URL.createObjectURL(fileBlob);
    return pdfjsLib.getDocument(url).promise;
  },

  usePdf() {
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

    const initialize = React.useCallback(({ pages: _pages }: Pdf) => {
      setPages(_pages);
    }, []);

    return {
      dimensions,
      setDimensions: setDimensionsHandler,
      pages,
      initialize,
    };
  },
};
