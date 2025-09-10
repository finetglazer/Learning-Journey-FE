import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { SettlementContractInfo } from "./Components/SettlementContractInfo/SettlementContractInfo";
import SettlementContractDetail from "./Components/SettlementContractDetail/SettlementContractDetail";
import "./DrawerSettlementGoodsServices.scss";
import { GoodsItemsType } from "models/Settlement";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
  recordGoodServices: GoodsItemsType;
}

const DrawerSettlementGoodsServices = ({
  visible,
  handleClose,
  handleSave,
  recordGoodServices,
}: Props) => {
  const [translate] = useTranslation();
  const hasBorder = true;

  const items = useMemo(
    () => [
      {
        key: "1",
        label: (
          <div className="font-size-16">
            {translate("settlement.settlement_goods_and_services_info")}
          </div>
        ),
        children: (
          <SettlementContractInfo recordGoodServices={recordGoodServices} />
        ),
      },
    ],
    [translate]
  );

  return (
    <div>
      <Drawer
        numberButton={"1"}
        visible={visible}
        size={"xl"}
        loading={false}
        titleButtonCancel={translate("CM.btn_cancel")}
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
              {translate("settlement.settlement_goods_and_services_info")}
            </span>
          </div>
        }
        className="settlement-contract-drawer"
      >
        <SettlementContractDetail recordGoodServices={recordGoodServices} />
        <CollapseView
          items={items}
          defaultActiveKey={["1", "2"]}
          className={classNames(
            hasBorder
              ? "collapse__container__overflow"
              : "collapse__container--not-border"
          )}
        />
      </Drawer>
    </div>
  );
};

export default DrawerSettlementGoodsServices;
