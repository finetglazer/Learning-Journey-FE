import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty } from "lodash";
import { ExchangeRate } from "models/ExchangeRate";
import { useCallback, useContext, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import "./ExchangeRateMaster.scss";

import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import dayjs, { Dayjs } from "dayjs";
import { ExchangeRateEmptySearchData } from "./ExchangeRateEmptySearchData";
import {
  ExchangeRateMasterContext,
  ExchangeRateMasterContextModel,
} from "./ExchangeRateMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const ExchangeRateMasterTable = () => {
  const exchangeRateMaster = useContext<ExchangeRateMasterContextModel>(
    ExchangeRateMasterContext
  );

  // const history = useHistory();

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    countFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleOpenModal,
    handleOpenModalDelete,
    validAction,
  } = exchangeRateMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: ExchangeRate) => {
      const list: ListOverflowMenu[] = [
        // preview
        {
          title: translate("generalActions.preview"),
          action: () => handleOpenModal(item?.id, "preview"),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleOpenModal(item?.id, "detail"),
          isShow: validAction("UPDATE"),
        },
        // Delete
        {
          title: translate("generalActions.delete"),
          action: () => handleOpenModalDelete(item),
          isShow: item?.isUsed || !validAction("DELETE") ? false : true,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, validAction, handleOpenModal, handleOpenModalDelete]
  );

  const columns: ColumnProps<ExchangeRate>[] = useMemo(
    () => [
      {
        title: translate("exchangeRates.exchangeNameFrom"),
        key: "fromCurrencyName",
        dataIndex: "fromCurrencyName",
        sorter: true,
        render(...params: [string, ExchangeRate, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${params[1]?.fromCurrencyCode} - ${params[1]?.fromCurrencyName}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("exchangeRates.exchangeNameTo"),
        key: "toCurrencyName",
        dataIndex: "toCurrencyName",
        sorter: true,
        render(...params: [string, ExchangeRate, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${params[1]?.toCurrencyCode} - ${params[1]?.toCurrencyName}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("exchangeRates.sellBankTransfer"),
        key: "sellTransfer",
        dataIndex: "sellTransfer",
        sorter: true,
        width: "200px",
        render(...params: [number, ExchangeRate, number]) {
          return (
            <LayoutCell position="left">
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("exchangeRates.buyBankTransfer"),
        key: "buyTransfer",
        dataIndex: "buyTransfer",
        sorter: true,
        width: "200px",
        render(...params: [number, ExchangeRate, number]) {
          return (
            <LayoutCell position="left">
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("exchangeRates.centralExchangeRate"),
        key: "centralExchangeRate",
        dataIndex: "centralExchangeRate",
        sorter: true,
        width: "200px",
        render(...params: [number, ExchangeRate, number]) {
          return (
            <LayoutCell position="left">
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("exchangeRates.exchangeRateDate"),
        key: "exchangeRateDate",
        dataIndex: "exchangeRateDate",
        sorter: true,
        render(...params: [Dayjs, ExchangeRate, number]) {
          const data = params?.[0];
          const dateString =
            data && dayjs(data)?.isValid()
              ? formatDateTimeToVietnamTimezone(data)
              : "";
          return (
            <LayoutCell>
              <OneLineText value={dateString} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 40,
        align: "center",
        render(id: number, record: ExchangeRate) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, translate]
  );

  return (
    <>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => handleOpenModalDelete(undefined)}
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      {/* List view */}
      <div className="page-master__table">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: <ExchangeRateEmptySearchData />,
          }}
        />

        {isEmpty(list) &&
        (!isEmpty(modelFilter.search) || gt(countFilter, 0)) ? null : (
          <div className="page-master__pagination">
            <Pagination
              pageIndex={modelFilter.pageIndex}
              pageSize={modelFilter.pageSize}
              total={count}
              onChange={handlePagination}
              pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
            />
          </div>
        )}
      </div>
    </>
  );
};
