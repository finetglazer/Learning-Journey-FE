/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { FileTemplate } from "core/models/FileTemplate";
import saveAs from "file-saver";
import { FileTemplateInput } from "models/FileTemplate";
import { InfoAttachmentAndCreatorSign } from "models/RequestFormConfiguration";
import type { MenuInfo } from "rc-menu/lib/interface";
import React from "react";
import { useTranslation } from "react-i18next";
import { finalize, Observable } from "rxjs";
import { FileTemplateParams } from "./FileTemplate";
import { checkIdValid } from "core/helpers/common";

enum FILE_TEMPLATE_ENUM {
  UPDATE_ALL_FILE_TEMPLATE,
  UPDATE_SINGLE,
  UPDATE_LIST,
  LOAD_FILE,
  UPDATE_FILE_URL,
}

interface FileTemplateState {
  fileTemplates?: FileTemplate[];
  currentfileTemplate?: FileTemplate;
  pdfBlobUrl?: string;
  currentFile?: Blob;
}

interface FileTemplateAction {
  type: FILE_TEMPLATE_ENUM;
  data: FileTemplateState;
}

function fileTemplateReducer(
  state: FileTemplateState,
  action: FileTemplateAction
): FileTemplateState {
  switch (action.type) {
    case FILE_TEMPLATE_ENUM.UPDATE_ALL_FILE_TEMPLATE:
      return {
        fileTemplates: [...action.data.fileTemplates],
        currentfileTemplate: { ...action.data.currentfileTemplate },
        pdfBlobUrl: action.data.pdfBlobUrl,
      };
    case FILE_TEMPLATE_ENUM.UPDATE_LIST:
      return {
        ...state,
        fileTemplates: [...action.data.fileTemplates],
      };
    case FILE_TEMPLATE_ENUM.UPDATE_SINGLE:
      return {
        ...state,
        currentfileTemplate: { ...action.data.currentfileTemplate },
      };
    case FILE_TEMPLATE_ENUM.LOAD_FILE:
      return {
        ...state,
        pdfBlobUrl: action.data.pdfBlobUrl,
        currentFile: action.data.currentFile,
      };
    case FILE_TEMPLATE_ENUM.UPDATE_FILE_URL:
      return {
        ...state,
        pdfBlobUrl: action.data.pdfBlobUrl,
        currentFile: action.data.currentFile,
        currentfileTemplate: { ...action.data.currentfileTemplate },
      };
    default:
      return { ...state };
  }
}

export default function useFileTemplateHook(
  getListFileTemplates: (id: string) => Observable<FileTemplate[]>,
  previewFileTemplate: (
    params: FileTemplateParams
  ) => Observable<AxiosResponse>,
  downloadFileTemplatePdf: (
    params: FileTemplateParams
  ) => Observable<AxiosResponse>,
  downloadFileTemplateOriginal: (
    params: FileTemplateParams
  ) => Observable<AxiosResponse>,
  requestId?: string,
  fileTemplate?: FileTemplate,
  infoAttachmentAndCreatorSign?: InfoAttachmentAndCreatorSign,
  setInfoAttachmentAndCreatorSign?: React.Dispatch<InfoAttachmentAndCreatorSign>
) {
  const [translate] = useTranslation();
  const [loadingPdf, setLoadingPdf] = React.useState(false);
  const [defaultFileTemplate] = React.useState(fileTemplate);

  const [
    { fileTemplates, currentfileTemplate, pdfBlobUrl, currentFile },
    dispatchFileTemplate,
  ] = React.useReducer(fileTemplateReducer, {
    fileTemplates: [],
    currentfileTemplate: new FileTemplate(),
    pdfBlobUrl: "",
    currentFile: null,
  });

  const handlePreviewFileTemplate = React.useCallback(() => {
    const template = { ...currentfileTemplate };
    const queryParams = requestId ? requestId : undefined;
    const inputs: any = {};
    template?.templateInputs?.forEach((input: FileTemplateInput) => {
      inputs[input.code] = input.value;
    });
    setLoadingPdf(true);
    previewFileTemplate({
      queryParams,
      template,
      inputs,
    })
      .pipe(finalize(() => setLoadingPdf(false)))
      .subscribe({
        next: (response: AxiosResponse<Blob>) => {
          const file = new Blob([response.data], {
            type: "application/pdf",
          });
          const fileURL = URL.createObjectURL(file);
          dispatchFileTemplate({
            type: FILE_TEMPLATE_ENUM.LOAD_FILE,
            data: {
              pdfBlobUrl: fileURL,
              currentFile: file,
            },
          });
        },
      });
  }, [currentfileTemplate, requestId, previewFileTemplate]);

  const handleDownloadFileTemplate = React.useCallback(() => {
    const template = { ...currentfileTemplate };
    const queryParams = requestId ? requestId : undefined;
    downloadFileTemplatePdf({
      template,
      queryParams,
    }).subscribe({
      next: (response: AxiosResponse) => {
        const fileName = response.headers["content-disposition"]
          .split(";")
          .find((n: string) => n.includes("filename="))
          .replace("filename=", "")
          .replace(/"/gi, "")
          .trim();
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/octet-stream",
          })
        );
        saveAs(url, fileName);
      },
    });
  }, [currentfileTemplate, requestId, downloadFileTemplatePdf]);

  const handleDownloadFileTemplateOriginal = React.useCallback(() => {
    const template = { ...currentfileTemplate };
    const queryParams = requestId ? requestId : undefined;
    downloadFileTemplateOriginal({
      template,
      queryParams,
    }).subscribe({
      next: (response: AxiosResponse) => {
        const fileName = response.headers["content-disposition"]
          .split(";")
          .find((n: string) => n.includes("filename="))
          .replace("filename=", "")
          .replace(/"/gi, "")
          .trim();
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/octet-stream",
          })
        );
        saveAs(url, fileName);
      },
    });
  }, [currentfileTemplate, requestId, downloadFileTemplateOriginal]);

  const handleChangeFileTemplateInputValue = React.useCallback(
    (index: number) => (value: string) => {
      const fileTemplate = { ...currentfileTemplate };
      fileTemplate.templateInputs[index].value = value;
      dispatchFileTemplate({
        type: FILE_TEMPLATE_ENUM.UPDATE_SINGLE,
        data: {
          currentfileTemplate: fileTemplate,
        },
      });
    },
    [currentfileTemplate]
  );

  const handleChangeFileTemplateName = React.useCallback(
    (value: string) => {
      const fileTemplate = { ...currentfileTemplate };
      fileTemplate.name = value;
      dispatchFileTemplate({
        type: FILE_TEMPLATE_ENUM.UPDATE_SINGLE,
        data: {
          currentfileTemplate: fileTemplate,
        },
      });
    },
    [currentfileTemplate]
  );

  const handleChangeFileTemplate = React.useCallback(
    (event: MenuInfo) => {
      const fileTemplateId = event.key;
      const template = fileTemplates.filter(
        (fileTemplate: FileTemplate) => fileTemplate.id === fileTemplateId
      )[0];
      setLoadingPdf(true);
      const queryParams = requestId ? requestId : undefined;
      previewFileTemplate({
        queryParams,
        template,
      })
        .pipe(finalize(() => setLoadingPdf(false)))
        .subscribe({
          next: (response: AxiosResponse) => {
            const file = new Blob([response.data], {
              type: "application/pdf",
            });
            const fileURL = URL.createObjectURL(file);
            dispatchFileTemplate({
              type: FILE_TEMPLATE_ENUM.UPDATE_FILE_URL,
              data: {
                currentfileTemplate: template,
                pdfBlobUrl: fileURL,
                currentFile: file,
              },
            });
            const fileName = response.headers["content-disposition"]
              .split(";")
              .find((n: string) => n.includes("filename="))
              .replace("filename=", "")
              .replace(/"/gi, "")
              .trim();
            setInfoAttachmentAndCreatorSign({
              ...infoAttachmentAndCreatorSign,
              fileBlob: file,
              fileName: fileName,
              fileTemplate: template,
            });
          },
        });
    },
    [
      fileTemplates,
      requestId,
      previewFileTemplate,
      setInfoAttachmentAndCreatorSign,
      infoAttachmentAndCreatorSign,
    ]
  );

  const firstLoad = React.useRef(true);

  React.useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;

      // check xem có đúng gọi default template không\
      const isDefaultTemplate = checkIdValid(defaultFileTemplate?.id);
      getListFileTemplates(requestId).subscribe({
        next: (res: FileTemplate[]) => {
          if (res && res.length > 0) {
            const fileTemplates = res;

            // nếu có default template thì gọi default, nếu không đúng default thì gọi template đầu tiên
            const currentfileTemplate = checkIdValid(defaultFileTemplate?.id)
              ? defaultFileTemplate
              : res[0];
            setLoadingPdf(true);
            dispatchFileTemplate({
              type: FILE_TEMPLATE_ENUM.UPDATE_ALL_FILE_TEMPLATE,
              data: {
                fileTemplates,
                currentfileTemplate,
              },
            });
            previewFileTemplate({
              queryParams: requestId,
              template: currentfileTemplate,
            })
              .pipe(finalize(() => setLoadingPdf(false)))
              .subscribe({
                next: (response: AxiosResponse) => {
                  const file = new Blob([response.data], {
                    type: "application/pdf",
                  });
                  const fileURL = URL.createObjectURL(file);
                  const fileName = response.headers["content-disposition"]
                    .split(";")
                    .find((n: string) => n.includes("filename="))
                    .replace("filename=", "")
                    .replace(/"/gi, "")
                    .trim();
                  dispatchFileTemplate({
                    type: FILE_TEMPLATE_ENUM.LOAD_FILE,
                    data: {
                      pdfBlobUrl: fileURL,
                      currentFile: file,
                    },
                  });
                  setInfoAttachmentAndCreatorSign({
                    ...infoAttachmentAndCreatorSign,
                    fileBlob: file,
                    fileName: fileName,
                    fileTemplate: currentfileTemplate,
                  });
                },
                error: () => {
                  // đoạn này retry lại với template khác
                  // nếu có default template thì tức lần đầu gọi default, lần này gọi template 1 trong list, nếu không đúng default thì gọi template số 2 vì lần đầu gọi template đầu tiên
                  const currentfileTemplate = isDefaultTemplate
                    ? res[0]
                    : res[1];
                  setLoadingPdf(true);
                  dispatchFileTemplate({
                    type: FILE_TEMPLATE_ENUM.UPDATE_ALL_FILE_TEMPLATE,
                    data: {
                      fileTemplates,
                      currentfileTemplate,
                    },
                  });
                  previewFileTemplate({
                    queryParams: requestId,
                    template: currentfileTemplate,
                  })
                    .pipe(finalize(() => setLoadingPdf(false)))
                    .subscribe({
                      next: (response: AxiosResponse) => {
                        const file = new Blob([response.data], {
                          type: "application/pdf",
                        });
                        const fileURL = URL.createObjectURL(file);
                        const fileName = response.headers["content-disposition"]
                          .split(";")
                          .find((n: string) => n.includes("filename="))
                          .replace("filename=", "")
                          .replace(/"/gi, "")
                          .trim();
                        dispatchFileTemplate({
                          type: FILE_TEMPLATE_ENUM.LOAD_FILE,
                          data: {
                            pdfBlobUrl: fileURL,
                            currentFile: file,
                          },
                        });
                        setInfoAttachmentAndCreatorSign({
                          ...infoAttachmentAndCreatorSign,
                          fileBlob: file,
                          fileName: fileName,
                          fileTemplate: currentfileTemplate,
                        });
                      },
                    });
                },
              });
          }
        },
      });
    }
  }, [
    requestId,
    defaultFileTemplate,
    getListFileTemplates,
    previewFileTemplate,
    setInfoAttachmentAndCreatorSign,
    infoAttachmentAndCreatorSign,
  ]);

  React.useEffect(() => {
    if (currentfileTemplate) {
      setInfoAttachmentAndCreatorSign((prev: InfoAttachmentAndCreatorSign) => ({
        ...prev,
        fileTemplate: currentfileTemplate,
      }));
    }
  }, [currentfileTemplate, setInfoAttachmentAndCreatorSign]);

  return {
    currentfileTemplate,
    fileTemplates,
    pdfBlobUrl,
    loadingPdf,
    translate,
    currentFile,
    handleChangeFileTemplateInputValue,
    handleChangeFileTemplateName,
    handleChangeFileTemplate,
    handlePreviewFileTemplate,
    handleDownloadFileTemplate,
    handleDownloadFileTemplateOriginal,
  };
}
