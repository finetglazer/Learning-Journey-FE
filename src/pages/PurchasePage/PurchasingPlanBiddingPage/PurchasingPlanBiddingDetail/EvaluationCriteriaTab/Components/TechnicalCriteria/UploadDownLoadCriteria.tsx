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
  EvaluationMethod,
  EvaluationUserRoleEnum,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { Button } from "react-components-design-system";
import { AddIcon, Download, UploadDocumentIconRed } from "assets/icons";
import { useTranslation } from "react-i18next";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { ModelFilter } from "react-3layer-common";
import classNames from "classnames";
import styles from "./TechnicalCriteria.module.scss";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import { EvaluationCriteria } from "models/EvaluationCriteria/EvaluationCriteria";
import { Col, Row } from "antd";
import { PURCHASE_PLAN_ADJUST_BID_ROUTE } from "config/route-const";
import { useHistory } from "react-router";

type Props = {
  contextValue: PurchasingPlanModel;
  columnKeyPassFail?: string;
  columnKeyScoring?: string;
  fieldName?: string;
  isDetail?: boolean;
  paramsDownload?: ModelFilter;
  isScore?: boolean;
};

const UploadDownLoadCriteria = ({
  contextValue,
  columnKeyPassFail = "evaluationPassFail",
  columnKeyScoring = "evaluationScore",
  fieldName = "evaluationPassFail",
  isDetail = false,
  paramsDownload,
  isScore = false,
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

  const handleAddNewScore = () => {
    const newEvaluationCriteria: EvaluationCriteria = {
      id: `${Date.now().toString()}${childText}`,
    };

    handleChangeSingleField({ fieldName: fieldName })([
      ...(model?.[fieldName] ?? []),
      newEvaluationCriteria,
    ]);
  };

  const evaluationTeamUserIds = useMemo(() => {
    const dataEvaluationTeam = isAdjustBid
      ? model?.evaluationTeamDetails
      : model?.evaluationTeam;

    return isArray(dataEvaluationTeam)
      ? dataEvaluationTeam
          .filter((item) => {
            const roleId = Number(item?.role?.id);
            const allowedIds = [
              EvaluationUserRoleEnum.TechnicalEvaluator,
              EvaluationUserRoleEnum.TechnicalLeader,
            ];
            return allowedIds.includes(roleId);
          })
          .map((item) => item?.user?.id)
      : [];
  }, [isAdjustBid, model?.evaluationTeam, model?.evaluationTeamDetails]);

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
        formData.append(
          "evaluationTeamUserIds",
          JSON.stringify(evaluationTeamUserIds)
        );

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
      columnKeyPassFail,
      columnKeyScoring,
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
    const type = EvaluationCriteriaType.TechnicalCriteria;

    purchasingPlanRepository
      .downloadFileTemplateEvaluation(
        paramsDownload,
        type,
        evaluationTeamUserIds
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
    <Row
      justify={!isEmpty(model?.[fieldName]) ? "space-between" : "start"}
      align="middle"
      className={classNames(
        !isEmpty(model?.[fieldName]) && styles["title-score"]
      )}
    >
      <Col>
        <div className={classNames(styles["btn-box"])}>
          {!isEmpty(model?.[fieldName]) && (
            <div className="btn-left">
              <Button
                icon={<img src={AddIcon} alt="img" width={14} height={14} />}
                iconPlace="left"
                type="secondary"
                className=""
                onClick={handleAddNewScore}
              >
                {translate("PL.txt_add_criteria")}
              </Button>
            </div>
          )}

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
      </Col>
      {model?.[fieldName]?.length > 0 && (
        <Col className={classNames(styles["evaluation-method"])}>
          <span className={styles["label"]}>
            {isScore
              ? `${translate("PL.txt_evaluation_method_")}`
              : `${translate("PL.txt_evaluation_method_")}`}
          </span>
          <span className={styles["value"]}>
            {isScore
              ? translate("PL.txt_scoring")
              : translate("PL.txt_pass_or_fail")}
          </span>
          {isScore && (
            <>
              <span className={classNames(styles["label"], styles["ic"])}>
                &nbsp; |&nbsp;
              </span>
              <span className={styles["label"]}>
                {translate("PL.txt_technical_weight")}&nbsp;
                <span className={styles["red"]}>*</span>
              </span>
            </>
          )}
        </Col>
      )}
    </Row>
  );
};
export default UploadDownLoadCriteria;
