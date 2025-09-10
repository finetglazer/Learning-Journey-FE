import { Tooltip } from "antd";
import type { ColumnProps } from "antd/es/table";
import { emptyCloudIcon, IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_1100,
  WIDTH_400,
} from "core/config/consts";
import { formatCurrencyByLocale } from "core/helpers/currency";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { isEmpty, isNil } from "lodash";
import { ContractToAppendixModel } from "models/ContractAnnex";
import SelectionSettlementFilter from "pages/PurchasePage/ContractPage/ContractAnnex/Components/Modal/ModalSelectionContractAnnex/SelectionSettlementFilter/SelectionSettlementFilter";
import { useSelectionSettlementContractAnnexModalHooks } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/Modal/ModalSelectionContractAnnex/useSelectionSettlementContractAnnexModalHooks";
import { useMemo } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import "./ModalSelectionContractAnnex.scss";

const SIZE_X_TABLE = 1178;
const HEIGHT_TABLE = 530;

interface ModalSelectionContractAnnexProps {
  onClose: () => void;
}

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  SUPPLIER = "supplier",
  EXPENSE = "costItem",
  TOTAL_VALUE = "contractValue",
  EFFECTIVE_DATE = "effectiveDate",
  CREATED_DATE = "createdDate",
  CREATE_USER = "createUser",
}

const columnsWidth = {
  code: 132,
  supplier: 156,
  expense: 142,
  total: 145,
  effectiveDate: 110,
  createdDate: 96,
  createUser: 148,
};

function ModalSelectionContractAnnex({
  onClose,
}: ModalSelectionContractAnnexProps) {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    translate,
    handleLoadList,
    dispatchFilter,
    handleSelected,
    handleTableChange,
    handlePagination,
  } = useSelectionSettlementContractAnnexModalHooks();

  const columns: ColumnProps<ContractToAppendixModel>[] = useMemo(
    () => [
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_code_contract_po")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: columnsWidth.code,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} className="line-text" />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_name_contract_po")}
            unit={translate("CA.list.title.contract_number")}
          />
        ),
        key: ColumnKey.NAME,
        render(value: ContractToAppendixModel) {
          return (
            <LayoutCell>
              <div className="box-two__line">
                <OneLineText value={value?.name} className="line-calm" />
                <OneLineText
                  value={value?.contractNo}
                  className="line-text__two line-calm"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("AC.txt_supplier")}
            unit={translate("AC.txt_contract_type")}
          />
        ),
        key: ColumnKey.SUPPLIER,
        width: columnsWidth.supplier,
        render(value: ContractToAppendixModel) {
          return (
            <LayoutCell>
              <div className="box-two__line">
                <OneLineText
                  value={value?.contractSupplierName}
                  className="line-one"
                />
                <OneLineText
                  value={value?.contractType?.name}
                  className="line-text__two line-one"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_expense_item")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.EXPENSE,
        dataIndex: ColumnKey.EXPENSE,
        width: columnsWidth.expense,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} className="line-text" />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_total_value")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.TOTAL_VALUE,
        dataIndex: ColumnKey.TOTAL_VALUE,
        align: "right",
        width: columnsWidth.total,
        render(value: number, record) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrencyByLocale(value, record?.currency)}
                className="line-text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_effective_date")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.EFFECTIVE_DATE,
        dataIndex: ColumnKey.EFFECTIVE_DATE,
        width: columnsWidth.effectiveDate,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
                className="line-text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_date_create")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.CREATED_DATE,
        dataIndex: ColumnKey.CREATED_DATE,
        width: columnsWidth.createdDate,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
                className="line-text"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("CA.txt_person_create")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.CREATE_USER,
        dataIndex: ColumnKey.CREATE_USER,
        width: columnsWidth.createUser,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Tooltip
                placement="top"
                title={
                  <span>
                    {value} - {record?.createFullname}
                  </span>
                }
              >
                <span className="line-clamp-1 line-text">{value}</span>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const isEmptyList = useMemo(() => isEmpty(list), [list]);
  const isFiltering = !isEmpty(modelFilter);

  return (
    <Modal
      open
      title={translate("CA.txt_select_contract_annex")}
      isShowIconBack={false}
      size={WIDTH_1100}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={onClose}
      handleSave={handleSelected}
      disableButtonApply={isNil(selectedRowKeys?.[numberConstants.ZERO])}
      closeIcon
    >
      <SelectionSettlementFilter
        modelFilter={modelFilter}
        dispatchFilter={dispatchFilter}
        handleLoadList={handleLoadList}
      />
      <div className="page-master__table">
        <div className="modal-select__container">
          <StandardTable
            loading={loadingList}
            rowKey={TABLE_ROW_KEY}
            rowSelection={rowSelection}
            onChange={handleTableChange}
            columns={columns}
            dataSource={list}
            rowClassName="cost-allocation-row"
            scroll={{ x: SIZE_X_TABLE, y: WIDTH_400 }}
            className="cost-allocation-row_selection"
            locale={{
              emptyText: isEmptyList ? (
                isFiltering ? (
                  <EmptyData
                    message={translate("CM.txt_search_no_data")}
                    height={HEIGHT_TABLE}
                    icon={IcEmptySearchSvg}
                  />
                ) : (
                  <EmptyItemTable
                    icon={<img src={emptyCloudIcon} alt="" />}
                    content={translate("CM.empty.no_data_recorded")}
                  />
                )
              ) : (
                <EmptyItemTable
                  icon={<img src={emptyCloudIcon} alt="" />}
                  content={translate("CM.empty.no_data_recorded")}
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
      </div>
    </Modal>
  );
}

export default ModalSelectionContractAnnex;
