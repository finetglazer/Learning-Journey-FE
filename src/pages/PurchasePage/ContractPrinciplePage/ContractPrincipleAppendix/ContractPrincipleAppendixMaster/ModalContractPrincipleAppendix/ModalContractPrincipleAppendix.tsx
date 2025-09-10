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
  WIDTH_1000,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { combineText } from "core/helpers/text";
import { isEmpty, isNil } from "lodash";
import { ContractNeedAdjust } from "models/ContractPrincipleAppendix/ContractPrincioleAppendix";
import { useMemo } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import "./ModalContractPrincipleAppendix.scss";
import ModalContractPrincipleAppendixFilter from "./ModalContractPrincipleAppendixFilter/ModalContractPrincipleAppendixFilter";
import { useModalContractPrincipleAppendixHooks } from "./useModalContractPrincipleAppendixHooks";

const SIZE_X_TABLE = 968;
const HEIGHT_TABLE = 472;

interface ModalContractPrincipleAppendixProps {
  onClose: () => void;
}

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  TYPE = "contractType",
  SUPPLIER = "supplier",
  CREATED_DATE = "createdDate",
  CREATOR = "createUserName",
}

const columnsWidth = {
  code: 132,
  type: 160,
  supplier: 156,
  createdDate: 96,
  creator: 148,
};

function ModalContractPrincipleAppendix({
  onClose,
}: ModalContractPrincipleAppendixProps) {
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
  } = useModalContractPrincipleAppendixHooks();

  const columns: ColumnProps<ContractNeedAdjust>[] = useMemo(
    () => [
      // Contract code
      {
        title: () => (
          <UnitTitle
            title={translate("CPA.modal.contract_code")}
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
              <OneLineText
                value={value}
                className="line-text"
                useTooltip={false}
              />
            </LayoutCell>
          );
        },
      },
      // Contract name
      {
        title: () => (
          <UnitTitle
            title={translate("CPA.modal.contract_name")}
            unit={translate("CPA.modal.contract_no")}
          />
        ),
        key: ColumnKey.NAME,
        render(value: ContractNeedAdjust) {
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
      // Contract type
      {
        title: () => (
          <UnitTitle
            title={translate("CPA.modal.contract_type")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.TYPE,
        width: columnsWidth.type,
        render() {
          return (
            <LayoutCell>
              <div className="box-two__line">
                <OneLineText
                  value={translate("CPA.txt_contract_principle")}
                  className="line-text"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      // Contract supplier
      {
        title: () => (
          <UnitTitle
            title={translate("CPA.modal.contract_supplier")}
            unit={translate("CPA.modal.contract_type")}
          />
        ),
        key: ColumnKey.SUPPLIER,
        width: columnsWidth.supplier,
        render(value: ContractNeedAdjust) {
          return (
            <LayoutCell>
              <div className="box-two__line">
                <OneLineText
                  value={value?.supplierName}
                  className="line-nowrap"
                />
                <OneLineText
                  value={value?.contractType}
                  className="line-text__two"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      // Contract create date
      {
        title: () => (
          <UnitTitle
            title={translate("CPA.modal.created_date")}
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
                useTooltip={false}
              />
            </LayoutCell>
          );
        },
      },
      // Contract creator
      {
        title: () => (
          <UnitTitle
            title={translate("CPA.modal.contract_creator")}
            unit={" "}
            className="unit-title"
          />
        ),
        key: ColumnKey.CREATOR,
        width: columnsWidth.creator,
        render(value: ContractNeedAdjust) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                title={combineText(
                  value?.createUser,
                  value?.createUserFullName
                )}
              >
                <div className="line-text line-nowrap">{value?.createUser}</div>
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
      title={translate("CPA.modal.title")}
      isShowIconBack={false}
      size={WIDTH_1000}
      titleButtonCancel={translate("CM.txt_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      handleCancel={onClose}
      handleSave={handleSelected}
      disableButtonApply={isNil(selectedRowKeys?.[numberConstants.ZERO])}
      closeIcon
    >
      <ModalContractPrincipleAppendixFilter
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

export default ModalContractPrincipleAppendix;
