import classNames from "classnames";
import { UploadFile } from "react-components-design-system";
import appMessageService from "core/services/common-services/app-message-service";
import { Observable } from "rxjs";
import { t } from "i18next";
import { UploadIcon } from "assets/icons";

import { FileModelExtend } from "models/OpinionCollector";
import {
  MAXIMUM_SIZE,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  MB,
  TYPE_DEFAULT,
  UploadProps,
  delay,
} from "./helper";

import "./UploadFileCustom.scss";
import React from "react";
import { UploadErrorModal } from "./UploadErrorModal/UploadErrorModal";
import { HttpStatusCode } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";

const UploadFileCustom = ({
  className,
  maxFileSize = MAX_FILE_SIZE,
  maxTotalSize = MAX_TOTAL_SIZE,
  setListFileLoading,
  icon,
  type = TYPE_DEFAULT,
  uploadFile,
  onUploadError,
  ...props
}: UploadProps) => {
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [errors, setErrors] = React.useState<any>(null);
  const handleCloseErrorModal = () => {
    setOpenErrorModal(false);
  };

  const handleErrorUpload = (errors: any) => {
    if (isEqual(errors?.response?.status, HttpStatusCode?.BAD_REQUEST)) {
      setErrors(errors?.response?.data?.errors);
      setOpenErrorModal(true);
    } else {
      onUploadError(errors);
    }
  };

  const handleUpload = (
    files: File[] | Blob[]
  ): Observable<FileModelExtend[]> => {
    const { totalSize, hasLargeFile } = Array.from(files).reduce(
      (acc, file) => {
        acc.totalSize += file.size;
        if (file.size > maxFileSize * MB) {
          acc.hasLargeFile = true;
        }
        return acc;
      },
      { totalSize: 0, hasLargeFile: false }
    );

    if (hasLargeFile || totalSize > maxTotalSize * MB) {
      setListFileLoading && setListFileLoading([]);
      if (hasLargeFile) {
        notifyToast({
          message: t("CM.input_file_size_validation", { maxSize: maxFileSize }),
          type: "error",
        });
      }

      if (totalSize > maxTotalSize * MB && files?.length > 1) {
        delay(200).then(() => {
          notifyToast({
            message: t("CM.message_error_total_file_size_upload", {
              maxSize: maxTotalSize,
            }),
            type: "error",
          });
        });
      }

      return;
    }

    return uploadFile(files);
  };

  return (
    <div className={classNames("upload-file-custom__container", className)}>
      <UploadFile
        uploadFile={handleUpload}
        className={classNames("budget-upload-content-file")}
        setListFileLoading={setListFileLoading}
        icon={icon || <img src={UploadIcon} alt="img" />}
        maximumSize={MAXIMUM_SIZE}
        type={type}
        onUploadError={handleErrorUpload}
        {...props}
      ></UploadFile>

      {openErrorModal && !isEmpty(errors) && (
        <UploadErrorModal
          isOpen={openErrorModal}
          handleCancel={() => handleCloseErrorModal()}
          errors={errors}
        />
      )}
    </div>
  );
};

export default UploadFileCustom;
