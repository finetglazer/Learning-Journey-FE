// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { fileEtx } from "config/const";
import {
  FileCSVIcon,
  FileDOCIcon,
  FileImageIcon,
  FileJPEGIcon,
  FileJSIcon,
  FileMoreIcon,
  FilePDFIcon,
  FilePNGIcon,
  FilePPTIcon,
  FileSVGIcon,
  FileTXTIcon,
  FileXLSIcon,
  FileZIPIcon,
} from "../../../../assets/icons";
import { isString, replace } from "lodash";
import {
  PURPOSE_OF_PURCHASE_TYPES,
  SHOPPING_PURPOSES,
} from "models/Payment/PaymentRequestConstant";

const getIcon = (file: FileModel) => {
  const extension = file?.name?.split(".")?.pop();
  switch (extension) {
    case fileEtx.CSV:
      return FileCSVIcon;
    case fileEtx.DOC:
    case fileEtx.DOCX:
      return FileDOCIcon;
    case fileEtx.JS:
      return FileJSIcon;
    case fileEtx.PNG:
      return FilePNGIcon;
    case fileEtx.JPG:
      return FileImageIcon;
    case fileEtx.JPEG:
      return FileJPEGIcon;
    case fileEtx.TXT:
      return FileTXTIcon;
    case fileEtx.XLS:
    case fileEtx.XLSX:
      return FileXLSIcon;
    case fileEtx.SVG:
      return FileSVGIcon;
    case fileEtx.PPT:
      return FilePPTIcon;
    case fileEtx.ZIP:
    case fileEtx.RAR:
      return FileZIPIcon;
    case fileEtx.PDF:
      return FilePDFIcon;
    default:
      return FileMoreIcon;
  }
};

const getFileNameFromUrl = (pathname: string): string => {
  if (!pathname) return "";
  return pathname.split("/").pop() || "";
};

const padMonth = (month: number): string => {
  return month?.toString()?.padStart(2, "0");
};

const convertToNumber = (str: string) => {
  if (isString(str)) {
    // Loại bỏ dấu chấm ngăn cách hàng nghìn
    const noThousandSeparators = replace(str, /\./g, "");
    // Thay dấu phẩy bằng dấu chấm
    const standardizedStr = replace(noThousandSeparators, /,/g, ".");
    // Chuyển chuỗi thành số
    return Number(standardizedStr);
  }
  return NaN; // Trả về NaN nếu đầu vào không phải chuỗi
};

const getPurposeOfPurchaseOptions = (id: number) => {
  if (id === undefined || id === null) {
    return PURPOSE_OF_PURCHASE_TYPES;
    // .filter(
    //   (item) => item.id !== SHOPPING_PURPOSES.ACCORDING_PROJECT
    // );
  }

  return PURPOSE_OF_PURCHASE_TYPES;
};

export {
  getIcon,
  padMonth,
  getFileNameFromUrl,
  convertToNumber,
  getPurposeOfPurchaseOptions,
};
