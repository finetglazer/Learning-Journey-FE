import classNames from "classnames";

import ContractAppendixComponent from "./Components/ContractAppendix/ContractAppendix";

import { IcArrowDown } from "assets/icons";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";

export enum ContractAppendixSectionKey {
  CONTRACT_TERMS = "CONTRACT_TERMS",
}

const ContractAppendixTab = () => {
  const [translate] = useTranslationContract();

  const collapseItems: CollapseItem[] = [
    {
      key: ContractAppendixSectionKey.CONTRACT_TERMS,
      label: (
        <div className="ct-title">
          {translate("CT.contract_appendix.title")}
        </div>
      ),
      children: <ContractAppendixComponent />,
    },
  ];

  return (
    <CollapseView
      items={collapseItems}
      className="payment_schedule_tab contract-appendix-tab"
      defaultActiveKey={[ContractAppendixSectionKey.CONTRACT_TERMS]}
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
      isShowTopDivider={false}
    />
  );
};

export default ContractAppendixTab;
