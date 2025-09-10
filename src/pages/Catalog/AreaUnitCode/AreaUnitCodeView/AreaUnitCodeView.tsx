import { Modal } from "react-components-design-system";

import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import "./AreaUnitCodeView.scss";
import { useAreaUnitCodeViewHooks } from "./AreaUnitCodeViewHooks";

interface AreaUnitCodeViewProps {
  open: boolean;
  areaUnitCodeId: string;
  handleCancel: () => void;
}

const MODAL_WIDTH = 600;

export const AreaUnitCodeView = ({
  open,
  areaUnitCodeId,
  handleCancel,
}: AreaUnitCodeViewProps) => {
  const { translate, model, isLoading } = useAreaUnitCodeViewHooks(
    open,
    areaUnitCodeId
  );

  const contractValidityPeriod = `${
    formatDate(model?.startTime, STANDARD_DATE_FORMAT_SLASH) || ""
  } - ${formatDate(model?.expireTime, STANDARD_DATE_FORMAT_SLASH) || ""}`;

  return (
    <Modal
      open={open}
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("AUC.title_view_area_unit_config_detail")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={handleCancel}
      handleCancel={handleCancel}
      className="area-unit-code-view"
    >
      <div className="area-unit-code-view-body">
        <div className="area-unit-code__item">
          <span className="area-unit-code__item-label">
            {translate("AUC.txt_nhcd_cost_center")}
          </span>
          <span className="area-unit-code__item-value">
            {model?.businessUnit?.name} - {model?.businessUnit?.code}
          </span>
        </div>
        <div className="area-unit-code__item">
          <span className="area-unit-code__item-label">
            {translate("AUC.txt_cn_pgd_cost_center")}
          </span>
          <span className="area-unit-code__item-value">
            {model?.businessBranch?.name} - {model?.businessUnit?.code}
          </span>
        </div>
        <div className="area-unit-code__item">
          <span className="area-unit-code__item-label">
            {translate("AUC.txt_tt_pb_cost_center")}
          </span>
          <span className="area-unit-code__item-value">
            {model?.businessDepartment?.name} - {model?.businessUnit?.code}
          </span>
        </div>
        <div className="area-unit-code__item">
          <span className="area-unit-code__item-label">
            {translate("AUC.txt_contract")}
          </span>
          <div className="area-unit-code__item-value">
            <div>{model?.contractCode}</div>
            <div>{contractValidityPeriod}</div>
          </div>
        </div>
        <div className="area-unit-code__item area-unit-code__item__item--full">
          <span className="area-unit-code__item-label">
            {translate("AUC.txt_area_m2")}
          </span>
          <span className="area-unit-code__item-value">
            {formatNumber(model?.value)}
          </span>
        </div>
      </div>
    </Modal>
  );
};
