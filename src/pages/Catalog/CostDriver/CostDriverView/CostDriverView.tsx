import { isEqual } from "lodash";
import { Modal } from "react-components-design-system";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { useMemo } from "react";
import { useCostDriverViewHooks } from "./CostDriverViewHooks";
import "./CostDriverView.scss";

interface CostDriverViewProps {
  CostDriverId: string;
  open: boolean;
  handleCancel: () => void;
}

const MODAL_WIDTH = 600;

export const CostDriverView = ({
  open,
  CostDriverId,
  handleCancel,
}: CostDriverViewProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useCostDriverViewHooks(CostDriverId);

  return (
    <Modal
      open={open}
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("CD.title_view_detail_cost_driver")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={handleCancel}
      handleCancel={handleCancel}
      className="cost-driver-view"
    >
      <div className="cost-driver-view-body">
        <span className="cost-driver__name">{model?.name}</span>
        <div className="cost-driver__code" onClick={copyToClipboard}>
          <span className="cost-driver__code-value">{model?.code}</span>
          <div className="cost-driver__code-icon">
            <img src={CopySvg} alt="CopySvg" />
          </div>
        </div>
        <div className="cost-driver__description">
          <span className="cost-driver__description-label">
            {translate("CD.txt_cost_driver_description")}
          </span>
          <p className="cost-driver__description-value">{model?.description}</p>
        </div>
      </div>
    </Modal>
  );
};
