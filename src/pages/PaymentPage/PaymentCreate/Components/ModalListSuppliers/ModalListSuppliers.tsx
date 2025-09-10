import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import classNames from "classnames";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum, KeyType } from "core/services/service-types";
import {
  PaymentCreateModel,
  SupplierFilter,
  SupplierModel,
  TYPE_OF_SUPPLIER,
} from "models/Payment";
import React, { useContext, useEffect } from "react";
import {
  BORDER_TYPE,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useHistory } from "react-router-dom";
import { of } from "rxjs";
import { paymentRepository } from "../../../PaymentRepository";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
import { filterReducerExtendSupplier } from "./SupplierReducer";
import { EmptyData } from "components";

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
  const { translate, model, handleChangeSelectField, path } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const baseFilter = React.useMemo(() => {
    return {
      ...new SupplierFilter(),
      pageIndex: 1,
      pageSize: 10,
    };
  }, []);

  const [modelFilter, dispatchFilter, _countFilter, getModelFilter] =
    queryStringService.useQueryString(
      SupplierFilter,
      {
        ...new SupplierFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType"],
      filterReducerExtendSupplier
    );

  const { list, count, handleLoadList, handleResetList } = listService.useList<
    SupplierModel,
    SupplierFilter
  >(
    paymentRepository.getSupplierList,
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
      const selectedRowKeySave = [model.supplier?.id] as KeyType[];
      if (selectedRowKeySave) {
        setSelectedRowKeys(selectedRowKeySave);
      }
    } else {
      history.replace(path, history.location.state);
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
          pageSize: 10,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: search, pageSize: 10, pageIndex: 1 });
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
              {translate("PM.mst_cccd_cmnd")}
            </label>
          </div>
        ),
        key: "taxCode",
        dataIndex: "taxCode",
        width: 180,
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
              {translate("PM.payment_supplier_table_name_title")}
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
              {translate("PM.payment_supplier_table_code_title")}
            </label>
          </div>
        ),
        key: "code",
        dataIndex: "code",
        width: 150,
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
              {translate("PM.payment_supplier_table_type_title")}
            </label>
          </div>
        ),
        key: "type",
        dataIndex: "type",
        width: 140,
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
      isShowIconBack={false}
      handleCancel={handleCancelModalSupplier}
      disableButtonApply={selectedRow?.length === 0}
      titleButtonCancel={translate(
        "PM.payment_modal_cancle_supplier_button_label"
      )}
      titleButtonApply={translate(
        "PM.payment_modal_select_supplier_button_label"
      )}
    >
      <div>
        <div className="p-b--2xs">
          <div className="align-items-end d-flex payment-gap-16">
            <div className="flex-grow-1">
              <InputText
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                value={modelFilter.search}
                placeHolder={translate(
                  "PM.payment_search_supplier_input_label"
                )}
                onChange={run}
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
              />
            </div>
            <div className="payment-w-152">
              <Select
                isRequired
                searchProperty="name"
                searchType=""
                type={BORDER_TYPE.BORDERED}
                valueFilter={{
                  name: "",
                }}
                isSmall={false}
                classFilter={undefined}
                getList={() => of(TYPE_OF_SUPPLIER)}
                onChange={(value, type) => {
                  {
                    handleChangeSelectField({
                      fieldName: "supplierType",
                    })(value, type);
                  }
                  dispatchFilter({
                    type: FilterActionEnum.UPDATE,
                    payload: {
                      supplierType: type,
                    },
                  });
                  handleLoadList({ supplierType: type });
                }}
                isEnumerable={false}
                render={(t) => t?.name}
                value={modelFilter.supplierType}
                placeHolder={translate(
                  "PM.payment_supplier_table_type_placeholder"
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="page-master__table">
        <StandardTable
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
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={573}
              >
                <></>
              </EmptyData>
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
