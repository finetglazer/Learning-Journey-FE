import { useContext, useMemo } from "react";
import {
  DEBOUNCE_TIME_300,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  Select,
  StandardTable,
} from "react-components-design-system";
import { Model } from "react-3layer-common";
import { ColumnProps } from "antd/lib/table";
import { useDebounceFn } from "ahooks";

import {
  DEFAULT_PAGE_SIZE_OPTION,
  numberConstants,
  TABLE_ROW_KEY,
  WIDTH_1000,
} from "core/config/consts";
import { trimText } from "core/helpers/text";
import { FilterActionEnum } from "core/services/service-types";
import { formatNumber } from "core/helpers/number";
import { useAddGoodsServicesModalHook } from "./AddGoodsServicesModalHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import CommonFilter from "models/CommonFilter";
import { ContractDetailModel, GoodsServicesModalFilter } from "models/Contract";
import { GoodsServices } from "models/PurchaseRequest";

import { IcSearchSVG } from "assets/icons";
import styles from "./AddGoodsServicesModal.module.scss";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { UnitTitle } from "components/UnitTitle/UnitTitle";

const ICON_SIZE = 12;

enum ColumnKey {
  NAME = "name",
  UNIT = "unit",
  UNIT_PRICE = "unitPrice",
  QUANTITY = "quantity",
  TOTAL_AMOUNT = "totalAmount",
}

const columnsWidth = {
  unit: 120,
  unitPrice: 140,
  quantity: 140,
  totalAmount: 160,
};

const AddGoodsServicesModal = () => {
  const { model: modelMaster } = useContext<ContractDetailModel>(
    ContractDetailHookContext
  );

  const {
    count,
    handlePagination,
    translate,
    modelFilter,
    goodsServicesList,
    initialGoodsServicesList,
    loadingGoodsServicesList,
    rowSelection,
    isOpenGoodsServicesModal,
    isFirstSearchGoodsServices,
    purchasePlanId,
    supplierId,
    setIsFirstSearchGoodsServices,
    dispatchGoodsServicesModalFilter,
    handleLoadGoodsServicesList,
    handleCloseGoodsServicesModal,
    handleAddGoodsServices,
  } = useAddGoodsServicesModalHook();

  const { run } = useDebounceFn(
    (search: string) => {
      if (isFirstSearchGoodsServices) {
        initialGoodsServicesList.current = goodsServicesList;
        setIsFirstSearchGoodsServices(false);
      }
      const trimmedText = trimText(search);
      dispatchGoodsServicesModalFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadGoodsServicesList({
        search: trimmedText,
        purchasePlanId,
        supplierId,
        pageIndex: numberConstants.ONE,
      });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleSelectPurchaseCategory = (
    value: GoodsServicesModalFilter["purchaseCategory"]
  ) => {
    dispatchGoodsServicesModalFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        purchaseCategory: value,
      },
    });

    handleLoadGoodsServicesList({
      purchaseCategory: value,
      purchasePlanId,
      supplierId,
    });
  };

  const goodsServicesColumns: ColumnProps<GoodsServices>[] = useMemo(
    () => [
      {
        title: translate("PR.goods_services"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        render(_, rowData: GoodsServices) {
          return (
            <LayoutCell>
              <div className={styles["goods-services-cell"]}>
                <OneLineText value={rowData?.name} />
                <OneLineText
                  className={styles["goods-services-code"]}
                  value={rowData?.code}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PP.text_unit"),
        key: ColumnKey.UNIT,
        dataIndex: ColumnKey.UNIT,
        ellipsis: true,
        width: columnsWidth.unit,
        render(unit: GoodsServices["unit"]) {
          return (
            <LayoutCell>
              <OneLineText value={unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PP.text_unit_price"),
        key: ColumnKey.UNIT_PRICE,
        dataIndex: ColumnKey.UNIT_PRICE,
        ellipsis: true,
        width: columnsWidth.unitPrice,
        render(unitPrice: string) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(unitPrice)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PP.text_amount"),
        key: ColumnKey.QUANTITY,
        dataIndex: ColumnKey.QUANTITY,
        ellipsis: true,
        width: columnsWidth.quantity,
        render(quantity: string) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(quantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="unit-title__container">
            <span className="text-title">{translate("PP.text_total")}</span>
            <span className="text-unit">{translate("CT.currency.vnd")}</span>
          </div>
        ),
        key: ColumnKey.TOTAL_AMOUNT,
        dataIndex: ColumnKey.TOTAL_AMOUNT,
        ellipsis: true,
        width: columnsWidth.totalAmount,
        align: "right",
        render(totalAmount: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(totalAmount)} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const goodsServicesColumnsPrinciple: ColumnProps<GoodsServices>[] = useMemo(
    () => [
      {
        title: translate("PR.goods_services"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        render(_, rowData: GoodsServices) {
          return (
            <LayoutCell>
              <div className={styles["goods-services-cell"]}>
                <OneLineText value={rowData?.name} />
                <OneLineText
                  className={styles["goods-services-code"]}
                  value={rowData?.code}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PP.text_unit"),
        key: ColumnKey.UNIT,
        dataIndex: ColumnKey.UNIT,
        ellipsis: true,
        width: 180,
        render(unit: GoodsServices["unit"]) {
          return (
            <LayoutCell>
              <OneLineText value={unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PP.text_unit_price")}
            unit={modelMaster?.currency}
          />
        ),
        key: ColumnKey.UNIT_PRICE,
        dataIndex: ColumnKey.UNIT_PRICE,
        ellipsis: true,
        width: 180,
        render(unitPrice: string) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(unitPrice)} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, modelMaster]
  );

  return (
    <Modal
      open={isOpenGoodsServicesModal}
      maskClosable={false}
      isShowIconBack={false}
      size={WIDTH_1000}
      title={translate("CT.create_contract.table.add_goods_services")}
      titleButtonApply={translate("CM.txt_select")}
      titleButtonCancel={translate("CM.btn_close")}
      className={styles["add-goods-services-modal"]}
      handleSave={handleAddGoodsServices}
      handleCancel={handleCloseGoodsServicesModal}
    >
      <div className={styles["add-goods-services-wrapper"]}>
        <div className={styles["filter-fields-group"]}>
          <InputText
            prefix={
              <img src={IcSearchSVG} alt="Search Icon" width={ICON_SIZE} />
            }
            placeHolder={translate(
              "CT.create_contract.placeholder.search_goods_services"
            )}
            type={numberConstants.ONE}
            className={styles["search-field"]}
            value={modelFilter.search}
            onChange={run}
          />
          <Select
            placeHolder={translate("PP.modal_plh_category")}
            getList={(filter) =>
              contractRepository.getPurchaseCategoryList(filter, purchasePlanId)
            }
            classFilter={CommonFilter}
            isSearch
            render={(item) => (item ? `${item?.name}` : "")}
            searchProperty="name"
            appendToBody
            isEnumerable={false}
            className={styles["select-field"]}
            value={modelFilter?.purchaseCategory}
            onChange={(_id: number, value: Model) =>
              handleSelectPurchaseCategory(
                value as GoodsServicesModalFilter["purchaseCategory"]
              )
            }
          />
        </div>
        <div className="page-master__table">
          <StandardTable
            rowKey={TABLE_ROW_KEY}
            isDragable
            loading={loadingGoodsServicesList}
            columns={
              modelMaster?.isPrinciple
                ? goodsServicesColumnsPrinciple
                : goodsServicesColumns
            }
            dataSource={goodsServicesList}
            rowSelection={rowSelection}
            className={styles["goods-services-modal-table"]}
            scroll={{ y: "calc(100vh - 500px)" }}
            locale={{
              emptyText: (
                <div className={styles["empty-goods-services"]}>
                  {translate("CM.txt_search_no_data")}
                </div>
              ),
            }}
          />
          <Pagination
            key={modelFilter.pageSize}
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddGoodsServicesModal;
