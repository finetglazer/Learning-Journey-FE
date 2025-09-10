/* eslint-disable import/named */
import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import SupplierInformationForm from "../SupplierInformationForm/SupplierInformationForm";
import SupplierInformationTableDrawer from "../SupplierInformationTableDrawer/SupplierInformationTableDrawer";
import "./SupplierInformationDrawer.scss";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
}

const SupplierInformationDrawer = ({
  visible,
  handleClose,
  handleSave,
}: Props) => {
  const [translate] = useTranslation();
  const hasBorder = false;

  const items = useMemo(
    () => [
      {
        key: "1",
        label: translate("PL.purchasing_plan_email_receiver_information"),
        children: <SupplierInformationTableDrawer />,
      },
    ],
    [translate]
  );

  return (
    <Drawer
      numberButton={"1"}
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
          <span>{translate("PL.purchasing_plan_supplier_information")}</span>
        </div>
      }
      className="supplier-drawer"
    >
      <SupplierInformationForm />
      <div className="drawer-border-top"></div>
      <CollapseView
        items={items}
        defaultActiveKey={["1"]}
        className={classNames(
          hasBorder
            ? "collapse__container__overflow"
            : "collapse__container--not-border"
        )}
      />
    </Drawer>
  );
};

export default SupplierInformationDrawer;
