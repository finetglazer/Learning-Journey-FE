import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { CollapseItem } from "components/Collapse/CollapseView";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ContractAdjustmentContext } from "../../ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import { isEqual, size } from "lodash";
import { Tooltip } from "antd";
import { WarningRound } from "assets/icons";
import { ContractInformationView } from "./Components/ContractInformationView";
import styles from "./Components/styles.module.scss";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History/History";
import { ServicesInformationView } from "./Components/ServicesInformationView";
import ShoppingPlanTable from "../ContractAdjustmentInfo/Components/ShoppingPlanTable/ShoppingPlanTable";
import GoodsService from "../ContractAdjustmentInfo/Components/GoodsService/GoodsService";
import { DeliveryInformation } from "../ContractAdjustmentInfo/Components/DeliveryInformation/DeliveryInformation";

enum InformationSectionKey {
  SHOPPING_PLAN = "SHOPPING_PLAN",
  GOOD_SERVICE_CHANGE = "GOOD_SERVICE_CHANGE",
  DELIVERY_INFORMATION = "DELIVERY_INFORMATION",
}

export const ContractAdjustmentInfoView = () => {
  const [translate] = useTranslation();
  const { model, dispatch } = useContext(ContractAdjustmentContext);
  const renderIcon = () => {
    return (
      <Tooltip placement="topLeft" title={translate("CA.txt_adjusted")}>
        <span className="d-flex align-items-start">
          <img src={WarningRound} alt="" />
        </span>
      </Tooltip>
    );
  };

  const renderTitle = (title: string, isShowIcon: boolean) => {
    return (
      <div className="d-flex gap-2 align-items-center">
        <span>{title}</span>
        {isShowIcon && renderIcon()}
      </div>
    );
  };

  const itemsCollapse = useMemo<CollapseItem[]>(
    () =>
      [
        {
          key: InformationSectionKey.SHOPPING_PLAN,
          label: translate("CA.txt_grounds"),
          children: (
            <div className={classNames("p-t--3xs")}>
              <ShoppingPlanTable />
            </div>
          ),
        },
        {
          key: InformationSectionKey.GOOD_SERVICE_CHANGE,
          label: renderTitle(
            translate("CA.txt_goods_services_change_information"),
            size(model?.contractAppendixGoodsItems) > 0
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <GoodsService dispatch={dispatch} model={model} isEdit={false} />
            </div>
          ),
        },
        size(model?.contractAppendixGoodsItems) > 0 && {
          key: InformationSectionKey.DELIVERY_INFORMATION,
          label: renderTitle(
            translate("CA.txt_delivery_information"),
            model?.contract?.isChangeReceiver
          ),
          children: (
            <div className={classNames("p-t--3xs")}>
              <DeliveryInformation />
            </div>
          ),
        },
      ].filter(Boolean),
    [translate, model]
  );

  const idContractAdjustment = model?.contract?.id;

  return (
    <div>
      <div className={classNames(styles["bg-color"], "p-3 pb-0")}>
        <ContractInformationView />
        <div className="mt-3">
          <ServicesInformationView />
        </div>
      </div>
      <AdvancedCollapseView
        items={itemsCollapse}
        showAll={false}
        defaultActiveKey={[
          InformationSectionKey.SHOPPING_PLAN,
          InformationSectionKey.GOOD_SERVICE_CHANGE,
          InformationSectionKey.DELIVERY_INFORMATION,
        ]}
      />
      {Boolean(idContractAdjustment) && (
        <div className="px-3 pb-3">
          <Comments
            topicId={idContractAdjustment}
            topicType={TopicType.ContractAdjustment}
            isNewLayoutVersion
          />
        </div>
      )}
    </div>
  );
};
