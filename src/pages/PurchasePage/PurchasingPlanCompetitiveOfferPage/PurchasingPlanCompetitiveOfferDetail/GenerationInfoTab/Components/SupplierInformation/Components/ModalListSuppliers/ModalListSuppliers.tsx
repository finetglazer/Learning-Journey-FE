import { isEmpty, isEqual } from "lodash";
import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION, WIDTH_1100 } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum } from "core/services/service-types";
import {
  PurchasingPlanModel,
  SupplierModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import React, { useEffect } from "react";
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
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { filterService } from "core/services/page-services/filter-service";

import styles from "./ModalListSuppliers.module.scss";
import { ColumnKey } from "models/PurchasingPlan/PurchasingPlanBidder";
import { Model, ModelFilter } from "react-3layer-common";

type props = {
  open: boolean;
  handleCancelModalSupplier: () => void;
  handleApplySupplier: (supplier: SupplierModel[]) => void;
  contextValue: PurchasingPlanModel;
  isModalAddSupplierQuote?: boolean;
  actionQuote?: SupplierQuotationAction;
};

const columnsWidth = {
  taxCode: 144,
  supplierName: 330,
  supplierAddress: 330,
  supplierType: 208,
};

const ModalListSuppliers = ({
  open,
  handleCancelModalSupplier,
  handleApplySupplier,
  contextValue,
  isModalAddSupplierQuote,
  actionQuote,
}: props) => {
  //actionQuote
  // dùng để check lấy list supplier
  const { translate, model } = contextValue;
  const isNegotiationRound = isEqual(
    actionQuote,
    SupplierQuotationAction.AddNegotiationRound
  );

  const getPurchasingPlanId = (isNegotiationRound: boolean) => {
    if (isNegotiationRound) {
      return model.id;
    }
    return undefined;
  };

  const getCategoryIds = () => {
    return contextValue?.model?.purchaseItems?.map((item) => item.category?.id);
  };

  const baseFilter = React.useMemo(() => {
    return {
      ...new ModelFilter(),
      pageIndex: 1,
      pageSize: 10,
      id: getPurchasingPlanId(isNegotiationRound),
      categoryIds: getCategoryIds(),
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ModelFilter, baseFilter);

  const getApi = (isNegotiationRound: boolean) =>
    isNegotiationRound
      ? purchasingPlanRepository.getSupplierNegotiationSupplier
      : purchasingPlanRepository.getSupplierBidding;

  const { list, count, handleLoadList, loadingList } = listService.useList<
    Model,
    ModelFilter
  >(getApi(isNegotiationRound), baseFilter, dispatchFilter, getModelFilter);

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<SupplierModel>("checkbox", [], false);

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
    handleApplySupplier(selectedRow);
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
        },
      });
      handleLoadList({
        search,
        pageIndex: 1,
      });
    },
    {
      wait: 300,
    }
  );

  const renderCell = (value: any) => (
    <LayoutCell>
      <OneLineText value={value} />
    </LayoutCell>
  );

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(() => {
    return [
      {
        title: translate("PL.purchasing_plan_tax_code_supplier"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        width: columnsWidth.taxCode,
        render: renderCell,
      },
      {
        title: translate("PL.purchasing_plan_name_supplier"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: columnsWidth.supplierName,
        render: renderCell,
      },
      {
        title: translate("SL.txt_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        width: columnsWidth.supplierAddress,
        render: renderCell,
      },
      {
        title: translate("PL.bidding.title.supplier_type"),
        key: ColumnKey.SUPPLIER_TYPE,
        dataIndex: ColumnKey.SUPPLIER_TYPE,
        width: columnsWidth.supplierType,
        render: (value) => renderCell(value?.name),
      },
    ];
  }, [isNegotiationRound, translate]);

  useEffect(() => {
    if (open) {
      if (isModalAddSupplierQuote) {
        setSelectedRow(
          model.masterSupplierAddQuote?.listSupplierAddQuote || []
        );
        setSelectedRowKeys(
          (model.masterSupplierAddQuote?.listSupplierAddQuote?.map(
            (item: SupplierModel) => item?.id
          ) || []) as any[]
        );
      } else {
        const selectedRowKeySave: string[] = model.supplierGenerals
          ? model.supplierGenerals?.map((item: SupplierModel) => item?.id)
          : [];
        setSelectedRowKeys(selectedRowKeySave);
        setSelectedRow(
          model.supplierGenerals?.filter((item: SupplierModel) =>
            selectedRowKeySave.includes(item.id)
          ) || []
        );
      }
    }
    handleLoadList();
  }, [
    handleLoadList,
    model.supplierGenerals,
    model.masterSupplierAddQuote,
    open,
    setSelectedRowKeys,
    isModalAddSupplierQuote,
  ]);

  return (
    <Modal
      open={open}
      title={translate("PL.bidding.title.select_supplier")}
      size={WIDTH_1100}
      closeIcon={true}
      isShowIconBack={false}
      disableButtonApply={isEmpty(selectedRowKeys)}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCloseModalSupplier}
      handleSave={handleSelectSupplier}
      className={styles["modal-list-suppliers"]}
      destroyOnClose={true}
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-center d-flex gap-1 flex-column w-100">
            <div className={styles["search-label"]}>
              {translate("PL.txt_search_modal")}
            </div>
            <div className="w-100">
              <InputText
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                placeHolder={translate(
                  "PL.txt_tax_identification_number_placeHolder"
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
          rowKey={"id"}
          loading={loadingList}
          columns={columns}
          dataSource={list}
          isDragable={true}
          rowSelection={{
            ...rowSelection,
            renderCell: (value: boolean, record: SupplierModel) => {
              return (
                <div className="d-flex justify-content-center align-items-center">
                  <Checkbox
                    checked={value}
                    onChange={(e) => {
                      if (e) {
                        setSelectedRowKeys([
                          ...(selectedRowKeys || []),
                          record.id,
                        ]);
                        setSelectedRow([...(selectedRow || []), record]);
                      } else {
                        setSelectedRowKeys(
                          (selectedRowKeys || [])?.filter(
                            (key) => key !== record.id
                          )
                        );
                        setSelectedRow(
                          (selectedRow || [])?.filter(
                            (item) => item.id !== record.id
                          )
                        );
                      }
                    }}
                  />
                </div>
              );
            },
          }}
          scroll={{ y: "calc(100vh - 326px)" }}
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
