import { useDebounceFn } from "ahooks";
import { IcEmptySearchSvg, IcSearchSVG } from "assets/icons";
import EmptyData from "components/EmptyData/EmptyData";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum } from "core/services/service-types";
import _truncate from "lodash/truncate";
import { InvoiceModel, PaymentCreateModel } from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { useContext, useEffect, useMemo } from "react";
import { ModelFilter } from "react-3layer-common";
import {
  BORDER_TYPE,
  Checkbox,
  InputText,
  Modal,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useHistory } from "react-router-dom";
import InvoicesModalColumn from "../InvoicesModalColumn/InvoicesModalColumn";
import { filterInvoiceExtend } from "./InvoicesReducer";
import { useLocation } from "react-router";

type props = {
  open: boolean;
  handleCancel: () => void;
  handleApply: (data: InvoiceModel[]) => void;
};
const InvoicesModal = ({ open, handleCancel, handleApply }: props) => {
  const { translate, model, formatNumberToCurrency, initSearchInvoiceParams } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const currentCurrencyCode = useMemo(
    () => model?.currency?.code,
    [model?.currency?.code]
  );

  const baseFilter = useMemo(() => {
    return {
      ...new ModelFilter(),
      pageIndex: 1,
      pageSize: 10,
      currencyCode: currentCurrencyCode,
      taxCode: model?.supplier?.taxCode,
      ...initSearchInvoiceParams,
    };
  }, [initSearchInvoiceParams, currentCurrencyCode, model?.supplier?.taxCode]);

  const [modelFilter, dispatchFilter, _countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ModelFilter,
      { ...baseFilter },
      ["orderBy", "orderType"],
      filterInvoiceExtend
    );

  const { list, count, handleLoadList } = listService.useList<
    InvoiceModel,
    ModelFilter
  >(
    paymentRepository.getInvoiceList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
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
  } = listService.useRowSelection<InvoiceModel>("checkbox", [], false);

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
      wait: 300,
    }
  );

  useEffect(() => {
    if (open) {
      handleLoadList(baseFilter);
    }
  }, [open]);

  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    if (open) {
      setSelectedRow(model?.invoices || []);
      const ids = model?.invoices?.map((item) => item.id);
      setSelectedRowKeys(ids || []);
    }
    return () => {
      const { pathname } = location;
      history.replace(pathname);
    };
  }, []);

  return (
    <Modal
      open={open}
      title={translate("PM.payment_title_modal_add_invoice")}
      size={1100}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleSelectInvoice}
      isShowIconBack={false}
      handleCancel={handleCancel}
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
          <div className="align-items-center d-flex gap-3">
            <div className="flex-grow-1 pt-1">
              <InputText
                prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                value={modelFilter.search}
                placeHolder={translate("PM.payment_search_invoice_placeholder")}
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
          rowKey={"id"}
          className="payment-custom_table"
          columns={InvoicesModalColumn({
            translate,
            currentCurrencyCode,
            _truncate,
            formatNumberToCurrency,
          })}
          dataSource={list}
          isDragable={true}
          onChange={handleTableChange}
          rowSelection={{
            ...rowSelection,
            renderCell: (value: boolean, record: InvoiceModel) => {
              return (
                <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
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
          scroll={{ y: 390 }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={576}
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

export default InvoicesModal;
