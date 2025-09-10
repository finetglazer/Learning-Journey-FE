import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import saveAs from "file-saver";
import { useCallback, useMemo, useRef } from "react";
import appMessageService from "core/services/common-services/app-message-service";
import { v4 as uuidv4 } from "uuid";
import { isArray, isEmpty, multiply } from "lodash";
import {
  EvaluationCriteriaType,
  EvaluationMethodType,
  EvaluationUserRoleEnum,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { Button } from "react-components-design-system";
import { Download, UploadDocumentIconRed } from "assets/icons";
import { useTranslation } from "react-i18next";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { ModelFilter } from "react-3layer-common";
import { useHistory } from "react-router";
import { PURCHASE_PLAN_ADJUST_BID_ROUTE } from "config/route-const";

type Props = {
  contextValue?: PurchasingPlanModel;
  columnKeyPassFail?: string;
  columnKeyScoring?: string;
  fieldName?: string;
  isDetail?: boolean;
  paramsDownload?: ModelFilter;
  evaluationMethod?: number;
};

const UploadDownloadFinancialCriteria = ({
  contextValue,
  isDetail = false,
  paramsDownload,
  evaluationMethod,
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
  const history = useHistory();

  const isAdjustBid = useMemo(() => {
    return history.location.pathname.includes(PURCHASE_PLAN_ADJUST_BID_ROUTE);
  }, [history.location.pathname]);

  const evaluationTeamUserIds = useMemo(() => {
    const dataEvaluationTeam = isAdjustBid
      ? model?.evaluationTeamDetails
      : model?.evaluationTeam;

    return isArray(dataEvaluationTeam)
      ? dataEvaluationTeam
          .filter((item) => {
            const roleId = Number(item?.role?.id);
            const allowedIds = [
              EvaluationUserRoleEnum.FinancialEvaluator,
              EvaluationUserRoleEnum.FinancialLeader,
            ];
            return allowedIds.includes(roleId);
          })
          .map((item) => item?.user?.id)
      : [];
  }, [isAdjustBid, model?.evaluationTeam, model?.evaluationTeamDetails]);

  const evaluationMethodType =
    evaluationMethod ?? EvaluationMethodType.FlagBased;

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
        formData.append("evaluationMethod", evaluationMethodType.toString());
        formData.append(
          "evaluationTeamUserIds",
          JSON.stringify(evaluationTeamUserIds)
        );

        purchasingPlanRepository
          .uploadFileTemplateEvaluation(formData)
          .subscribe({
            next: (response) => {
              const newData = [];
              if (!isEmpty(model?.evaluationFinancial)) {
                newData.push(model?.evaluationFinancial);
              }

              if (response) {
                newData.push(
                  response.map((item) => {
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
              }

              handleChangeSingleField({
                fieldName: "evaluationFinancial",
              })(newData.flatMap((item) => item));
            },
            error: (error: AxiosError) => {
              if (
                error.response &&
                error.response.status === 400 &&
                setErrorsModal
              )
                if (error.response?.data?.type === "Validate") {
                  handleChangeAllField({
                    ...convertDataToHaveIndexBeforeValidate(model, [], model),
                    errors: error.response?.data?.errors,
                    errorTabs: error.response?.data?.tabs,
                  });
                  setErrorsModal({
                    type: "SUBMIT_FAIL",
                    errors: error?.response?.data?.sheetErrors || [],
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
      evaluationMethodType,
      evaluationTeamUserIds,
      handleChangeAllField,
      handleChangeSingleField,
      model,
      notifyToast,
      setErrorsModal,
      translate,
    ]
  );

  const handleDownloadFileTemplateEvaluation = () => {
    const type = EvaluationCriteriaType.FinancialCriteria;

    purchasingPlanRepository
      .downloadFileTemplateEvaluation(
        paramsDownload,
        type,
        evaluationTeamUserIds,
        evaluationMethodType
      )
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
    <div className="d-flex justify-content-between align-items-center gap-3">
      <div className="btn-left">
        <Button
          icon={<img src={UploadDocumentIconRed} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onImportFileClick}
          disabled={isDetail}
        >
          {translate("PL.txt_upload_criteria")}
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
export default UploadDownloadFinancialCriteria;
