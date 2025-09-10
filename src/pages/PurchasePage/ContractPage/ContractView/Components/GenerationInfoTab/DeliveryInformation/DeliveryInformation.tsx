import { useTranslation } from "react-i18next";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import DateReceivedTable from "./Components/DateReceivedTable/DateReceivedTable";
import { useContext, useMemo } from "react";

import { ContractDetailModel, ReceivedType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import ContractViewDataReceivedType from "./Components/DataReceivedType/DataReceivedType";

const ContractViewDeliveryInformation = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const isReceivedTypeSingle = useMemo(
    () => model?.receivedType === ReceivedType.SingleReceiver,
    [model?.receivedType]
  );

  if (model?.isPrinciple) return null;

  return (
    <div className="contract-detail-delivery_information">
      <CollapseCard
        title={translate("CT.create_contract.delivery_information")}
      >
        <ContractViewDataReceivedType
          isReceivedTypeSingle={isReceivedTypeSingle}
        />
        {isReceivedTypeSingle ? <DateReceivedTable /> : ""}
      </CollapseCard>
    </div>
  );
};

export default ContractViewDeliveryInformation;
