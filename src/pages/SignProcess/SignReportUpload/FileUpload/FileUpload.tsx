import { BYTE } from "core/config/consts";
import { templateFormRepository } from "core/repositories/TemplateFormRepository";
import { ActionEvent } from "core/services/common-services/sign-report-service";
import { multiply } from "lodash";
import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import {
  SignProcessModalAction,
  SignProcessModalContext,
  SignProcessModalContextInt,
} from "pages/SignProcess/SignProcessMaster";
import React, { ReactElement } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { Observable } from "rxjs";
import UploadCreatorSignImage from "../components/UploadCreatorSignImage/UploadCreatorSignImage";
import "./FileUpload.scss";
export interface FileUploadProps {
  errorMessage?: string[];
  setErrorMessage?: (errorMessage: string[]) => void;
  model?: RequestFormConfiguration;
  dispatch?: React.Dispatch<SignProcessModalAction>;
  uploadFile?: (file: File | Blob, fileName?: string) => Observable<FileModel>;
}

export default function FileUpload(props: FileUploadProps): ReactElement {
  const { errorMessage, setErrorMessage, model, dispatch, uploadFile } = props;

  const { infoAttachmentAndCreatorSign, setInfoAttachmentAndCreatorSign } =
    React.useContext<SignProcessModalContextInt>(SignProcessModalContext);

  const [translate] = useTranslation();
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef: React.LegacyRef<HTMLInputElement> = React.useRef(null);
  const handleInputClick = React.useCallback(
    (event: ActionEvent<HTMLInputElement>) => {
      event.currentTarget.value = "";
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrag = React.useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleChangeInputFile = React.useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement> & {
        dataTransfer?: DataTransfer;
      },
      fromDrag = false
    ) => {
      const files =
        fromDrag === true
          ? event.dataTransfer.files
          : event.currentTarget.files;
      const file = files[0];

      const MAX_SIZE = 3 * multiply(BYTE, BYTE); // 2MB
      if (file.type !== "application/pdf")
        return setErrorMessage([translate("signReports.file_error.type")]);
      if (file.size > MAX_SIZE)
        return setErrorMessage([translate("signReports.file_error.size")]);

      uploadFile(file).subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (res: any) => {
          if (res) {
            dispatch({
              type: "UPDATE",
              payload: {
                attachment: res,
                signatureConfigurations: [],
              },
            });
            setErrorMessage([]);
            setInfoAttachmentAndCreatorSign({
              ...infoAttachmentAndCreatorSign,
              fileBlob: file,
              fileName: file.name,
              creatorSignAttachment: null,
            });
          }
        },
      });
    },
    [
      dispatch,
      infoAttachmentAndCreatorSign,
      setErrorMessage,
      setInfoAttachmentAndCreatorSign,
      translate,
      uploadFile,
    ]
  );

  const handleDrop = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      handleChangeInputFile(e, true);
      setDragActive(false);
    },
    [handleChangeInputFile]
  );

  const firstLoad = React.useRef(true);

  React.useEffect(() => {
    if (
      model?.attachment?.systemFileId &&
      !infoAttachmentAndCreatorSign?.fileBlob &&
      firstLoad.current
    ) {
      firstLoad.current = false;
      templateFormRepository
        .getFile(model?.attachment?.systemFileId as string)
        .subscribe({
          next: (res) => {
            if (res) {
              const file = new Blob([res.data], {
                type: "application/pdf",
              });

              setInfoAttachmentAndCreatorSign({
                ...infoAttachmentAndCreatorSign,
                fileBlob: file,
                fileName: model?.attachment?.name,
                creatorSignAttachment: null,
              });
            }
          },
        });
    }
  }, [
    infoAttachmentAndCreatorSign,
    model?.attachment?.name,
    model?.attachment?.systemFileId,
    setInfoAttachmentAndCreatorSign,
  ]);

  return (
    <div className="uploader-container form-upload__container w-100">
      <div className="form-upload__input">
        <div className="sign-report-uploader">
          <p className="sign-report-uploader__name">
            {translate("signReports.signReportUpload.report")}
          </p>
          <p className="sign-report-uploader__rule">
            {translate("signReports.signReportUpload.fileWarning")}
          </p>
        </div>
        <div>
          <form
            id="form-file-upload"
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              ref={inputRef}
              type="file"
              id="input-file-upload"
              onChange={handleChangeInputFile}
              onClick={handleInputClick}
              accept=".pdf"
            />
            <label
              id="label-file-upload"
              htmlFor="input-file-upload"
              className={dragActive ? "drag-active" : ""}
            >
              <div className="cursor-pointer">
                {model.attachment && model.attachment?.name ? (
                  <div style={{ textDecoration: "underline" }}>
                    {model.attachment?.name}
                  </div>
                ) : (
                  <>Drag and drop your file here or</>
                )}
              </div>
            </label>
            {dragActive && (
              <div
                id="drag-file-element"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )}
            <div className="w-100">
              {errorMessage &&
                errorMessage.length > 0 &&
                errorMessage.map((err) => (
                  <div className="mt-3 mb-3 pl-2 text-danger" key={err}>
                    {err}
                  </div>
                ))}
            </div>
          </form>
        </div>
      </div>

      <div>
        {!!infoAttachmentAndCreatorSign?.fileBlob && (
          <UploadCreatorSignImage
            pdfBlob={infoAttachmentAndCreatorSign?.fileBlob}
            creatorSignAttachment={
              infoAttachmentAndCreatorSign?.creatorSignAttachment
            }
            setCreatorSignAttachment={(attachment) => {
              setInfoAttachmentAndCreatorSign({
                ...infoAttachmentAndCreatorSign,
                creatorSignAttachment: attachment,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
