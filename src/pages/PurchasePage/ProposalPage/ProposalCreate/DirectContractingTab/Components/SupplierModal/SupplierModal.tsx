import { useDebounceFn } from "ahooks";
import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import classNames from "classnames";
import { DEFAULT_PAGE_SIZE_OPTION, numberConstants } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import {
  SupplierFilter,
  SupplierModel,
  TYPE_OF_SUPPLIER,
} from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { useEffect, useMemo } from "react";
import {
  BORDER_TYPE,
  DEBOUNCE_TIME_300,
  InputText,
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { of } from "rxjs";
import { supplierFilterReducerExtend } from "./SupplierReducer";

const DEFAULT_PAGE = numberConstants.ONE;
const DEFAULT_PAGE_SIZE = numberConstants.TEN;
const MODAL_WIDTH = 1100;
const ICON_SIZE = 16;

interface SupplierModalProperties {
  isModalOpen: boolean;
  selectedSupplier?: SupplierModel;
  handleCancelSupplierModal: () => void;
  handleApplySupplier: (supplier: SupplierModel) => void;
}
const SupplierModal = ({
  isModalOpen,
  selectedSupplier,
  handleCancelSupplierModal,
  handleApplySupplier,
}: SupplierModalProperties) => {
  const [translate] = useTranslation();

  const history = useHistory();

  const baseFilter = useMemo(() => {
    return {
      ...new SupplierFilter(),
      pageIndex: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);

  const columns: ColumnProps<SupplierModel>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title ")}>
              {translate("PM.payment_supplier_table_tax_title")}
            </label>
          </div>
        ),
        key: "taxCode",
        ellipsis: true,
        dataIndex: "taxCode",
        width: 250,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
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
        ellipsis: true,
        width: 250,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
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
        width: 250,
        render: (text) => (
          <LayoutCell>
            <OneLineText useTooltip value={text} />
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
            <OneLineText useTooltip value={text} />
          </LayoutCell>
        ),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, _countFilter, getModelFilter] =
    queryStringService.useQueryString(
      SupplierFilter,
      {
        ...new SupplierFilter(),
        pageIndex: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType"],
      supplierFilterReducerExtend
    );

  const { list, count, loadingList, handleLoadList } = listService.useList<
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

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<SupplierModel>("radio", [], false, "auto");

  const { run } = useDebounceFn(
    (search: string) => {
      const payload = {
        search: search,
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: DEFAULT_PAGE,
      };
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload,
      });
      handleLoadList({ ...payload });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleSelectSupplier = () => {
    if (!isEmpty(selectedRowKeys) && !isEmpty(selectedRow)) {
      const row = selectedRow?.filter((item) =>
        isEqual(item?.id, selectedRowKeys[numberConstants.ZERO])
      );
      handleApplySupplier(row[numberConstants.ZERO]);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      handleLoadList(modelFilter);
      const selectedRowKeySave = [selectedSupplier?.id] as KeyType[];
      if (selectedRowKeySave) {
        setSelectedRowKeys(selectedRowKeySave);
        setSelectedRow([selectedSupplier]);
      }
    } else {
      history.replace(history.location.pathname);
    }
  }, [
    isModalOpen,
    selectedSupplier,
    modelFilter,
    history,
    handleLoadList,
    setSelectedRow,
    setSelectedRowKeys,
  ]);

  return (
    <Modal
      open={isModalOpen}
      title={translate("PM.payment_select_supplier_title")}
      size={MODAL_WIDTH}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleSelectSupplier}
      isShowIconBack={false}
      handleCancel={handleCancelSupplierModal}
      titleButtonCancel={translate(
        "PM.payment_modal_cancle_supplier_button_label"
      )}
      titleButtonApply={translate(
        "PM.payment_modal_select_supplier_button_label"
      )}
    >
      <div className="align-items-center p-b--2xs d-flex gap-3">
        <div className="flex-grow-1 ">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
            value={modelFilter.search}
            placeHolder={translate("PM.payment_search_supplier_input_label")}
            onChange={run}
            isSmall={false}
            type={BORDER_TYPE.BORDERED}
          />
        </div>
        <div>
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
            onChange={(_value, type) => {
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
            value={modelFilter?.supplierType}
            placeHolder={translate(
              "PM.payment_supplier_table_type_placeholder"
            )}
          />
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
          }}
          scroll={{ y: "calc(100vh - 320px)" }}
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

export default SupplierModal;
