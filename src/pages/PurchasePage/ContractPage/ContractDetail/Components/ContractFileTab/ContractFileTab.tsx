import { Collapse, type CollapseProps } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { useContext } from "react";
import ContractFile from "./Components/ContractFile/ContractFile";
import ViewContractFiles from "./Components/ContractFile/ViewContractFile";
import "./ContractFileTab.scss";

enum ContractFileSectionKey {
  UPLOAD_FILE,
  HISTORY_FILE,
}

const ContractFileTab = () => {
  const [translate] = useTranslationContract();

  const { isDetail } = useContext(ContractDetailHookContext);

  const constantCollapseItems: CollapseProps["items"] = [
    {
      key: ContractFileSectionKey.UPLOAD_FILE,
      label: (
        <div className="ct-title">{translate("CT.contract_file.title")}</div>
      ),
      children: isDetail ? <ViewContractFiles /> : <ContractFile />,
    },
  ];

  return (
    <div className="ct-collapse ct-scroll">
      <Collapse
        ghost
        items={constantCollapseItems}
        defaultActiveKey={[ContractFileSectionKey.UPLOAD_FILE]}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <img
              src={IcArrowDown}
              className={classNames(
                "invoice-transition",
                isActive && "invoice-transition_expand"
              )}
              alt=""
            />
          </div>
        )}
      />
    </div>
  );
};

export default ContractFileTab;
