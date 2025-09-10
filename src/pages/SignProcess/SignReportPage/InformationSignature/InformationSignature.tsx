import { Radio, Space } from "antd";
import { WorkflowState, WorkflowStateFilter } from "models/WorkflowState";
import React from "react";
import "./InformationSignature.scss";

import { RequestFormConfiguration } from "models/RequestFormConfiguration";
import { RequestFormConfigurationContent } from "models/RequestFormConfigurationContent";
import { BudgetRepository } from "pages/BudgetPage/BudgetRepository";
import { BudgetSettlementRepository } from "pages/BudgetPage/BudgetSettlementCreate/BudgetSettlementRepository";
import { PaymentRepository } from "pages/PaymentPage/PaymentRepository";
import { ContractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { ContractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { ContractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";
import { PurchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { ReceivedGoodsRepository } from "pages/PurchasePage/ReceivingGoods/ReceivedGoodRepository";
import { useTranslation } from "react-i18next";

import { RadioChangeEvent } from "antd/lib";
import { AcceptanceRepository } from "core/repositories/AcceptanceRepository";
import { ProjectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import { isUndefined } from "lodash";
import { ContractTerminationRepository } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationRepository";
import { ProposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { TemporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";
import { SettlementRepository } from "pages/SettlementPage/SettlementRepository";
import { FormItem, Select } from "react-components-design-system";
interface InformationSignatureProps {
  requestFormConfiguration: RequestFormConfiguration;
  currentContent: RequestFormConfigurationContent;
  requestId: string;
  requestField: string;
  updateContent: (content: RequestFormConfigurationContent) => void;
  updateAttachment: (attachment: RequestFormConfigurationContent) => void;
  repository:
    | ProposalRepository
    | PaymentRepository
    | PurchasingPlanRepository
    | BudgetRepository
    | ContractPrincipleRepository
    | ContractRepository
    | BudgetSettlementRepository
    | ReceivedGoodsRepository
    | ContractAnnexRepository
    | AcceptanceRepository
    | TemporaryImportAssetRepository
    | SettlementRepository
    | ProjectSettlementRepository
    | ContractTerminationRepository;
  haveDigitalSigining?: boolean;
}

// const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const InformationSignature: React.FC<InformationSignatureProps> = ({
  currentContent,
  updateContent,
  updateAttachment,
  requestId,
  // requestField,
  requestFormConfiguration,
  repository,
  // haveDigitalSigining,
}) => {
  // const [loadingState, setLoadingState] = React.useState(false);
  // const [errorMessage, setErrorMessage] = React.useState<string>(null);
  // const [validateStatus, setValidateStatus] =
  //   React.useState<ValidateStatus>(null);

  const listApprovalActorIdSelected = React.useMemo(() => {
    return requestFormConfiguration &&
      requestFormConfiguration.signatureConfigurations &&
      requestFormConfiguration.signatureConfigurations.length > 0
      ? requestFormConfiguration.signatureConfigurations
          .map((item) => item?.key)
          .filter((item) => !isUndefined(item))
      : [];
  }, [requestFormConfiguration]);

  const handleChangeOptionSignature = React.useCallback(
    (e: RadioChangeEvent) => {
      const attachment = { ...currentContent };
      attachment.signatureDisplayType = e.target.value;
      updateContent(attachment);
      updateAttachment(attachment);
    },
    [currentContent, updateAttachment, updateContent]
  );

  const handleChangeWorkflow = React.useCallback(
    (_id: number, value: WorkflowState) => {
      const attachment = { ...currentContent };
      attachment.approvalTransitionId = value?.workflowTransitionId;
      attachment.approvalActorId = value?.workflowActorId;
      attachment.actorDisplayName = value?.actorDisplayName;
      attachment.key = value?.key ?? undefined;
      attachment.previewDisplay = value?.actorIdentityDisplayName;
      attachment.approvalActorIds = value?.workflowActorIds;
      attachment.transitionName = value?.transitionName;
      attachment.orderIndex = value?.orderIndex;
      updateContent(attachment);
      updateAttachment(attachment);
    },
    [currentContent, updateAttachment, updateContent]
  );
  const [translate] = useTranslation();

  const typeSignatureOption = [
    {
      type: translate("signReports.type1"),
      value: 1,
    },
    {
      type: translate("signReports.type2"),
      value: 2,
    },
  ];

  return (
    <div className="information-signature">
      <p className="information-signature__title">
        {translate("signReports.signInfor")}
      </p>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <FormItem>
          <Select
            classFilter={WorkflowStateFilter}
            placeHolder={translate("signReports.placeHolder.wf")}
            getList={repository.listSignature}
            onChange={
              // haveDigitalSigining
              //   ? handleChangeWorkflowDigitalSign
              handleChangeWorkflow
            }
            value={{
              ...currentContent,
              id: currentContent?.key,
            }}
            render={(item: WorkflowState) => {
              return item?.actorDisplayName
                ? `${item?.actorDisplayName} - ${item.transitionName}`
                : null;
            }}
            searchProperty={"search"}
            searchType={null}
            isEnumerable={false}
            isSearch={true}
            valueFilter={{
              ...new WorkflowStateFilter(),
              id: requestId,
              notIn: listApprovalActorIdSelected,
            }}
          />
        </FormItem>

        {currentContent.signatureType === 1 && (
          <Radio.Group
            value={currentContent.signatureDisplayType}
            onChange={handleChangeOptionSignature}
          >
            <Space direction="vertical">
              {typeSignatureOption.map((item) => (
                <Radio key={item.value} value={item.value}>
                  {item.type}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </Space>
      {/* {loadingState && (
        <div className="overlay-zone d-flex justify-content-center align-items-center">
          <Spin indicator={antIcon} />
        </div>
      )} */}
    </div>
  );
};

export default InformationSignature;
