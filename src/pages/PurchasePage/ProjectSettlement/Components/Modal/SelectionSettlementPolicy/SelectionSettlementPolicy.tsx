import { Tooltip } from "antd";
import type { ColumnProps } from "antd/es/table";
import { emptyCloudIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_1100,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual, isNil } from "lodash";
import { SettlementPolicyModel } from "models/SettlementPolicy/SettlementPolicy";
import { useMemo } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import SelectionSettlementPolicyFilter from "./Components/SelectionSettlementPolicyFilter/SelectionSettlementPolicyFilter";
import { useSelectionSettlementPolicyModalHooks } from "./useSelectionSettlementPolicyModalHooks";
import { OptionBaseModel } from "models/Common/Common";

interface SelectionSettlementPolicyModalProps {
  onClose: () => void;
}

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  TOTAL = "total",
  PROJECT = "project",
  ORGANIZATION = "organization",
  CREATE_USER = "createUser",
  CREATED_DATE = "createdDate",
}

function SelectionSettlementPolicyModal({
  onClose,
}: SelectionSettlementPolicyModalProps) {
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
  } = useSelectionSettlementPolicyModalHooks();

  const columns: ColumnProps<SettlementPolicyModel>[] = useMemo(
    () => [
      {
        title: translate("PS.txt_table_code_policy"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: 150,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_name_policy"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: 187,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.table_total_value"),
        key: ColumnKey.TOTAL,
        dataIndex: ColumnKey.TOTAL,
        align: "right",
        width: 155,
        render(value: number, record) {
          const content = `${formatNumber(value)} ${record?.currency}`;
          return (
            <LayoutCell position="right">
              <OneLineText value={content} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_code_project"),
        key: ColumnKey.PROJECT,
        dataIndex: ColumnKey.PROJECT,
        width: 120,
        render(value: any) {
          return (
            <LayoutCell>
              <Tooltip
                placement="top"
                title={
                  <span>
                    {value?.code} - {value?.name}
                  </span>
                }
              >
                <span className="line-clamp-1">{value?.code}</span>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_unit_create"),
        key: ColumnKey.ORGANIZATION,
        dataIndex: ColumnKey.ORGANIZATION,
        width: 180,
        render(value: OptionBaseModel) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_person_create"),
        key: ColumnKey.CREATE_USER,
        dataIndex: ColumnKey.CREATE_USER,
        width: 120,
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
                <span className="line-clamp-1">{value}</span>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_date_create"),
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
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const isEmptyList = useMemo(() => isEmpty(list), [list]);

  return (
    <Modal
      open
      title={translate("PS.modal.settlement_policy_selection.title")}
      isShowIconBack={false}
      size={WIDTH_1100}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={onClose}
      handleSave={handleSelected}
      disableButtonApply={isNil(selectedRowKeys?.[0])}
      closeIcon
    >
      <SelectionSettlementPolicyFilter
        modelFilter={modelFilter}
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
          <>
            <StandardTable
              loading={loadingList}
              rowKey={TABLE_ROW_KEY}
              rowSelection={rowSelection}
              onChange={handleTableChange}
              columns={columns}
              dataSource={list}
              scroll={{ y: WIDTH_400 }}
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
          </>
        )}
      </div>
    </Modal>
  );
}

export default SelectionSettlementPolicyModal;
