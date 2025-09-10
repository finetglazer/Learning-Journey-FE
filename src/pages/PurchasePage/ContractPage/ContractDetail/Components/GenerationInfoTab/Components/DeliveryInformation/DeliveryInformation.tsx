import "./DeliveryInformation.scss";
import { useTranslation } from "react-i18next";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import DateReceivedTable from "./Components/DateReceivedTable/DateReceivedTable";
import { useContext } from "react";

import { ContractDetailModel, ReceivedType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import ReceiveTypeSelect from "./Components/ReceiveTypeSelect/ReceiveTypeSelect";

const ContractDetailDeliveryInformation = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  if (model.isPrinciple) return null;

  return (
    <div className="contract-detail-delivery_information">
      <CollapseCard
        title={translate("CT.create_contract.delivery_information")}
      >
        <ReceiveTypeSelect />
        {model?.receivedType === ReceivedType.SingleReceiver ? (
          <DateReceivedTable />
        ) : (
          ""
        )}
      </CollapseCard>
    </div>
  );
};

export default ContractDetailDeliveryInformation;
