/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-unresolved */
import { Download } from "@carbon/icons-react";
import { Budget, Import } from "assets/icons";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import BudgetOpinion from "components/OpinionBase/Budget";
import { LIST_TYPE_BUDGET_ADJUST } from "config/const";
import { TopicType } from "core/models/History";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty, isUndefined } from "lodash";
import { useContext, useEffect, useRef } from "react";
import {
  Button,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useAppSelector } from "rtk/useRedux";
import { of } from "rxjs";
import { BudgetAdjust, BudgetAdjustContext } from "../../BudgetAdjustHook";
import AttachedFile from "../AttachedFile/AttachedFile";
import BudgetPlan from "../Budgetplan/Budgetplan";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./GeneralInformation.scss";

interface Params {
  id: string;
}

interface Params {
  id: string;
}

const GeneralInformation = () => {
  const {
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleFileChange,
    handleDownloadFileTemplate,
    handleCancelUploadFileBudget,
    handleChangeAllField,
    processAfterFeedbackSubmission,
  } = useContext<BudgetAdjust>(BudgetAdjustContext);
  const [translate] = useTranslation();

  const profile = useAppSelector((state) => state.profile);
  const { id } = useParams<Params>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!model.isDetail) {
      handleChangeAllField({
        ...model,
        organization: profile.organization,
        user: profile?.account,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.isDetail, profile]);

  const onImportFile = () => {
    fileInputRef.current?.click();
  };

  const getListType = () => {
    return of(LIST_TYPE_BUDGET_ADJUST);
  };

  const getValueAdjust = () => {
    return LIST_TYPE_BUDGET_ADJUST.find((item) => item.id === model.type);
  };

  return (
    <div className="form-section-adjust">
      <div className="form-info">
        <span className="form-title">
          {translate("BG.general_information")}
        </span>
        <form className="form-body">
          <div className="form-section__row">
            <div className="flex-2">
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  label={translate("BG.budget_adjustment_description")}
                  isRequired={!model.isDetail}
                  placeHolder={translate("BG.input_information")}
                  isSmall={false}
                  className="flex-2"
                  onChange={handleChangeSingleField({
                    fieldName: "name",
                  })}
                  value={model.name}
                  readOnly={model.isDetail}
                />
              </FormItem>
            </div>
            <InputText
              label={translate("BG.auto_generated_code")}
              placeHolder="---"
              disabled={!model.isDetail}
              readOnly={model.isDetail}
              className="flex-1"
              value={model.code || "---"}
              isSmall={false}
            />
          </div>
          <div className="form-section__row">
            <div className="flex-2 form-section__row_2">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "businessUnitId"
                )}
              >
                <Select
                  label={translate("BG.budget_adjustment_type")}
                  placeHolder={translate("BG.select_information")}
                  isRequired={!model.isDetail}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch={false}
                  getList={getListType}
                  onChange={handleChangeSelectField({
                    fieldName: "businessUnitId",
                  })}
                  value={
                    model.isDetail ? getValueAdjust() : model.businessUnitId
                  }
                  readOnly={model.isDetail}
                  disabled={
                    (!model.isDetail && !!model.summary) ||
                    model.loadingFileBudget
                  }
                />
              </FormItem>

              <InputText
                label={translate("BG.requester")}
                placeHolder="---"
                disabled={!model.isDetail}
                isSmall={false}
                value={
                  model?.user
                    ? `${model?.user?.email} - ${model?.user?.name}`
                    : "---"
                }
                readOnly={model.isDetail}
              />
            </div>

            <InputText
              label={translate("BG.requester_unit")}
              placeHolder="---"
              disabled={!model.isDetail}
              isSmall={false}
              readOnly={model.isDetail}
              className="flex-1"
              value={
                !isEmpty(model?.organization)
                  ? model?.organization?.name
                  : "---"
              }
            />
          </div>
        </form>
      </div>
      {model.isDetail && !model.summary?.length ? null : (
        <div className="budget-plan">
          <div className="budget-plan__header">
            <span className="form-title">{translate("BG.budget_plan")}</span>
            <div className="form-subtitle">
              {translate("BG.unit_in_million_vnd")}
            </div>
          </div>
          {isEmpty(model?.summary) &&
          isEmpty(model?.fileInfo?.path) &&
          isEmpty(model?.fileInfo?.name) ? (
            <div className="budget-plan__body">
              {model?.loadingFileBudget ? (
                <ProgressBar onClickCancel={handleCancelUploadFileBudget} />
              ) : (
                <>
                  <Budget />
                  <div className="budget-plan__body__content">
                    <span className="content">
                      {translate("BG.please_select")}{" "}
                      <span className="content__import">
                        {translate("BG.budget_adjustment_import_file")}
                      </span>{" "}
                      <br />
                      {translate("BG.add_information")}
                    </span>
                    <div className="budget-plan__body__content__button">
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept=".xls,.xlsx" // Chỉ cho phép chọn file Excel
                      />
                      <Button
                        disabled={!model.businessUnitId}
                        icon={<Import />}
                        iconPlace="left"
                        type="secondary"
                        onClick={onImportFile}
                      >
                        {translate("BG.import_budget_file")}
                      </Button>
                      <Button
                        type="tertiary"
                        icon={<Download />}
                        iconPlace="left"
                        onClick={handleDownloadFileTemplate}
                      >
                        {translate("BG.download_template_file")}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <BudgetPlan data={model?.summary} />
          )}
        </div>
      )}

      <AttachedFile />

      <BudgetOpinion
        isVisiable={isUndefined(model?.status)}
        topicId={model?.id}
        type={model?.type}
        status={model?.status}
        processAfterFeedbackSubmission={processAfterFeedbackSubmission}
      />

      <ApprovalHistoryTable
        topicId={model?.id}
        type={TopicType.AdjustBudget}
        hasBorder={false}
        useCollapse={false}
        model={model}
      />
      {!isEmpty(id) ? <Comments topicType={TopicType.AdjustBudget} /> : null}
    </div>
  );
};

export default GeneralInformation;
