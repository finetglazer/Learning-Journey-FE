import { Collapse, type CollapseProps } from "antd";
import classNames from "classnames";

import ContractTerms from "./Components/ContractTerms/ContractTerms";

import { IcArrowDown } from "assets/icons";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

export enum ContractTermsKey {
  CONTRACT_TERMS,
}

const ContractTermsTab = () => {
  const [translate] = useTranslationContract();

  const collapseItems: CollapseProps["items"] = [
    {
      key: ContractTermsKey.CONTRACT_TERMS,
      label: <div className="ct-title">{translate("CT.contract_terms")}</div>,
      children: <ContractTerms />,
    },
  ];

  return (
    <div className="ct-collapse ct-scroll">
      <Collapse
        ghost
        items={collapseItems}
        defaultActiveKey={[ContractTermsKey.CONTRACT_TERMS]}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <img
              src={IcArrowDown}
              className={classNames(
                "invoice-transition",
                isActive && "invoice-transition_expand"
              )}
              alt="Chevron Icon"
            />
          </div>
        )}
      />
    </div>
  );
};

export default ContractTermsTab;
