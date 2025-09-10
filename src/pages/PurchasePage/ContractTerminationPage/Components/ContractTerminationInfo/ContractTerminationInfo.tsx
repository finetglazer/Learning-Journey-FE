import { UploadCloudIcon } from "assets/icons";
import classNames from "classnames";
import { EditorCM } from "components";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import Attachments from "components/Attachments/Attachments";
import { CollapseItem } from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { isEmpty, isUndefined } from "lodash";
import { useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContractTerminationDetailHookContext } from "../../ContractTerminationDetail/ContractTerminationDetailHook";
import ContactOrderInfo from "./ContactOrderInfo/ContactOrderInfo";
import styles from "./ContractTerminationInfo.module.scss";
import GenerationInfo from "./GenerationInfo/GenerationInfo";
import InsightBuy from "./InsightBuy/InsightBuy";
import PaymentValueContract from "./PaymentValueContract/PaymentValueContract";
import SellerServiceProviderInfo from "./SellerServiceProviderInfo/SellerServiceProviderInfo";

enum InformationSectionKey {
  GENERATION_INFORMATION = "GENERATION_INFORMATION",
  CONTRACT_INFORMATION = "CONTRACT_INFORMATION",
  CONTRACT_BUY_INFORMATION = "CONTRACT_BUY_INFORMATION",
  CONTRACT_SELL_INFORMATION = "CONTRACT_SELL_INFORMATION",
  CONTRACT_PAYMENT_VALUE = "CONTRACT_PAYMENT_VALUE",
  JOB_DESCRIPTION = "JOB_DESCRIPTION",
  GENERAL_TERMS = "GENERAL_TERMS",
  WARRANTY_TERMS = "WARRANTY_TERMS",
  ATTACHMENT = "ATTACHMENT",
}

const MAX_LENGTH = 1000;

const ContractTerminationInfo = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField, handleChangeListField } = useContext(
    ContractTerminationDetailHookContext
  );
  const isContract = !isEmpty(model?.contactOrderInfo?.contract?.id);
  const itemsCollapse = useMemo<CollapseItem[]>(
    () =>
      [
        {
          key: InformationSectionKey.GENERATION_INFORMATION,
          label: translate("CM.tab_general_information"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <GenerationInfo />
            </div>
          ),
        },
        {
          key: InformationSectionKey.CONTRACT_INFORMATION,
          label: translate("settlement.contact_order_information"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <ContactOrderInfo />
            </div>
          ),
        },
        isContract && {
          key: InformationSectionKey.CONTRACT_BUY_INFORMATION,
          label: translate("AC.txt_tab_buyer_service_info"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <InsightBuy />
            </div>
          ),
        },

        isContract && {
          key: InformationSectionKey.CONTRACT_SELL_INFORMATION,
          label: translate("AC.txt_tab_seller_service_info"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <SellerServiceProviderInfo />
            </div>
          ),
        },
        isContract && {
          key: InformationSectionKey.JOB_DESCRIPTION,
          label: (
            <div className="d-flex gap-1">
              <span>{translate("contractTermination.txt_task_content")}</span>
              <span className={styles["error"]}>*</span>
            </div>
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <EditorCM
                data={model?.taskContent}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeSingleField({
                    fieldName: "taskContent",
                  })(data);
                }}
                maxLength={MAX_LENGTH}
                isRequired={true}
                errorMess={model?.errors?.taskContent}
                placeholder={translate(
                  "contractTermination.placeHolder.enter_job_description"
                )}
                isCustomCss={true}
                isConvertFile
              />
            </div>
          ),
        },
        isContract && {
          key: InformationSectionKey.CONTRACT_PAYMENT_VALUE,
          label: translate("contractTermination.contract_value_and_payment"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <PaymentValueContract />
            </div>
          ),
        },
        isContract && {
          key: InformationSectionKey.GENERAL_TERMS,
          label: (
            <div className="d-flex gap-1">
              <span>{translate("contractTermination.general_terms")}</span>
              <span className={styles["error"]}>*</span>
            </div>
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <EditorCM
                data={model?.generalTerms}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeSingleField({
                    fieldName: "generalTerms",
                  })(data);
                }}
                maxLength={MAX_LENGTH}
                isRequired={true}
                errorMess={model?.errors?.generalTerms}
                placeholder={translate(
                  "contractTermination.placeHolder.enter_general_terms"
                )}
                isCustomCss={true}
                isConvertFile
              />
            </div>
          ),
        },
        isContract && {
          key: InformationSectionKey.WARRANTY_TERMS,
          label: translate("contractTermination.warranty_terms"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <EditorCM
                data={model?.warrantyTerms}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  handleChangeSingleField({
                    fieldName: "warrantyTerms",
                  })(data);
                }}
                maxLength={MAX_LENGTH}
                isRequired={false}
                errorMess={model?.errors?.warrantyTerms}
                placeholder={translate(
                  "contractTermination.placeHolder.enter_warranty_terms"
                )}
                isCustomCss={true}
                isConvertFile
              />
            </div>
          ),
        },
      ].filter(Boolean),
    [translate, model?.contactOrderInfo?.contract?.id, model?.errors]
  );

  const renderCommentSection = useCallback(
    () =>
      isUndefined(model?.idDetail) ? null : (
        <div className="px-3 pb-1">
          <Comments
            isNewLayoutVersion
            topicType={TOPIC_TYPE.CONTRACT_LIQUIDATION}
            topicId={model?.idDetail}
          />
        </div>
      ),
    [model?.idDetail]
  );

  return (
    <div className={styles["collapse--title_custom"]}>
      <AdvancedCollapseView
        items={[
          ...itemsCollapse,
          {
            key: InformationSectionKey.ATTACHMENT,
            label: translate("CM.txt_attachment_files"),
            children: (
              <Attachments
                isDetail={model?.isDetail}
                parentClassName={styles["bg-neutral-1"]}
                uploadIcon={UploadCloudIcon}
                attachments={model?.attachments}
                handleUpdate={handleChangeListField({
                  fieldName: "attachments",
                })}
              />
            ),
          },
        ]}
        showAll={false}
        defaultActiveKey={[
          InformationSectionKey.GENERATION_INFORMATION,
          InformationSectionKey.CONTRACT_INFORMATION,
          InformationSectionKey.CONTRACT_BUY_INFORMATION,
          InformationSectionKey.CONTRACT_SELL_INFORMATION,
          InformationSectionKey.CONTRACT_PAYMENT_VALUE,
          InformationSectionKey.JOB_DESCRIPTION,
          InformationSectionKey.GENERAL_TERMS,
          InformationSectionKey.WARRANTY_TERMS,
          InformationSectionKey.ATTACHMENT,
        ]}
      />

      {renderCommentSection()}
    </div>
  );
};

export default ContractTerminationInfo;
