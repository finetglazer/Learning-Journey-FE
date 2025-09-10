/* eslint-disable import/named */
import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./NextRoundBidDrawer.scss";
import SupplierInformationForm from "./Components/SupplierInformationForm/SupplierInformationForm";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import SupplierInformationTableDrawer from "./Components/SupplierInformationTableDrawer/SupplierInformationTableDrawer";

interface Props {
  isLoadingButtonNextRound: boolean;
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
  contextValue: PurchasingPlanModel;
}

const NextRoundBidDrawer = ({
  visible,
  handleClose,
  handleSave,
  isLoadingButtonNextRound,
  contextValue,
}: Props) => {
  const [translate] = useTranslation();
  const hasBorder = false;

  const items = useMemo(
    () => [
      {
        key: "1",
        label: translate("PL.purchasing_plan_email_receiver_information"),
        children: <SupplierInformationTableDrawer {...contextValue} />,
      },
    ],
    [translate, contextValue]
  );

  return (
    <Drawer
      numberButton={"1"}
      visible={visible}
      size={"2xl"}
      loading={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.btn_confirm")}
      handleCancel={handleClose}
      handleClose={handleClose}
      handleSave={handleSave}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      disableButton={isLoadingButtonNextRound}
      title={
        <div className="fw-bold">
          <span>{translate("PL.purchasing_plan_open_next_round_bid")}</span>
        </div>
      }
      className="supplier-drawer__next-round-bid"
    >
      <SupplierInformationForm translate={translate} {...contextValue} />
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

export default NextRoundBidDrawer;
