import { ColumnProps } from "antd/lib/table";
import { IcTrashRed } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { STANDARD_DATE_FORMAT_SLASH, TABLE_ROW_KEY } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { OptionBaseModel } from "models/Common/Common";
import {
  AssetItemModel,
  OrganizationProjectSettlement,
  ProjectSettlementAsset,
  TypeSettlementEnum,
  UserProjectSettlement,
} from "models/ProjectSettlement";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { useCheckState } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useCheckState";
import { OrderInformationDrawer } from "pages/PurchasePage/ProjectSettlement/Components/OrderInformationDrawer/OrderInformationDrawer";
import { useOrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import { useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./AssetTableOrder.module.scss";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { Branch } from "models/Settlement";

interface AssetTableOrderProps {
  data: ProjectSettlementAsset;
  index: number;
}

enum ColumnKey {
  CODE_ASSET = "code",
  GOOG_SERVICE = "goods",
  GOOD_AND_SERVICE_DESCRIPTION = "goodsDescription",
  GOOD_AND_SERVICE_NOTE = "goodsNote",
  BRANCH = "branch",
  ORIGINAL_PRICE = "originalCost",
  CLASSIFY = "classify",
  DEPRECIATION_CALCULATION = "depreciationMonths",
  DATE_OF_USE = "usageStartDate",
  DEPRECIATION_START_DATE = "depreciationStartDate",
  RECEIVED_UNIT = "ownerOrganization",
  RECIPIENT_NAMED = "ownerUser",
  ACTION = "id",
}

const columnsWidth = {
  typeSettlement: 124,
  codeAsset: 120,
  googService: 260,
  goodAndServiceDescription: 220,
  originalPrice: 160,
  classify: 160,
  depreciationCalculation: 172,
  dateOfUse: 160,
  depreciationStartDate: 204,
  receivedUnit: 200,
  recipientNamed: 180,
  overflowMenu: 50,
};

const AssetTableOrder = ({ data, index }: AssetTableOrderProps) => {
  const [translate] = useTranslation();

  const { state } = useCheckState();

  const {
    onSave,
    setAssetItemSelected,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
    handleDeleteOrderForm,
  } = useOrderInformationContext();

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const TableTitle = (value: string) => {
    return <div className="p-b--xs">{value}</div>;
  };

  const getTypeSettlementLabel = (type: number): string => {
    switch (type) {
      case TypeSettlementEnum.NEW_PURCHASE:
        return translate("PS.txt_buy_new");
      case TypeSettlementEnum.UPGRADE:
        return translate("PS.txt_upgrade");
      default:
        return;
    }
  };

  const columns: ColumnProps<AssetItemModel>[] = useMemo(
    () => [
      {
        title: TableTitle(translate("PS.txt_table_asset_type_settlement")),
        ellipsis: true,
        width: columnsWidth.typeSettlement,
        render(value: OptionBaseModel) {
          const typeLabel = getTypeSettlementLabel(value?.type?.code);
          return (
            <LayoutCell>
              <OneLineText value={typeLabel} />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(translate("PP.asset_name")),
        key: ColumnKey.CODE_ASSET,
        dataIndex: ColumnKey.CODE_ASSET,
        ellipsis: true,
        width: columnsWidth.googService,
        render(code: string, record) {
          return (
            <LayoutCell>
              <button
                onClick={() => setAssetItemSelected(record)}
                className={styles["table-btn"]}
              >
                <TwoLineText
                  valueLine1={record?.name}
                  valueLine2={record?.code}
                  classNameSecondLine="text-neutral-7"
                  classNameFirstLine="text-table-content-primary"
                />
              </button>
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
          <UnitTitle
            title={translate("RG.txt_original_price")}
            className="text-end"
          />
        ),
        key: ColumnKey.ORIGINAL_PRICE,
        dataIndex: ColumnKey.ORIGINAL_PRICE,
        ellipsis: true,
        width: columnsWidth.originalPrice,
        render(originalCost: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(originalCost)} />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(
          translate("PM.payment_supplier_table_type_placeholder")
        ),
        key: ColumnKey.CLASSIFY,
        dataIndex: ColumnKey.CLASSIFY,
        ellipsis: true,
        width: columnsWidth.classify,
        render(classify: string) {
          return (
            <LayoutCell>
              <OneLineText value={classify} />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(
          translate("PS.txt_table_asset_depreciation_calculation")
        ),
        key: ColumnKey.DEPRECIATION_CALCULATION,
        dataIndex: ColumnKey.DEPRECIATION_CALCULATION,
        ellipsis: true,
        width: columnsWidth.depreciationCalculation,
        render(depreciationMonths: string) {
          return (
            <LayoutCell>
              <OneLineText value={depreciationMonths} />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(translate("PS.txt_table_asset_date_use")),
        key: ColumnKey.DATE_OF_USE,
        dataIndex: ColumnKey.DATE_OF_USE,
        ellipsis: true,
        width: columnsWidth.dateOfUse,
        render(usageStartDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(usageStartDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(
          translate("PS.txt_table_asset_depreciation_start_date")
        ),
        key: ColumnKey.DEPRECIATION_START_DATE,
        dataIndex: ColumnKey.DEPRECIATION_START_DATE,
        ellipsis: true,
        width: columnsWidth.depreciationStartDate,
        render(depreciationStartDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(
                  depreciationStartDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(translate("AC.txt_receiving_unit_and_in_charge")),
        key: ColumnKey.RECEIVED_UNIT,
        dataIndex: ColumnKey.RECEIVED_UNIT,
        ellipsis: true,
        width: columnsWidth.receivedUnit,
        render(ownerOrganization: OrganizationProjectSettlement) {
          return (
            <LayoutCell>
              <OneLineText value={ownerOrganization?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(translate("AC.txt_receiver_and_in_charge")),
        key: ColumnKey.RECIPIENT_NAMED,
        dataIndex: ColumnKey.RECIPIENT_NAMED,
        ellipsis: true,
        width: columnsWidth.recipientNamed,
        render(ownerUser: UserProjectSettlement) {
          return (
            <LayoutCell>
              <OneLineText value={`${ownerUser?.email} - ${ownerUser?.name}`} />
            </LayoutCell>
          );
        },
      },

      {
        title: TableTitle(translate("PP.text_goods_services")),
        key: ColumnKey.GOOG_SERVICE,
        dataIndex: ColumnKey.GOOG_SERVICE,
        ellipsis: true,
        width: columnsWidth.googService,
        render(code: string, record) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={record?.goods?.name}
                valueLine2={record?.goods?.code}
                classNameSecondLine="text-neutral-7"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(
          translate("settlement.settlement_description_goods_and_services")
        ),
        key: ColumnKey.GOOD_AND_SERVICE_DESCRIPTION,
        dataIndex: ColumnKey.GOOD_AND_SERVICE_DESCRIPTION,
        ellipsis: true,
        width: columnsWidth.goodAndServiceDescription,
        render(classify: string) {
          return (
            <LayoutCell>
              <OneLineText value={classify} />
            </LayoutCell>
          );
        },
      },
      {
        title: TableTitle(translate("settlement.settlement_brand_or_type")),
        key: ColumnKey.BRANCH,
        dataIndex: ColumnKey.BRANCH,
        ellipsis: true,
        width: columnsWidth.goodAndServiceDescription,
        render(brand: Branch) {
          return (
            <LayoutCell>
              <OneLineText value={brand?.name} />
            </LayoutCell>
          );
        },
      },

      // Menu action
      {
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: columnsWidth.overflowMenu,
        render(id: string, record: AssetItemModel) {
          const isHidden = record?.isCreate && state !== "DETAIL";
          return (
            <>
              {isHidden && (
                <LayoutCell>
                  <button
                    className={styles["icon-row__settlement"]}
                    onClick={() => {
                      setSelectedRecordId(id);
                      setIsOpenModelConfirmDeleteRow(true);
                    }}
                  >
                    <img src={IcTrashRed} alt="" />
                  </button>
                </LayoutCell>
              )}
            </>
          );
        },
      },
    ],
    [
      getTypeSettlementLabel,
      setAssetItemSelected,
      setIsOpenModelConfirmDeleteRow,
      state,
      translate,
    ]
  );

  return (
    <div className={styles["asset-table_container"]}>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={data?.assetItems || []}
        scroll={{ x: 2016 }}
        isDragable
      />
      <OrderInformationDrawer
        onSave={() => onSave(index)}
        onDelete={handleDeleteOrderForm}
      />

      {isOpenModelConfirmDeleteRow && (
        <DeleteRecordModal
          open
          loading={undefined}
          handleConfirm={() => {
            if (selectedRecordId) {
              handleDeleteOrderForm([selectedRecordId]);
            }
          }}
          handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
          title={translate("PS.txt_model_delete_settlement")}
          content={translate("PS.txt_model_delete_content_settlement")}
        />
      )}
    </div>
  );
};

export default AssetTableOrder;
