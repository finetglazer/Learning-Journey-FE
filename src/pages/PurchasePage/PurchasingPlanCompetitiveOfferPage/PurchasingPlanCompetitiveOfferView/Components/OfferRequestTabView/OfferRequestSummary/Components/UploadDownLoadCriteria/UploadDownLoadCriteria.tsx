import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import saveAs from "file-saver";
import { useCallback, useRef } from "react";
import appMessageService from "core/services/common-services/app-message-service";
import { v4 as uuidv4 } from "uuid";
import { isEmpty, multiply } from "lodash";
import { EvaluationMethod, PurchasingPlanModel } from "models/PurchasingPlan";
import { Button } from "react-components-design-system";
import { Download, UploadDocumentIconRed } from "assets/icons";
import { useTranslation } from "react-i18next";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { ModelFilter } from "react-3layer-common";

type Props = {
  contextValue: PurchasingPlanModel;
  columnKeyPassFail?: string;
  columnKeyScoring?: string;
  isDetail?: boolean;
  paramsDownload?: ModelFilter;
};

const UploadDownLoadCriteria = ({
  contextValue,
  columnKeyPassFail = "evaluationPassFail",
  columnKeyScoring = "evaluationScore",
  isDetail = false,
  paramsDownload,
}: Props) => {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSingleField,
    setErrorsModal,
    handleChangeAllField,
  } = contextValue;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      const MAX_FILE_LENGTH = 30; // Mb
      const BYTE_VALUE = 1024;
      const MEGABYTE = multiply(BYTE_VALUE, BYTE_VALUE);

      if (file && file.size > MAX_FILE_LENGTH * MEGABYTE) {
        notifyToast({
          message: translate("CM.input_file_size_validation", {
            maxSize: MAX_FILE_LENGTH,
          }),
          type: "error",
        });
        event.target.value = "";
      } else if (file) {
        const formData = new FormData();
        formData.append("file", file);

        purchasingPlanRepository
          .uploadFileTemplateEvaluation(formData)
          .subscribe({
            next: (response) => {
              const newDataPassFailByResponse = [];
              const newDataScoreByResponse = [];
              if (!isEmpty(model?.[columnKeyPassFail])) {
                newDataPassFailByResponse.push(model?.[columnKeyPassFail]);
              }

              if (!isEmpty(model?.[columnKeyScoring])) {
                newDataScoreByResponse.push(model?.[columnKeyScoring]);
              }

              if (response) {
                newDataPassFailByResponse.push(
                  response
                    .filter(
                      ({ evaluationMethod }) =>
                        evaluationMethod === EvaluationMethod.PassFail
                    )
                    .map((item) => {
                      const { id, evaluationUser, evaluationUserId, email } =
                        item;
                      return {
                        ...item,
                        id: id || uuidv4(),
                        email,
                        user: {
                          email,
                          code: email,
                          name: evaluationUser,
                          id: evaluationUserId,
                        },
                      };
                    })
                );

                newDataScoreByResponse.push(
                  response
                    .filter(
                      (item) =>
                        item.evaluationMethod === EvaluationMethod.Scoring
                    )
                    .map((item) => ({
                      ...item,
                      user: {
                        email: item.email,
                        code: item.email,
                        name: item.evaluationUser,
                        id: item.evaluationUserId,
                      },
                      email: item.email,
                      id: item.id || uuidv4(),
                    }))
                );
              }

              handleChangeSingleField({
                fieldName: columnKeyPassFail,
              })(newDataPassFailByResponse.flatMap((item) => item));

              handleChangeSingleField({
                fieldName: columnKeyScoring,
              })(newDataScoreByResponse.flatMap((item) => item));
            },
            error: (error: AxiosError) => {
              if (
                error.response &&
                error.response.status === 400 &&
                setErrorsModal
              )
                setErrorsModal({
                  type: "SUBMIT_FAIL",
                  errors: error?.response?.data?.sheetErrors || [],
                });

              if (error.response?.data?.type === "Validate") {
                handleChangeAllField({
                  ...convertDataToHaveIndexBeforeValidate(model, [], model),
                  errors: error.response?.data?.errors,
                  errorTabs: error.response?.data?.tabs,
                });
              } else {
                notifyToast({
                  message: error.response?.data?.message,
                  type: "error",
                });
              }
            },
          });
        event.target.value = "";
      }
    },
    [
      columnKeyPassFail,
      columnKeyScoring,
      handleChangeAllField,
      handleChangeSingleField,
      model,
      notifyToast,
      setErrorsModal,
      translate,
    ]
  );

  const handleDownloadFileTemplateEvaluation = () => {
    purchasingPlanRepository
      .downloadFileTemplateEvaluation(paramsDownload)
      .subscribe({
        next: (response: AxiosResponse<ArrayBuffer>) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(blob, "Template_Evaluation.xlsx");
        },
      });
  };

  const onImportFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="d-flex gap-12">
      <div className="btn-left">
        <Button
          icon={<img src={UploadDocumentIconRed} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onImportFileClick}
          disabled={isDetail}
        >
          {translate("BG.upload")}
        </Button>
      </div>

      <div className="btn-right">
        <Button
          type="tertiary"
          icon={<Download />}
          iconPlace="left"
          onClick={handleDownloadFileTemplateEvaluation}
          disabled={isDetail}
        >
          {translate("PL.txt_download_template")}
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".xls,.xlsx" // Chỉ cho phép chọn file Excel
      />
    </div>
  );
};
export default UploadDownLoadCriteria;
