import { Modal } from "react-components-design-system";

import { formatNumber } from "core/helpers/number";
import "./PersonnelByUnitView.scss";
import { usePersonnelByUnitViewHooks } from "./PersonnelByUnitViewHooks";

interface PersonnelByUnitViewProps {
  open: boolean;
  personnelByUnitId: string;
  handleCancel: () => void;
}

const MODAL_WIDTH = 600;

export const PersonnelByUnitView = ({
  open,
  personnelByUnitId,
  handleCancel,
}: PersonnelByUnitViewProps) => {
  const { translate, model, isLoading } = usePersonnelByUnitViewHooks(
    open,
    personnelByUnitId
  );

  return (
    <Modal
      open={open}
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("PBU.title_view_area_unit_config_detail")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={handleCancel}
      handleCancel={handleCancel}
      className="personnel-by-unit-view"
    >
      <div className="personnel-by-unit-view-body">
        <div className="personnel-by-unit__item">
          <span className="personnel-by-unit__item-label">
            {translate("PBU.txt_nhcd_cost_center")}
          </span>
          <span className="personnel-by-unit__item-value">
            {model?.businessUnit?.name} - {model?.businessUnit?.code}
          </span>
        </div>
        <div className="personnel-by-unit__item">
          <span className="personnel-by-unit__item-label">
            {translate("PBU.txt_cn_pgd_cost_center")}
          </span>
          <span className="personnel-by-unit__item-value">
            {model?.businessBranch?.name} - {model?.businessUnit?.code}
          </span>
        </div>
        <div className="personnel-by-unit__item">
          <span className="personnel-by-unit__item-label">
            {translate("PBU.txt_tt_pb_cost_center")}
          </span>
          <span className="personnel-by-unit__item-value">
            {model?.businessDepartment?.name} - {model?.businessUnit?.code}
          </span>
        </div>
        <div className="personnel-by-unit__item">
          <span className="personnel-by-unit__item-label">
            {translate("PBU.txt_number_of_employee")}
          </span>
          <div className="personnel-by-unit__item-value">
            <div>{formatNumber(model?.employeeCount)}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
