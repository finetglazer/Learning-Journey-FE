import { ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./DataReceivedType.scss";

import { Row } from "antd";
import CardGrid from "pages/PurchasePage/ContractPage/ContractView/Components/CardGrid/CardGrid";
import { listReceivedType } from "config/const";
import classNames from "classnames";

type DataReceivedTypeProps = { isReceivedTypeSingle: boolean };

const ContractViewDataReceivedType = ({
  isReceivedTypeSingle = false,
}: DataReceivedTypeProps) => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const nameReceivedType = useMemo(() => {
    let result = listReceivedType[1].name;

    if (isReceivedTypeSingle) {
      result = listReceivedType[0].name;
    }

    return result;
  }, [isReceivedTypeSingle]);

  const receiverInfos = useMemo(() => {
    return model?.contractGoodsItems?.[0]?.receiverInfos?.[0];
  }, [model?.contractGoodsItems]);

  return (
    <Row className="contract_view_data_received_type">
      <CardGrid
        title={translate("CT.create_contract.title.receiving_type")}
        className={classNames(
          "w-percentage-3 card-bg-gray card-bottom card-rounded-top-left card-rounded-bottom-left",
          !isReceivedTypeSingle &&
            "card-right card-rounded-top-right card-rounded-bottom-right"
        )}
      >
        {nameReceivedType}
      </CardGrid>

      {isReceivedTypeSingle && (
        <>
          <CardGrid
            title={translate("PR.receiving_unit")}
            className="w-percentage-3 card-bg-gray card-bottom"
          >
            {receiverInfos?.organization?.name
              ? receiverInfos?.organization?.name
              : "--"}
          </CardGrid>

          <CardGrid
            title={translate("PR.receiver")}
            className="w-percentage-3 card-bg-gray card-bottom"
          >
            {receiverInfos?.personObj?.email
              ? `${receiverInfos.personObj.email} - ${receiverInfos.personObj.name}`
              : "--"}
          </CardGrid>
          <CardGrid
            title={translate("PR.telephone_number")}
            className="w-percentage-3 card-bg-gray card-bottom card-rounded-top-right card-rounded-bottom-right card-right"
          >
            {receiverInfos?.phone ? receiverInfos.phone : "--"}
          </CardGrid>
        </>
      )}
    </Row>
  );
};

export default ContractViewDataReceivedType;
