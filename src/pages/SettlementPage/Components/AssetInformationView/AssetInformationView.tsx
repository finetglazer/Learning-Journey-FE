import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { emptyCloudIcon } from "assets/icons";
import { AdvancedCollapseView } from "components";
import { CollapseItem } from "components/Collapse/CollapseView";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import {
  AssetItems,
  SettlementHookModel,
  SettlementType,
} from "models/Settlement";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useContext, useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import "./AssetInformationView.scss";
import DrawerAssetDetail from "./DrawerAssetDetail/DrawerAssetDetail";
import { addZStringToDate } from "core/helpers/date-time";

const AssetInformationView = () => {
  const { translate, model } = useContext<SettlementHookModel>(
    SettlementHookContext
  );
  const [openDrawerAssetDetail, setOpenDrawerAssetDetail] =
    useState<boolean>(false);
  const [recordEdit, setRecordEdit] = useState<AssetItems>();

  const handleCloseDrawerAssetDetail = () => {
    setOpenDrawerAssetDetail(false);
  };

  const columns: ColumnProps<AssetItems>[] = useMemo(
    () => [
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_type")}
            unit={" "}
          />
        ),
        dataIndex: "type",
        key: "type",
        width: 124,
        render(text, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  record?.type === 1
                    ? SettlementType?.NEW_PURCHASE
                    : SettlementType?.UPGRADE
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.asset_name")}
            unit={" "}
          />
        ),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 120,
        render(code, record) {
          return (
            <LayoutCell>
              <div
                className="cursor-pointer"
                onClick={() => {
                  setOpenDrawerAssetDetail(true);
                  setRecordEdit(record);
                }}
              >
                <TwoLineText
                  valueLine1={record?.name}
                  valueLine2={record?.code}
                  classNameSecondLine="text-neutral-7"
                  classNameFirstLine="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.origin_no")}
            unit={" "}
          />
        ),
        key: "originNo",
        dataIndex: "originNo",
        width: 150,
        ellipsis: true,
        render(goodsDescription, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.originNo} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_quantity")}
            unit={" "}
          />
        ),
        key: "quantity",
        dataIndex: "quantity",
        width: 100,
        ellipsis: true,
        render(goodsDescription, record) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.quantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_original_price")}
            unit={model?.contract?.currency}
          />
        ),
        key: "originalCost",
        dataIndex: "originalCost",
        ellipsis: true,
        align: "right",
        width: 160,
        render(originalCost, record) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.originalCost)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_classify")}
            unit={" "}
          />
        ),
        key: "classify",
        dataIndex: "classify",
        ellipsis: true,
        width: 160,
        render(classify, record) {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.classify} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate(
              "settlement.settlement_number_of_months_of_depreciation"
            )}
            unit={" "}
          />
        ),
        key: "depreciationMonths",
        dataIndex: "depreciationMonths",
        ellipsis: true,
        width: 172,
        render(depreciationMonths, record) {
          return (
            <LayoutCell position="right">
              <OneLineText value={String(record?.depreciationMonths)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_date_of_use")}
            unit={" "}
          />
        ),
        key: "usageStartDate",
        dataIndex: "usageStartDate",
        ellipsis: true,
        width: 168,
        render(usageStartDate, record) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={
                  record?.usageStartDate &&
                  dayjs(addZStringToDate(record?.usageStartDate)).format(
                    "DD/MM/YYYY"
                  )
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_start_date_depreciation")}
            unit={" "}
          />
        ),
        key: "depreciationStartDate",
        dataIndex: "depreciationStartDate",
        ellipsis: true,
        width: 204,
        render(depreciationStartDate, record) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={
                  record?.depreciationStartDate &&
                  dayjs(addZStringToDate(record?.depreciationStartDate)).format(
                    "DD/MM/YYYY"
                  )
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate(
              "settlement.settlement_receiving_and_registered_unit"
            )}
            unit={" "}
          />
        ),
        key: "ownerOrganization",
        dataIndex: "ownerOrganization",
        ellipsis: true,
        width: 200,
        render(ownerOrganization: string, record) {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.ownerOrganization?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_Recipient_and_named")}
            unit={" "}
          />
        ),
        key: "ownerUser",
        dataIndex: "ownerUser",
        ellipsis: true,
        width: 179,
        render(ownerUser: string, record) {
          return (
            <LayoutCell position="left">
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${record?.ownerUser?.email} - ${record?.ownerUser?.name}`}
              >
                <div>{record?.ownerUser?.email}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_goods_services")}
            unit={" "}
          />
        ),
        key: "accountName",
        dataIndex: "accountName",
        width: 200,
        ellipsis: true,
        render(accountName, record) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={record?.goods?.name}
              >
                <div className="fw-semibold cursor-pointer text-truncate">
                  {record?.goods?.name}
                </div>
                <div className="text-second__style">{record?.goods?.code}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate(
              "settlement.settlement_description_goods_and_services"
            )}
            unit={" "}
          />
        ),
        key: "goodsDescription",
        dataIndex: "goodsDescription",
        width: 220,
        ellipsis: true,
        render(goodsDescription, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.goodsDescription} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_brand_or_type")}
            unit={" "}
          />
        ),
        key: "branch",
        dataIndex: "branch",
        ellipsis: true,
        width: 194,
        render(branch: string, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.branch?.name} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, model]
  );

  const itemsCollapse = useMemo<CollapseItem[]>(
    () => [
      {
        key: "1",
        label: translate("settlement.asset_information_title_detail"),
        children: (
          <StandardTable
            className="tab__budget"
            rowKey={"id"}
            columns={columns}
            dataSource={model?.assetItems}
            isDragable={true}
            scroll={{ y: "calc(100vh - 360px)" }}
            idContainer="table-id"
          />
        ),
      },
    ],
    [translate, model]
  );

  return (
    <div className="asset-information-tab-view">
      {!model?.assetItems || model?.assetItems?.length === 0 ? (
        <div className="asset-information-tab-view-items p-y--lg p-x--sm m--sm">
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("settlement.settlement_empty_system")}
          />
        </div>
      ) : (
        <div>
          <AdvancedCollapseView
            items={itemsCollapse}
            className="collapse-container--border"
          />
        </div>
      )}
      {openDrawerAssetDetail && (
        <DrawerAssetDetail
          visible={openDrawerAssetDetail}
          handleClose={handleCloseDrawerAssetDetail}
          recordEdit={recordEdit}
        />
      )}
    </div>
  );
};

export default AssetInformationView;
