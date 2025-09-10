/* eslint-disable import/no-unresolved */
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
} from "assets/icons";
import { fileEtx } from "config/const";
import { STRING_NA } from "core/config/consts";
import * as CryptoJS from "crypto-js";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

const Key = {
  AES_KEY: "FPT@!@#123456789",
};
const iv = CryptoJS.enc.Base64.parse("ivACSyi343fef&^%$A");
const key = CryptoJS.SHA256(Key.AES_KEY);

export const getIconFile = (file: FileModel) => {
  const extension = file?.name?.split(".")?.pop();
  switch (extension?.toLowerCase()) {
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
    case fileEtx.XLSM:
      return FileXLSIcon;
    case fileEtx.SVG:
      return FileSVGIcon;
    case fileEtx.PPT:
    case fileEtx.PPTX:
      return FilePPTIcon;
    case fileEtx.PDF:
      return FilePDFIcon;
    case fileEtx.ZIP:
    case fileEtx.RAR:
      return FileZIPIcon;
    default:
      return FileMoreIcon;
  }
};

export const AESencrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};

export const AESdecrypt = (encrypted: string) => {
  if (!encrypted) return "";
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const fakeProgress = (
  seconds: number,
  setProgress: (value: number) => void
) => {
  const intervalTime = 100; // Cập nhật mỗi 100ms
  const totalIntervals = (seconds * 1000) / intervalTime;
  let currentInterval = 0;

  const interval = setInterval(() => {
    currentInterval += 1;
    const newProgress = Math.round(
      Math.min((currentInterval / totalIntervals) * 100, 99)
    );
    setProgress(newProgress);

    if (newProgress >= 100) {
      clearInterval(interval);
    }
  }, intervalTime);
};

export const getValueOrDefault = (value: any): string => {
  return value == null ? STRING_NA : value;
};

export const checkIdValid = (id: string): boolean => {
  const isOnlyZeroAndDash = !id || /^[0-]+$/.test(id);
  return !isOnlyZeroAndDash;
};
