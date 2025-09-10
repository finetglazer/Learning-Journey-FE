import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION, WIDTH_1000 } from "core/config/consts";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum } from "core/services/service-types";
import { difference, differenceBy, isEmpty, uniqBy } from "lodash";
import { OptionNoEnumModel, SupplierModel } from "models/PurchasingPlan";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useCallback, useEffect, useMemo } from "react";
import {
  BORDER_TYPE,
  Checkbox,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";

import { TableRowSelection } from "antd/lib/table/interface";
import {
  ColumnKey,
  SupplierGenerals,
} from "models/PurchasingPlan/PurchasingPlanBidder";
import { Model, ModelFilter } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import styles from "./ModalListSuppliers.module.scss";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";

type props = {
  open: boolean;
  supplierGenerals: SupplierGenerals[];
  handleCancelModalSupplier: () => void;
  handleApplySupplier: (supplier: SupplierModel[]) => void;
  contextValue:
    | PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
    | PurchasePlanAdjustBidDetailHookContextProps;
  isNegotiating?: boolean;
};

const ModalListSuppliers = ({
  open,
  supplierGenerals,
  handleCancelModalSupplier,
  handleApplySupplier,
  contextValue,
  isNegotiating = false,
}: props) => {
  const [translate] = useTranslation();

  const getCategoryIds = useCallback(() => {
    return (
      contextValue?.model?.categories?.map(
        (item: OptionNoEnumModel) => item.id
      ) || []
    );
  }, [contextValue?.model?.categories]);

  const baseFilter = useMemo(() => {
    return {
      ...new ModelFilter(),
      categoryIds: isNegotiating ? null : getCategoryIds(),
      id: contextValue?.model?.originalPurchasePlanId,
      pageIndex: 1,
      pageSize: 10,
    };
  }, [
    contextValue?.model?.originalPurchasePlanId,
    getCategoryIds,
    isNegotiating,
  ]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ModelFilter, baseFilter);

  const { list, count, handleLoadList, loadingList } = listService.useList<
    Model,
    ModelFilter
  >(
    isNegotiating
      ? purchasingPlanRepository.getSupplierNegotiationSupplier
      : purchasingPlanRepository.getSupplierBidding,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const listHaveSupplierId = useMemo(() => {
    return list.map((item) => {
      const result = {
        ...item,
        id: item.id,
        supplierId: item.supplierId || item.id,
      };
      delete result.id;
      return result;
    });
  }, [list]);

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRow,
    setSelectedRowKeys,
  } = listService.useRowSelection<SupplierModel>(
    "checkbox",
    [],
    false,
    "auto",
    true
  );

  const handleResetFilter = () => {
    setSelectedRowKeys([]);
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...baseFilter,
        pageSize: modelFilter.pageSize,
      },
    });
  };

  const handleSelectSupplier = () => {
    if (!isEmpty(selectedRowKeys) && !isEmpty(selectedRow)) {
      handleApplySupplier(selectedRow);
    }

    handleResetFilter();
  };

  const handleCloseModalSupplier = () => {
    handleResetFilter();
    handleCancelModalSupplier();
  };

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search,
          pageIndex: 1,
          categoryIds: getCategoryIds(),
        },
      });
      handleLoadList({
        search,
        pageIndex: 1,
        categoryIds: getCategoryIds(),
      });
    },
    {
      wait: 300,
    }
  );

  const columns: ColumnProps<SupplierModel>[] = useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_tax_code_supplier"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        width: 144,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchasing_plan_name_supplier"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: "address",
        dataIndex: "address",
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.bidding.title.supplier_type"),
        key: ColumnKey.SUPPLIER_TYPE,
        dataIndex: ColumnKey.SUPPLIER_TYPE,
        width: 208,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value?.name} />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );

  const rowSelections: TableRowSelection<SupplierModel> = {
    ...rowSelection,
    renderCell: (value: boolean, record: SupplierModel) => {
      return (
        <Checkbox
          checked={value}
          onChange={(e) => {
            const listIdSelected = e
              ? [...selectedRowKeys, record?.supplierId]
              : difference(selectedRowKeys, [record?.supplierId]);

            const listSelected = e
              ? uniqBy([...selectedRow, record], "supplierId")
              : differenceBy(selectedRow, [record], "supplierId");

            setSelectedRowKeys(listIdSelected);
            setSelectedRow(listSelected);
          }}
        />
      );
    },
  };

  useEffect(() => {
    if (open && getCategoryIds()) {
      handleLoadList({
        categoryIds: isNegotiating ? null : getCategoryIds(),
        id: contextValue?.model?.originalPurchasePlanId,
      });
      const selectedRowKeySave: string[] =
        supplierGenerals?.map((item: SupplierModel) => item.supplierId) ?? [];
      const selectedRowSave: SupplierModel[] = supplierGenerals ?? [];

      if (selectedRowKeySave) {
        setSelectedRowKeys(selectedRowKeySave);
        setSelectedRow(selectedRowSave);
      }
    }
  }, [
    handleLoadList,
    supplierGenerals,
    open,
    setSelectedRow,
    setSelectedRowKeys,
    getCategoryIds,
    isNegotiating,
    contextValue?.model?.originalPurchasePlanId,
  ]);

  return (
    <Modal
      open={open}
      title={translate("PL.bidding.title.select_supplier")}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      disableButtonApply={isEmpty(selectedRowKeys)}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCloseModalSupplier}
      handleSave={handleSelectSupplier}
      className={styles["modal-list-suppliers"]}
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-center d-flex gap-3">
            <div className="flex-grow-1">
              <InputText
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                placeHolder={translate(
                  "PL.bidding.placeholder.search_supplier"
                )}
                value={modelFilter.search}
                onChange={run}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="page-master__table">
        <StandardTable
          rowKey={"supplierId"}
          loading={loadingList}
          columns={columns}
          dataSource={listHaveSupplierId}
          isDragable={true}
          rowSelection={rowSelections}
          scroll={{ y: 414 }}
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={500}
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
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

export default ModalListSuppliers;
