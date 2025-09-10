import { useTranslation } from "react-i18next";
import { Collapse, type CollapseProps } from "antd";
import classNames from "classnames";

import Appendix from "./Components/Appendix";
import Adjustment from "./Components/Adjustment";

import { IcArrowDown } from "assets/icons";

export enum AdjustmentHistoryKey {
  APPENDIX,
  ADJUSTMENT,
}

const AdjustmentHistoryTab = () => {
  const [translate] = useTranslation();

  const collapseItems: CollapseProps["items"] = [
    {
      key: AdjustmentHistoryKey.APPENDIX,
      label: (
        <div className="ct-title">{translate("CT.contract_appendix.tab")}</div>
      ),
      children: <Appendix />,
    },
    {
      key: AdjustmentHistoryKey.ADJUSTMENT,
      label: <div className="ct-title">{translate("CT.adjustment")}</div>,
      children: <Adjustment />,
    },
  ];

  return (
    <div className="ct-collapse ct-scroll">
      <Collapse
        ghost
        items={collapseItems}
        defaultActiveKey={[
          AdjustmentHistoryKey.APPENDIX,
          AdjustmentHistoryKey.ADJUSTMENT,
        ]}
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

export default AdjustmentHistoryTab;
