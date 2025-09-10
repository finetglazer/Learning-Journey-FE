import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import BudgetOpinion from "components/OpinionBase/Budget";
import { TopicType } from "core/models/History";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEmpty, isUndefined } from "lodash";
import CommonFilter from "models/CommonFilter";
import { useContext } from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import {
  BudgetSettlementContext,
  BudgetSettlementCreate,
} from "../../BudgetSettlementCreateHook";
import { DEFAULT_PLACEHOLDER, settlementListType } from "../../constant";
import { AttachedFile } from "../AttachedFile/AttachedFile";
import { ContentDetail } from "../ContentDetail/ContentDetail";
import "./GeneralInformation.scss";

interface Profile {
  account: {
    email?: string;
    name?: string;
  };
  organization: {
    name?: string;
  };
}

export const GeneralInformation = () => {
  const {
    model,
    dispatchModel,
    handleDownloadFileAttached,
    handleChangeSingleField,
    handleChangeSelectField,
    handleUploadAttachmentError,
    processAfterFeedbackSubmission,
  } = useContext<BudgetSettlementCreate>(BudgetSettlementContext);
  const [translate] = useTranslation();

  const profile: Profile = useAppSelector((state) => state.profile);

  return (
    <div className="form-section">
      <div className="form-info">
        {/* Title */}
        <span className="form-title">
          {translate("BG.general_information")}
        </span>
        {/* Form body */}
        <form className="form-body">
          {/*  */}
          <div className="form-section__row">
            {/* Name field */}
            <div className="flex-2">
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  className="flex-2"
                  isRequired
                  isSmall={false}
                  label={translate("BG.txt_settlement_interpretaiton")}
                  placeHolder={translate("BG.txt_input_information")}
                  value={model.name}
                  onChange={handleChangeSingleField({
                    fieldName: "name",
                  })}
                />
              </FormItem>
            </div>
            {/* Auto generated code text input */}
            <InputText
              className="flex-1"
              isSmall={false}
              disabled
              label={translate("BG.auto_generated_code")}
              placeHolder={DEFAULT_PLACEHOLDER}
              value={model?.code}
            />
          </div>
          {/*  */}
          <div className="form-section__row">
            <div className="flex-2 form-section__row_2">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "budgetSettlementType"
                )}
              >
                <Select
                  isRequired
                  isSmall={false}
                  label={translate("BG.txt_settlement_type")}
                  placeHolder={translate("BG.txt_select_information")}
                  getList={settlementListType}
                  classFilter={CommonFilter}
                  value={model?.budgetSettlementTypeValue}
                  onChange={(id, value) => {
                    dispatchModel({
                      type: GeneralActionEnum.UPDATE,
                      payload: {
                        ...model,
                        budgetIds: [],
                      },
                    });
                    handleChangeSelectField({
                      fieldName: "budgetSettlementTypeValue",
                    })(id, value);
                  }}
                  disabled={!isEmpty(model.budgetIds)}
                />
              </FormItem>

              <InputText
                isSmall={false}
                disabled
                label={translate("BG.requester")}
                placeHolder={DEFAULT_PLACEHOLDER}
                value={`${profile.account?.email} - ${profile.account?.name}`}
              />
            </div>
            <InputText
              className="flex-1"
              disabled
              isSmall={false}
              label={translate("BG.requester_unit")}
              placeHolder={DEFAULT_PLACEHOLDER}
              value={
                !isEmpty(profile?.organization)
                  ? profile?.organization?.name
                  : DEFAULT_PLACEHOLDER
              }
            />
          </div>
        </form>
      </div>
      {/* Content detail */}
      <ContentDetail />
      {/* Attached file */}
      <AttachedFile
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleDownloadFileAttached={handleDownloadFileAttached}
        handleUploadAttachmentError={handleUploadAttachmentError}
      />

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
        <Comments topicType={TopicType.BudgetRequest} />
      ) : null}
    </div>
  );
};
