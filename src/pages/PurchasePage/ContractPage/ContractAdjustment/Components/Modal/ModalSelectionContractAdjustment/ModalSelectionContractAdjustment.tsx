import { Tooltip } from "antd";
import type { ColumnProps } from "antd/es/table";
import { emptyCloudIcon } from "assets/icons";
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
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual, isNil } from "lodash";
import { useMemo } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import "./ModalSelectionContractAdjustment.scss";
import { useSelectionSettlementContractAdjustmentModalHooks } from "./useSelectionSettlementContractAdjustmentModalHooks";
import SelectionSettlementFilter from "./SelectionSettlementFilter/SelectionSettlementFilter";
import { ContractToAdjustmentModel } from "models/ContractAdjustment";
import { OptionBaseModel } from "models/Common/Common";

const SIZE_X_TABLE = 1178;

interface ModalSelectionContractAnnexProps {
  onClose: () => void;
}

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  SUPPLIER = "supplierName",
  EXPENSE = "costGroup",
  TOTAL_VALUE = "total",
  EFFECTIVE_DATE = "effectiveDate",
  CREATED_DATE = "createdDate",
  CREATE_USER = "creator",
}

function ModalSelectionContractAnnex({
  onClose,
}: ModalSelectionContractAnnexProps) {
  const {
    list,
    count,
    error,
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
  } = useSelectionSettlementContractAdjustmentModalHooks();

  const columns: ColumnProps<ContractToAdjustmentModel>[] = [
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
      width: 132,
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
      width: 200,
      render(value: ContractToAdjustmentModel) {
        return (
          <LayoutCell>
            <div className="box-two__line">
              <OneLineText className="line-one" value={value?.name} />
              <OneLineText
                value={value?.contractNo}
                className="line-text__two"
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
      width: 160,
      render(_, record) {
        return (
          <LayoutCell>
            <div className="box-two__line">
              <OneLineText value={record?.supplierName} className="line-one" />
              <OneLineText
                value={record?.contractType}
                className="line-text__two"
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
      width: 145,
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
      width: 145,
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} className="line-text" />
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
      width: 110,
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
      width: 100,
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
      width: 150,
      render(value: OptionBaseModel) {
        return (
          <LayoutCell>
            <Tooltip
              placement="top"
              title={
                <span>
                  {value?.email} - {value?.name}
                </span>
              }
            >
              <span className="line-clamp-1 line-text">{value?.email}</span>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
  ];

  const isEmptyList = useMemo(() => isEmpty(list), [list]);

  return (
    <Modal
      open
      title={translate("contractAdjustment.txt_select_contract_adjustment")}
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
        error={error}
        dispatchFilter={dispatchFilter}
        handleLoadList={handleLoadList}
      />
      <div className="page-master__table">
        {isEmptyList && isEqual(loadingList, false) ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
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
              tableLayout="fixed"
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
        )}
      </div>
    </Modal>
  );
}

export default ModalSelectionContractAnnex;
