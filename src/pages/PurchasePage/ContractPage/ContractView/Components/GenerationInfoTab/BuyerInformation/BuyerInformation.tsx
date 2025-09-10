import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import "./BuyerInformation.scss";
import { Row } from "antd";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import CardGrid from "../../CardGrid/CardGrid";
import { useContext, useMemo } from "react";
import { ContractDetailModel, ContractStatus } from "models/Contract";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

const ContractViewBuyerInformation = () => {
  const [translate] = useTranslationContract();
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const checkStatusIsApproved = useMemo(() => {
    const status = model?.status;
    return ContractStatus.APPROVED === status;
  }, [model?.status]);

  return (
    <div className="contract_view_buyer_information">
      <CollapseCard title={translate("CT.create_contract.buyer_information")}>
        <div className="contract_view_buyer_information-body">
          <Row>
            <CardGrid
              title={translate("CT.create_contract.title.purchase_unit_name")}
              className="w-percentage-4 card-bg-gray card-rounded-top-left"
            >
              {model?.legalEntity?.name ? model.legalEntity.name : "--"}
            </CardGrid>
            <CardGrid
              title={translate("PP.tax_code_title")}
              className="w-percentage-4 card-bg-gray card-top card-no-right m-r--3xs"
            >
              {model?.legalEntity?.taxCode ? model.legalEntity.taxCode : "--"}
            </CardGrid>

            <CardGrid
              title={translate("PR.address")}
              className="w-percentage-4 card-bg-gray card-rounded-top-right card-right card-rounded-bottom-right card-bottom card-no-bottom"
            >
              {model?.legalEntity?.address ? model.legalEntity.address : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.legal_person")}
              className="w-percentage-4 card-rounded-bottom-left card-bottom"
            >
              {(checkStatusIsApproved && model?.legalEntity?.personAgent) ||
                "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.company_position")}
              className="w-percentage-4 card-rounded-bottom-right card-bottom card-right"
            >
              {(checkStatusIsApproved && model?.legalEntity?.position) || "--"}
            </CardGrid>
            <div></div>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractViewBuyerInformation;
