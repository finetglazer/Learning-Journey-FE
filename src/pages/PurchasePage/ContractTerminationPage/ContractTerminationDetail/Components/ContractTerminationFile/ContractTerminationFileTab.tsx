import { type CollapseProps } from "antd";
import { emptyCloudIcon } from "assets/icons";
import { AdvancedCollapseView } from "components";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { isEmpty } from "lodash";
import {
  ContractTerminationContextModel,
  ContractTerminationStatus,
} from "models/ContractTermination";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ContractTerminationDetailHookContext } from "../../ContractTerminationDetailHook";
import ContractTerminationFile from "./Components/ContractTerminationFile/ContractTerminationFile";
import ContractTerminationFileView from "./Components/ContractTerminationFile/ContractTerminationFileView";
import "./ContractTerminationFileTab.scss";

enum ContractTerminationFileSectionKey {
  UPLOAD_FILE,
  HISTORY_FILE,
}

const ContractTerminationFileTab = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );

  const constantCollapseItems: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="ct-title">
          {translate("contractTermination.contract_termination_file_title")}
        </div>
      ),
      children: <ContractTerminationFile />,
    },
  ];

  const constantCollapseItemsView: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="ct-title">
          {translate("contractTermination.contract_termination_file_title")}
        </div>
      ),
      children: (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate(
            "contractTermination.contract_termination_empty_system"
          )}
        />
      ),
    },
  ];

  if (!model?.isView) {
    return (
      <div className="contract-termination-file_ct-collapse ct-scroll">
        <AdvancedCollapseView
          items={constantCollapseItems}
          defaultActiveKey={["1"]}
        />
      </div>
    );
  }

  const isShowButtonAdd = model?.status === ContractTerminationStatus.APPROVED;

  return (
    <div className="contract-termination-file">
      {isEmpty(model?.files) && !isShowButtonAdd ? (
        <AdvancedCollapseView
          items={constantCollapseItemsView}
          defaultActiveKey={["1"]}
        />
      ) : (
        <AdvancedCollapseView
          items={[
            {
              key: ContractTerminationFileSectionKey.HISTORY_FILE,
              label: (
                <div className="ct-title">
                  {translate(
                    "contractTermination.contract_termination_file_title"
                  )}
                </div>
              ),
              children: <ContractTerminationFileView />,
            },
          ]}
          defaultActiveKey={[ContractTerminationFileSectionKey.HISTORY_FILE]}
        />
      )}
    </div>
  );
};

export default ContractTerminationFileTab;
