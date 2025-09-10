import { useDebounceFn } from "ahooks";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import {
  DEBOUNCE_TIME_300,
  DEFAULT_PAGE_SIZE_OPTION,
} from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import {
  PaymentCreateModel,
  PaymentTypeApplicationFilter,
  PaymentTypeApplicationModel,
} from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import React, { useContext, useEffect } from "react";
import {
  BORDER_TYPE,
  Checkbox,
  InputText,
  Modal,
  MultipleSelect,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { Model, ModelFilter } from "react-3layer-common";
import { useHistory } from "react-router-dom";
import { ColumnProps } from "antd/lib/table";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { EmptyData } from "components";
import { useLocation } from "react-router";

type props = {
  open: boolean;
  handleCancel: () => void;
  handleApply: (data: PaymentTypeApplicationModel[]) => void;
  extendFilterReducer: <TFilter extends ModelFilter>(
    state: TFilter,
    action: FilterAction<TFilter>
  ) => TFilter;
  columns: ColumnProps<PaymentTypeApplicationModel>[];
  title: string;
  searchParams: PaymentTypeApplicationFilter;
  modelRowSelected?: PaymentTypeApplicationModel[];
};
const ModalApplicationType = ({
  open,
  handleCancel,
  handleApply,
  extendFilterReducer,
  columns,
  title,
  searchParams,
  modelRowSelected,
}: props) => {
  const { translate } = useContext<PaymentCreateModel>(
    PaymentCreateHookContext
  );

  const baseFilter = React.useMemo(() => {
    return {
      ...new ModelFilter(),
      pageIndex: 1,
      pageSize: 10,
      ...searchParams,
    };
  }, []);

  const [modelFilter, dispatchFilter, _countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ModelFilter,
      {
        ...new ModelFilter(),
        pageIndex: 1,
        pageSize: 10,
        ...searchParams,
      },
      ["orderBy", "orderType"],
      extendFilterReducer
    );

  const { list, count, handleLoadList } = listService.useList<
    PaymentTypeApplicationModel,
    ModelFilter
  >(
    paymentRepository.getExpenseReversalList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination, handleTableChange } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      handleLoadList({
        baseFilter,
        supplierId: searchParams.supplierId,
        currencyId: searchParams.currencyId,
        ids: searchParams.ids,
        paymentRequestTypeGroup: searchParams.paymentRequestTypeGroup,
        paymentInheritanceType: searchParams?.paymentInheritanceType,
        paymentInheritanceId: searchParams?.paymentInheritanceId,
      });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setSelectedRow(modelRowSelected || []);
      const ids = modelRowSelected?.map((item) => item.id);
      setSelectedRowKeys(ids || []);
    }
    return () => {
      const { pathname } = location;
      history.replace(pathname);
    };
  }, []);

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<PaymentTypeApplicationModel>(
    "checkbox",
    [],
    false
  );

  const handleSelectInvoice = () => {
    if (selectedRow) {
      handleApply(selectedRow);
    }
  };

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleChangeMultipleSelectFilter = React.useCallback(
    (fieldName: string) => {
      return (selectedList: Model) => {
        dispatchFilter({
          type: FilterActionEnum.UPDATE,
          payload: {
            [fieldName]: selectedList,
            pageIndex: 1,
          },
        });
        handleLoadList({ ...modelFilter, [fieldName]: selectedList });
      };
    },
    [dispatchFilter, handleLoadList, modelFilter]
  );

  return (
    <Modal
      open={open}
      title={title}
      size={1100}
      closeIcon={true}
      handleSave={handleSelectInvoice}
      disableButtonApply={selectedRow?.length === 0}
      isShowIconBack={false}
      handleCancel={handleCancel}
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
            <div className="d-flex flex-grow-1  reimbursement-gap">
              <InputText
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                value={modelFilter.search}
                placeHolder={translate(
                  "PM.payment_application_type_modal_search_placeholder"
                )}
                onChange={run}
                isSmall={false}
                type={BORDER_TYPE.BORDERED}
              />
            </div>
            <div>
              <MultipleSelect
                isSmall={false}
                className="reimbursement-w_300 h-100"
                values={modelFilter?.requesterValue || []}
                placeHolder={translate("PM.payment_requester_select_lable")}
                render={(item: any) => item?.email}
                getList={budgetRepository.listMasterUser}
                classFilter={DemoFilter}
                onChange={handleChangeMultipleSelectFilter("requesterValue")}
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
          onChange={handleTableChange}
          rowSelection={{
            ...rowSelection,
            renderCell: (
              value: boolean,
              record: PaymentTypeApplicationModel
            ) => {
              return (
                <div>
                  <Checkbox
                    checked={value}
                    onChange={(e) => {
                      if (e) {
                        setSelectedRowKeys([...selectedRowKeys, record.id]);
                        setSelectedRow([...selectedRow, record]);
                      } else {
                        setSelectedRowKeys(
                          selectedRowKeys.filter((key) => key !== record.id)
                        );
                        setSelectedRow(
                          selectedRow.filter((item) => item.id !== record.id)
                        );
                      }
                    }}
                  />
                </div>
              );
            },
          }}
          scroll={{ y: 394 }}
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

export default ModalApplicationType;
