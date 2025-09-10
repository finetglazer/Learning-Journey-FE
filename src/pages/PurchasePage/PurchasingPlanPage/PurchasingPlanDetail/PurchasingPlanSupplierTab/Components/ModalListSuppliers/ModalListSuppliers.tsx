import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import classNames from "classnames";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum, KeyType } from "core/services/service-types";
import { SupplierFilter, SupplierModel } from "models/Payment";
import { IPurchaseRequest, PurchasingPlanModel } from "models/PurchasingPlan";
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
import { useHistory, useLocation } from "react-router-dom";
import { PurchasingPlanDetailHookContext } from "../../../PurchasingPlanDetailHook";
import { filterReducerExtendSupplier } from "./SupplierReducer";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";

type props = {
  open: boolean;
  handleCancelModalSupplier: () => void;
  handleApplySupplier: (supplier: any) => void;
};
const ModalListSuppliers = ({
  open,
  handleCancelModalSupplier,
  handleApplySupplier,
}: props) => {
  const { translate, model, path } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );

  const location = useLocation();

  const purchaseRequest = location.state as IPurchaseRequest;
  const categoryId =
    model.purchaseItems?.map((item) => item?.category?.id) || [];

  const baseFilter = React.useMemo(() => {
    return {
      ...new SupplierFilter(),
      pageIndex: 1,
      pageSize: 10,
      categoryIds: categoryId,
    };
  }, []);

  const [modelFilter, dispatchFilter, _countFilter, getModelFilter] =
    queryStringService.useQueryString(
      SupplierFilter,
      {
        ...new SupplierFilter(),
        pageIndex: 1,
        pageSize: 10,
        categoryIds: categoryId,
      },
      ["orderBy", "orderType"],
      filterReducerExtendSupplier
    );

  const { list, count, handleLoadList, loadingList } = listService.useList<
    SupplierModel,
    SupplierFilter
  >(
    purchasingPlanRepository.getSupplierList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const history = useHistory();

  useEffect(() => {
    if (open) {
      handleLoadList(modelFilter);
      const selectedRowKeySave: KeyType[] = model.supplier?.id
        ? [model.supplier.id]
        : model?.listSupplier?.[0]?.supplierId
        ? [model.listSupplier?.[0]?.supplierId]
        : [];
      if (selectedRowKeySave) {
        setSelectedRowKeys(selectedRowKeySave);
      }
    } else {
      history.replace({ pathname: path, state: purchaseRequest });
    }
  }, [open]);

  const { rowSelection, selectedRowKeys, selectedRow, setSelectedRowKeys } =
    listService.useRowSelection<SupplierModel>("radio", [], false, "auto");

  const handleSelectSupplier = () => {
    if (selectedRowKeys.length > 0) {
      if (selectedRow && selectedRow.length > 0) {
        const row = selectedRow?.filter(
          (item) => item.id === selectedRowKeys[0]
        );
        handleApplySupplier(row[0]);
      }
    }
  };

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          categoryIds: categoryId,
          pageSize: 10,
          pageIndex: 1,
        },
      });
      handleLoadList({
        categoryIds: categoryId,
        search: search,
        pageSize: 10,
        pageIndex: 1,
      });
    },
    {
      wait: 300,
    }
  );

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title ")}>
              {translate("PL.purchasing_plan_tax_code_supplier")}
            </label>
          </div>
        ),
        key: "taxCode",
        dataIndex: "taxCode",
        width: 144,
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_name_supplier")}
            </label>
          </div>
        ),
        key: "name",
        dataIndex: "name",
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_supplier_address")}
            </label>
          </div>
        ),
        key: "address",
        dataIndex: "address",
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PL.purchasing_plan_type_supplier")}
            </label>
          </div>
        ),
        key: "type",
        dataIndex: "type",
        width: 208,
        render: (text) => (
          <LayoutCell>
            <OneLineText value={text} />
          </LayoutCell>
        ),
      },
    ],
    [model, translate]
  );

  return (
    <Modal
      open={open}
      title={translate("PM.payment_select_supplier_title")}
      size={1100}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleSelectSupplier}
      disableButtonApply={selectedRow?.length === 0}
      isShowIconBack={false}
      handleCancel={handleCancelModalSupplier}
      titleButtonCancel={translate(
        "PM.payment_modal_cancle_supplier_button_label"
      )}
      titleButtonApply={translate(
        "PM.payment_modal_select_supplier_button_label"
      )}
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-center d-flex gap-3">
            <div className="flex-grow-1 pt-1">
              <InputText
                label={translate("CM.btn_search")}
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                value={modelFilter.search}
                placeHolder={translate(
                  "PL.purchasing_plan_search_modal_supplier"
                )}
                onChange={run}
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="page-master__table">
        <StandardTable
          loading={loadingList}
          rowKey={"id"}
          columns={columns}
          dataSource={list}
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
