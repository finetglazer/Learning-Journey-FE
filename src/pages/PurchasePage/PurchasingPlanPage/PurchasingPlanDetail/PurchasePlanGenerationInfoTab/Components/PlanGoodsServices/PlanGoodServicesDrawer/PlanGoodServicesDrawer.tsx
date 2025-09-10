import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import PlanGoodServicesInformationDrawer from "../PlanGoodServicesInformationDrawer/PlanGoodServicesInformationDrawer";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { PurchasingPlanModel } from "models/PurchasingPlan";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
  recordGoodServices: GoodServiceByCategory;
  contextValue?: PurchasingPlanModel;
}

const PlanGoodServicesDrawer = ({
  visible,
  handleClose,
  handleSave,
  recordGoodServices,
  contextValue,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <Drawer
      numberButton={"2"}
      visible={visible}
      size={"2xl"}
      loading={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_save")}
      handleCancel={handleClose}
      handleClose={handleClose}
      handleSave={handleSave}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      title={
        <div className="fw-bold">
          <span>
            {translate("PL.purchasing_plan_details_of_goods_and_services")}
          </span>
        </div>
      }
    >
      <PlanGoodServicesInformationDrawer
        recordGoodServices={recordGoodServices}
        contextValue={contextValue}
      />
    </Drawer>
  );
};

export default PlanGoodServicesDrawer;
