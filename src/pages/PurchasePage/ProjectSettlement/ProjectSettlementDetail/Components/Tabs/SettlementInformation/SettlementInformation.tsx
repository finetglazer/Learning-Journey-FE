import Attachments from "components/Attachments/Attachments";
import CollapseView from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { MAX_LENGTH_1000 } from "core/config/consts";
import { TopicType } from "core/models/History";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import { TabKey } from "pages/PurchasePage/Acceptance/Components/constant";
import ContractsCompleted from "pages/PurchasePage/ProjectSettlement/Components/ContractsCompleted/ContractsCompleted";
import DebtPaymentInformation from "pages/PurchasePage/ProjectSettlement/Components/DebtPaymentInformation/DebtPaymentInformation";
import { useMemo } from "react";
import { FormItem, TextArea } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../../../../../ProjectSettlement/ProjectSettlementPage.module.scss";
import { useProjectSettlementDetailContext } from "../../../context";
import { SettlementInformationComponents } from "../../SettlementInformationComponents";

const SettlementInformation = () => {
  const [translate] = useTranslation();
  const { model, state, handleChangeSingleField, handleChangeListField } =
    useProjectSettlementDetailContext();

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.DESCRIPTION,
        label: translate("CM.tab_general_information"),
        children: <SettlementInformationComponents.GeneralInformation />,
      },
      {
        key: TabKey.CONCLUSION,
        label: translate("PS.txt_project_settlement_information"),
        children: <SettlementInformationComponents.ProjectFinalization />,
      },
      {
        key: TabKey.SELLER,
        label: translate("PS.txt_contracts_completed"),
        children: <ContractsCompleted list={model?.contractSettlements} />,
      },
      {
        key: TabKey.COMPONENTS,
        label: translate("PS.txt_investment_results"),
        children: <SettlementInformationComponents.InvestmentResults />,
      },
      {
        key: TabKey.RECEIPT,
        label: translate("PS.txt_project_performance_evaluation"),
        children: (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "evaluationResult"
            )}
          >
            <TextArea
              label={translate("PS.txt_evaluation_results")}
              placeHolder={translate("PS.placeholder_input_content")}
              value={model?.evaluationResult}
              maxLength={MAX_LENGTH_1000}
              onChange={handleChangeSingleField({
                fieldName: "evaluationResult",
              })}
              resize="none"
              showCount
              isRequired
            />
          </FormItem>
        ),
      },
      {
        key: TabKey.RECEIVER,
        label: translate("PS.txt_debt_and_payment_status"),
        children: (
          <DebtPaymentInformation
            list={model?.debts}
            errors={model?.errors}
            handleChangeSingleField={handleChangeSingleField}
          />
        ),
      },
      {
        key: TabKey.DOCUMENTS,
        label: translate("PS.txt_investor_responsibilities"),
        children: (
          <FormItem
            validateObject={utilService.getValidateObj(model, "responsibility")}
          >
            <TextArea
              label={translate("PS.txt_investor_and_related_responsibilities")}
              placeHolder={translate("PS.placeholder_input_content")}
              value={model?.responsibility}
              onChange={handleChangeSingleField({
                fieldName: "responsibility",
              })}
              maxLength={MAX_LENGTH_1000}
              resize="none"
              showCount
              isRequired
            />
          </FormItem>
        ),
      },
      {
        key: TabKey.REFERENCE,
        label: translate("AC.table_attachment"),
        children: (
          <Attachments
            attachments={model?.attachments}
            handleUpdate={handleChangeListField({ fieldName: "attachments" })}
          />
        ),
      },
    ],
    [handleChangeListField, handleChangeSingleField, model, translate]
  );

  return (
    <div className={styles["content-container"]}>
      <CollapseView
        items={itemsCollapse}
        defaultActiveKey={Object.values(TabKey)}
      />
      {isEqual(state, "EDIT") ? (
        <div className="px-3 pb-2">
          <Comments
            isNewLayoutVersion
            topicId={model?.id}
            topicType={TopicType.ProjectSettlement}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SettlementInformation;
