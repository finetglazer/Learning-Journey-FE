import { isEmpty } from "lodash";
import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  WIDTH_1000,
} from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum } from "core/services/service-types";
import { SupplierFilter } from "models/Payment";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import React, { useContext, useEffect } from "react";
import {
  BORDER_TYPE,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { formatNumber } from "core/helpers/number";
import { filterService } from "core/services/page-services/filter-service";

import styles from "./ModalListSuppliers.module.scss";

type props = {
  open: boolean;
  isLoadingPrincipleContractBySupplier: boolean;
  handleCancelModalSupplier: () => void;
  handleApplySupplier: (supplier: SupplierModel) => void;
};

enum ColumnKey {
  TAX_CODE = "taxCode",
  SUPPLIER_NAME = "supplierName",
  CONTRACT_CODE = "contractCode",
  CONTRACT_NAME = "contractName",
  FULFILL_CATEGORY_QUALITY = "fulfillCategoryQuality",
}

const columnsWidth = {
  taxCode: 140,
  contractCode: 140,
  fulfillCategoryQuality: 180,
};

const ModalListSuppliers = ({
  open,
  isLoadingPrincipleContractBySupplier,
  handleCancelModalSupplier,
  handleApplySupplier,
}: props) => {
  const { translate, model } = useContext<PurchasingPlanModel>(
    PurchasingPlanPrincipleDetailHookContext
  );

  const purchasePlanId = model?.id;
  const supplierPrincipleContracts = model?.supplierPrincipleContracts;

  const baseFilter = React.useMemo(() => {
    return {
      ...new SupplierFilter(),
      pageIndex: 1,
      pageSize: 10,
      purchasePlanId,
      supplierPrincipleContracts,
    };
  }, [purchasePlanId, supplierPrincipleContracts]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(SupplierFilter, baseFilter);

  const { list, count, handleLoadList, loadingList } = listService.useList<
    SupplierModel,
    SupplierFilter
  >(
    purchasingPlanRepository.getListPrincipleContractOfSupplier,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const selectedSuppliers = model.supplierPrincipleContracts?.map(
    (item: SupplierModel) => item?.id
  );
  const listAfterExcludingSelectedSuppliers = list.filter(
    (item) => !selectedSuppliers.includes(item?.id)
  );

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const { rowSelection, selectedRowKeys, selectedRow, setSelectedRowKeys } =
    listService.useRowSelection<SupplierModel>("radio", [], false, "auto");

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
      const row = selectedRow?.filter((item) => item.id === selectedRowKeys[0]);
      handleApplySupplier(row[0]);
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
          search: search,
          pageIndex: 1,
          purchasePlanId,
          supplierPrincipleContracts,
        },
      });
      handleLoadList({
        search: search,
        pageIndex: 1,
        purchasePlanId,
        supplierPrincipleContracts,
      });
    },
    {
      wait: 300,
    }
  );

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_tax_code_supplier"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        width: columnsWidth.taxCode,
        render: (taxCode) => (
          <LayoutCell>
            <OneLineText value={taxCode} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchasing_plan_name_supplier"),
        key: ColumnKey.SUPPLIER_NAME,
        dataIndex: ColumnKey.SUPPLIER_NAME,
        render: (name) => (
          <LayoutCell>
            <OneLineText value={name} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.principle_contract_code_short"),
        key: ColumnKey.CONTRACT_CODE,
        dataIndex: ColumnKey.CONTRACT_CODE,
        width: columnsWidth.contractCode,
        render: (contractCode) => (
          <LayoutCell>
            <OneLineText value={contractCode} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.principle_contract_name_short"),
        key: ColumnKey.CONTRACT_NAME,
        dataIndex: ColumnKey.CONTRACT_NAME,
        render: (contractName) => (
          <LayoutCell>
            <OneLineText value={contractName} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="text-end">
            <label>
              {translate("PL.quantity_types_goods_and_services_met")}
            </label>
          </div>
        ),
        key: ColumnKey.FULFILL_CATEGORY_QUALITY,
        dataIndex: ColumnKey.FULFILL_CATEGORY_QUALITY,
        width: columnsWidth.fulfillCategoryQuality,
        render: (fulfillCategoryQuality) => (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(fulfillCategoryQuality)} />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );

  useEffect(() => {
    if (open) {
      handleLoadList({ supplierPrincipleContracts });
    }
  }, [handleLoadList, open, supplierPrincipleContracts]);

  return (
    <Modal
      open={open}
      title={translate("PL.select_principle_contract")}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      disableButtonApply={
        isEmpty(selectedRowKeys) || isLoadingPrincipleContractBySupplier
      }
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCloseModalSupplier}
      handleSave={handleSelectSupplier}
      className={styles["modal-list-suppliers"]}
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-center d-flex gap-3">
            <div className="flex-grow-1 pt-1">
              <InputText
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                placeHolder={translate(
                  "PL.placeholder_search_supplier_principle_contract"
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
          rowKey={TABLE_ROW_KEY}
          loading={loadingList}
          columns={columns}
          dataSource={listAfterExcludingSelectedSuppliers}
          isDragable={true}
          rowSelection={{
            ...rowSelection,
          }}
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
