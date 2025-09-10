import { Collapse, type CollapseProps } from "antd";
import React, { useContext } from "react";
import { SettlementHookContext } from "../../SettlementDetailHook";
import { useTranslation } from "react-i18next";
import { emptyCloudIcon, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import SettlementFile from "./components/SettlementFile/SettlementFile";
import SettlementFileView from "./components/SettlementFile/SettlementFileView";
import { AdvancedCollapseView } from "components";
import settlement from "locales/vi/settlement";
import { isEmpty } from "lodash";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import "./SettlementFileTab.scss";
import { SettlementStatus } from "models/Settlement/Settlement";

enum SettlementFileSectionKey {
  UPLOAD_FILE,
  HISTORY_FILE,
}

const SettlementFileTab = () => {
  const [translate] = useTranslation();
  const { model } = useContext(SettlementHookContext);

  const constantCollapseItems: CollapseProps["items"] = [
    {
      key: SettlementFileSectionKey.UPLOAD_FILE,
      label: (
        <div className="ct-title">{translate(settlement.title_collapse)}</div>
      ),
      children: <SettlementFile />,
    },
  ];

  if (!model?.id) {
    return (
      <div className="settlement-file_ct-collapse ct-scroll">
        <Collapse
          ghost
          items={constantCollapseItems}
          defaultActiveKey={[SettlementFileSectionKey.UPLOAD_FILE]}
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
  }

  const isShowButtonAdd = model?.status === SettlementStatus.APPROVED;

  return (
    <div className="settlement-file">
      {isEmpty(model?.files) && !isShowButtonAdd ? (
        <div className="settlement-file-tab-view">
          <div className="settlement-file-tab-view-items p-y--lg p-x--sm m--sm">
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("settlement.settlement_empty_system")}
            />
          </div>
        </div>
      ) : (
        <AdvancedCollapseView
          items={[
            {
              key: SettlementFileSectionKey.HISTORY_FILE,
              label: (
                <div className="ct-title">
                  {translate(settlement.title_collapse)}
                </div>
              ),
              children: <SettlementFileView />,
            },
          ]}
          defaultActiveKey={[SettlementFileSectionKey.HISTORY_FILE]}
        />
      )}
    </div>
  );
};

export default SettlementFileTab;
