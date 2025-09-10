/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-unresolved */
import { Download } from "@carbon/icons-react";
import { Budget, Import } from "assets/icons";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import BudgetOpinion from "components/OpinionBase/Budget";
import { TopicType } from "core/models/History";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty, isEqual, isUndefined } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { ProjectTable } from "pages/BudgetPage/BudgetSettlementCreate/Components/ContentDetail/ProjectTable";
import { useContext, useEffect, useRef } from "react";
import {
  Button,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import { CreateBudget, CreateBudgetContext } from "../../BudgetCreateHook";
import AttachedFile from "../AttachedFile/AttachedFile";
import BudgetPlan from "../Budgetplan/Budgetplan";
import ProgressBar from "../ProgressBar/ProgressBar";
import "./GeneralInformation.scss";

const BUDGET_SETTLEMENT_TYPE = 3;
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
  } = useContext<CreateBudget>(CreateBudgetContext);

  const [translate] = useTranslation();
  const profile = useAppSelector((state) => state.profile);

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

  const _renderProjectTable = () => {
    if (
      isEqual(model?.type, BUDGET_SETTLEMENT_TYPE) &&
      !isEmpty(model?.budgets)
    ) {
      return (
        <div className="budget-table__wrapper">
          <div className="d-flex flex-row justify-content-between">
            <span className="form-title">
              {translate("BG.txt_content_detail")}
            </span>
            <span className="unit-text">{translate("BG.txt_unit")}</span>
          </div>
          <ProjectTable dataSource={model?.budgets} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="form-section">
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
                  label={translate(
                    isEqual(model.type, 3)
                      ? "BG.txt_settlement_interpretaiton"
                      : "BG.budget_plan_description"
                  )}
                  isRequired={!model.isDetail}
                  placeHolder={translate("BG.budget_plan_input")}
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
                  label={translate(
                    isEqual(model.type, 3)
                      ? "BG.txt_settlement_requirement_type"
                      : "BG.cost_owner_department"
                  )}
                  placeHolder={translate(
                    isEqual(model.type, 3)
                      ? "BG.txt_settlement_requirement_type"
                      : "BG.select_specialized_bank"
                  )}
                  isRequired={!model.isDetail}
                  searchProperty="name"
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch
                  getList={budgetRepository.costOwnerList}
                  onChange={handleChangeSelectField({
                    fieldName: "businessUnitId",
                  })}
                  isEnumerable={false}
                  render={(t) => {
                    if (isEqual(model.type, 3)) {
                      return t ? `${t.name}` : "";
                    }

                    return t ? `${t?.code} - ${t?.name}` : "";
                  }}
                  value={model.businessUnitId}
                  readOnly={model.isDetail}
                  disabled={
                    (!model.isDetail && !isEmpty(model.summary)) ||
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
      {_renderProjectTable()}
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
                      {translate("BG.select_cost_owner_department")} <br />
                      {translate("BG.next")}{" "}
                      <span className="content__import">
                        {translate("BG.import_budget_file")}
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

      {!isUndefined(model?.id) && (
        <ApprovalHistoryTable
          topicId={model?.id}
          type={TopicType.BudgetRequest}
          hasBorder={false}
          useCollapse={false}
          model={model}
        />
      )}

      {!isUndefined(model?.id) ? (
        <Comments topicType={TopicType.BudgetRequest} topicId={model?.id} />
      ) : null}
    </div>
  );
};

export default GeneralInformation;
