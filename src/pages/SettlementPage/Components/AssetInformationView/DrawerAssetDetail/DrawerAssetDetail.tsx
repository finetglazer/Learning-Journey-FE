import {
  AssetItems,
  SettlementHookModel,
  SettlementType,
} from "models/Settlement";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import React, { useContext, useMemo } from "react";
import { Drawer } from "react-components-design-system";
import "./DrawerAssetDetail.scss";
import CollapseView from "components/Collapse/CollapseView";
import classNames from "classnames";
import dayjs from "dayjs";
import { Tooltip } from "antd";
import { formatNumber } from "core/helpers/number";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { addZStringToDate } from "core/helpers/date-time";

interface Props {
  visible: boolean;
  handleClose: () => void;
  recordEdit: AssetItems;
}

const DrawerAssetDetail = ({ visible, handleClose, recordEdit }: Props) => {
  const { translate } = useContext<SettlementHookModel>(SettlementHookContext);
  const hasBorder = true;

  const items = useMemo(
    () => [
      {
        key: "1",
        label: (
          <div className="font-size-16">
            {translate("settlement.property_info")}
          </div>
        ),
        children: (
          <div className="asset-info-container">
            <div className="asset-grid">
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_type")}
                </span>
                <span className="value">
                  {recordEdit?.type === 1
                    ? SettlementType?.NEW_PURCHASE
                    : SettlementType?.UPGRADE}
                </span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_classify")}
                </span>
                <span className="value">{recordEdit?.classify}</span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate(
                    "settlement.settlement_number_of_months_of_depreciation"
                  )}
                </span>
                <span className="value">{recordEdit?.depreciationMonths}</span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_quantity")}
                </span>
                <span className="value">
                  {`${formatNumber(recordEdit?.quantity || 0)} `}
                </span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_original_price")}
                </span>
                <span className="value">
                  {`${formatNumber(
                    recordEdit?.originalCost
                  )} ${VND_CURRENCY_UNIT}`}
                </span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_date_of_use")}
                </span>
                <span className="value">
                  {dayjs(addZStringToDate(recordEdit?.usageStartDate)).format(
                    "DD/MM/YYYY"
                  )}
                </span>
              </div>
              <div className="asset-item">
                <span className="label">
                  {translate("settlement.settlement_start_date_depreciation")}
                </span>
                <span className="value">
                  {dayjs(
                    addZStringToDate(recordEdit?.depreciationStartDate)
                  ).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="asset-item two-thirds border-bottom-none">
                <span className="label">
                  {translate("settlement.asset_note")}
                </span>
                <Tooltip
                  title={recordEdit?.note?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                >
                  {recordEdit?.note?.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </Tooltip>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [translate, recordEdit]
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
        isHaveCloseIcon={true}
        shouldCloseWhenClickOutSide={false}
        hasOverlay={false}
        title={
          <div className="fw-bold">
            <span>{translate("settlement.property_info")}</span>
          </div>
        }
        isShowButtonApply={false}
        isShowButtonCancel={false}
        className="settlement-asset-info-view-drawer"
      >
        <div>
          <div className="p-b--sm">
            <div className="asset-info-container">
              <div className="asset-grid">
                <div className="asset-item highlighted">
                  <span className="label">
                    {translate("settlement.asset_code")}
                  </span>
                  <Tooltip title={recordEdit?.code}>
                    <span className="value">{recordEdit?.code}</span>
                  </Tooltip>
                </div>
                <div className="asset-item highlighted">
                  <span className="label">
                    {translate("settlement.asset_name")}
                  </span>
                  <Tooltip title={recordEdit?.name}>
                    <span className="value">{recordEdit?.name}</span>
                  </Tooltip>
                </div>
                <div className="asset-item highlighted">
                  <span className="label">
                    {translate("settlement.serial_number")}
                  </span>
                  <Tooltip title={recordEdit?.serialNumber}>
                    <span className="value">{recordEdit?.serialNumber}</span>
                  </Tooltip>
                </div>
                <div className="asset-item highlighted">
                  <span className="label">
                    {translate("settlement.origin_no")}
                  </span>
                  <Tooltip title={recordEdit?.originNo}>
                    <span className="value">{recordEdit?.originNo}</span>
                  </Tooltip>
                </div>
                <div className="asset-item highlighted">
                  <span className="label">
                    {translate("settlement.goods_services_code")}
                  </span>
                  <Tooltip title={recordEdit?.goods?.code}>
                    <span className="value">{recordEdit?.goods?.code}</span>
                  </Tooltip>
                </div>
                <div className="asset-item highlighted">
                  <span className="label">
                    {translate("settlement.goods_services_name")}
                  </span>
                  <Tooltip title={recordEdit?.goods?.name}>
                    <span className="value">{recordEdit?.goods?.name}</span>
                  </Tooltip>
                </div>
                <div className="asset-item">
                  <span className="label">
                    {translate("settlement.settlement_brand_or_type")}
                  </span>
                  <Tooltip title={recordEdit?.branch?.name}>
                    <span className="value">{recordEdit?.branch?.name}</span>
                  </Tooltip>
                </div>
                <div className="asset-item two-thirds">
                  <span className="label">
                    {translate(
                      "settlement.settlement_description_goods_and_services"
                    )}
                  </span>
                  <Tooltip title={recordEdit?.goodsDescription}>
                    <span className="value">
                      {recordEdit?.goodsDescription}
                    </span>
                  </Tooltip>
                </div>
                <div className="asset-item full-width">
                  <span className="label">
                    {translate("settlement.goods_services_note")}
                  </span>
                  <Tooltip title={recordEdit?.goodsNote}>
                    <span className="value">{recordEdit?.goodsNote}</span>
                  </Tooltip>
                </div>
                <div className="asset-item border-bottom-none">
                  <span className="label">
                    {translate("settlement.settlement_Recipient_and_named")}
                  </span>
                  <Tooltip
                    title={`${recordEdit?.ownerUser?.email} - ${recordEdit?.ownerUser?.name}`}
                  >
                    <span className="value">
                      {recordEdit?.ownerUser?.email}
                    </span>
                  </Tooltip>
                </div>
                <div className="asset-item two-thirds border-bottom-none">
                  <span className="label">
                    {translate("settlement.settlement_asset_info_unit_name")}
                  </span>
                  <span className="value">
                    {recordEdit?.ownerOrganization?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin tài sản */}
          <CollapseView
            items={items}
            defaultActiveKey={["1", "2"]}
            className={classNames(
              hasBorder
                ? "collapse__container__overflow"
                : "collapse__container--not-border"
            )}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerAssetDetail;
