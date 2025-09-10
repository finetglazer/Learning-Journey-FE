import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { isEqual } from "lodash";
import { SpecializedBank } from "models/SpecializedBank/SpecializedBank";
import {
  SpecializedBankFilter,
  SpecializedBankType,
} from "models/SpecializedBank/SpecializedBankFilter";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { useCallback, useContext, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SpecializedBankContext,
  SpecializedBankHooks,
} from "../SpecializedBankMasterHooks";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  TYPE = "type",
  START_DATE = "startDate",
  END_DATE = "endDate",
  STATUS = "isActive",
}

const columnsWidth = {
  code: 200,
  type: 200,
  startDate: 130,
  endDate: 130,
  status: 150,
  overflowMenu: 40,
};

const WIDTH_400 = 400;

export const SpecializedBankTable = () => {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    setModalType,
    validAction,
  } = useContext<SpecializedBankHooks>(SpecializedBankContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const navigateToDetail = useCallback(
    (id: string) => {
      setModalType({ type: "DETAIL", id });
    },
    [setModalType]
  );

  const columns: ColumnProps<SpecializedBank>[] = useMemo(
    () => [
      {
        title: translate("SB.txt_specialized_bank_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        sorter: true,
        sortOrder: getAntOrderType<SpecializedBank, SpecializedBankFilter>(
          modelFilter,
          "code"
        ),
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, { id }) {
          return (
            <LayoutCell>
              <div className="w-full" onClick={() => navigateToDetail(id)}>
                <OneLineText
                  value={code}
                  className="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SB.txt_specialized_bank_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: true,
        sortOrder: getAntOrderType<SpecializedBank, SpecializedBankFilter>(
          modelFilter,
          "name"
        ),
        ellipsis: true,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SB.txt_specialized_bank_type"),
        key: ColumnKey.TYPE,
        dataIndex: ColumnKey.TYPE,
        sorter: true,
        sortOrder: getAntOrderType<SpecializedBank, SpecializedBankFilter>(
          modelFilter,
          "type"
        ),
        ellipsis: true,
        width: columnsWidth.type,
        render(type: SpecializedBankType) {
          return (
            <LayoutCell>
              <OneLineText
                value={translate(
                  `SB.txt_type_specialized_${SpecializedBankType[
                    type || numberConstants.ZERO
                  ]?.toLowerCase()}`
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_start_date"),
        key: ColumnKey.START_DATE,
        dataIndex: ColumnKey.START_DATE,
        sorter: true,
        sortOrder: getAntOrderType<SpecializedBank, SpecializedBankFilter>(
          modelFilter,
          "startDate"
        ),
        ellipsis: true,
        width: columnsWidth.startDate,
        render(startDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(startDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_end_date"),
        key: ColumnKey.END_DATE,
        dataIndex: ColumnKey.END_DATE,
        sorter: true,
        sortOrder: getAntOrderType<SpecializedBank, SpecializedBankFilter>(
          modelFilter,
          "endDate"
        ),
        ellipsis: true,
        width: columnsWidth.endDate,
        render(endDate: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(endDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        sorter: true,
        sortOrder: getAntOrderType<SpecializedBank, SpecializedBankFilter>(
          modelFilter,
          ColumnKey.STATUS
        ),
        ellipsis: true,
        width: columnsWidth.status,
        render(status: boolean) {
          const translateKey = isEqual(status, true)
            ? "CM.txt_status_active"
            : "CM.txt_status_deactivate";
          const value = translate(translateKey);
          const statusValue = isEqual(status, true) ? "SUCCESS" : "DEFAULT";
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={value}
                status={statusValue}
                isShowDot={false}
                isShowBorder
              />
            </LayoutCell>
          );
        },
      },
      // Overflow menu container
      {
        title: "",
        width: columnsWidth.overflowMenu,
        render(_, row: SpecializedBank) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () => navigateToDetail(row?.id),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () => setModalType({ type: "EDIT", id: row?.id }),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () => setModalType({ type: "DELETE", id: row?.id }),
              isShow: row?.isUsed || !validAction("DELETE") ? false : true,
            },
          ];
          return (
            <LayoutCell>
              <OverflowMenu list={items} />
            </LayoutCell>
          );
        },
      },
    ],
    [modelFilter, navigateToDetail, setModalType, translate, validAction]
  );

  const handleBulkDelete = useCallback(() => {
    setModalType({ type: "DELETE" });
  }, [setModalType]);

  return (
    <>
      {/* Action control */}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      <div className="page-master__table">
        {/* Table */}
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 330px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
        {/* Pagination */}
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </>
  );
};
