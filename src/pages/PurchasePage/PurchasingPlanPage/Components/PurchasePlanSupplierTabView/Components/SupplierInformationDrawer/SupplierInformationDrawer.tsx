import { ReactElement, useContext } from "react";
import { Drawer } from "react-components-design-system";
import { IcArrowDown } from "assets/icons";
import "./SupplierInfomationDrawer.scss";
import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import classNames from "classnames";
import DetailSupplierTable from "./components/SupplierInformationTable";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import RecipientInformationTable from "./components/RecipientInformationTable";

interface Props {
  visible: boolean;
  handleClose: () => void;
  values: SupplierModel;
}

enum EGeneralInformationSectionKey {
  EMAIL_RECIPIENTS,
}

const SupplierInformationDrawer = ({
  visible = true,
  handleClose,
  values,
}: Props): ReactElement => {
  const { translate } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );

  const collapseItems: CollapseProps["items"] = [
    {
      key: EGeneralInformationSectionKey.EMAIL_RECIPIENTS,
      label: (
        <h1 className="invoice-title">
          {translate("PL.drawer_email_recipients")}
        </h1>
      ),
      children: <RecipientInformationTable data={values?.emailRecipients} />,
    },
  ];

  return (
    <div className="supplier-information">
      <Drawer
        numberButton={"1"}
        visible={visible}
        size={"2xl"}
        loading={false}
        isShowButtonApply={false}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={handleClose}
        handleClose={handleClose}
        isHaveCloseIcon={true}
        hasOverlay={false}
        title={
          <div className="fw-bold drawer__header-text_title">
            <span>{translate("PL.purchasing_plan_supplier_information")}</span>
          </div>
        }
        className="supplier-information-drawer"
      >
        <DetailSupplierTable data={values} />
        <Collapse
          ghost
          items={collapseItems}
          className="pt-4"
          defaultActiveKey={[EGeneralInformationSectionKey.EMAIL_RECIPIENTS]}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div>
              <img
                src={IcArrowDown}
                className={classNames(
                  "invoice-transition",
                  isActive && "invoice-transition_expand"
                )}
                alt={IcArrowDown}
              />
            </div>
          )}
        />
      </Drawer>
    </div>
  );
};

export default SupplierInformationDrawer;
