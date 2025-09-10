import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION, EMPTY_WIDTH_400 } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { useContext, useMemo } from "react";
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

import { Tooltip } from "antd";
import { formatNumber } from "core/helpers/number";
import { getStatus } from "core/helpers/status";
import { ContractClassification } from "models/ContractClassification/ContractClassification";
import { ContractClassificationFilter } from "models/ContractClassification/ContractClassificationFilter";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import {
  ContractClassificationMasterContext,
  ContractClassificationModal,
} from "../ContractClassificationMasterHooks";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  DESCRIPTION = "description",
  MAX_OVER_PAYMENT_PERCENTAGE = "maxOverpaymentPercentage",
  MAX_OVER_PAYMENT_AMOUNT = "maxOverpaymentAmount",
  STATUS = "isActive",
  ACTION = "action",
}

const columnsWidth = {
  overflowMenu: 40,
  code: 200,
  name: 156,
  maxOverpaymentPercentage: 200,
  maxOverpaymentAmount: 200,
  status: 150,
};

export const ContractClassificationTable = () => {
  const {
    count,
    list,
    loadingList,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleActionContractClassification,
    validAction,
  } = useContext(ContractClassificationMasterContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<ContractClassification>[] = useMemo(
    () => [
      {
        title: translate("CC.txt_config_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        width: columnsWidth.code,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<
          ContractClassification,
          ContractClassificationFilter
        >(modelFilter, ColumnKey.CODE),
        render(code: string, { id }: ContractClassification) {
          return (
            <LayoutCell>
              <div
                className="w-full"
                onClick={() =>
                  handleActionContractClassification({
                    modal: ContractClassificationModal.DETAIL,
                    id,
                  })
                }
              >
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
        title: translate("CC.txt_config_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: columnsWidth.name,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<
          ContractClassification,
          ContractClassificationFilter
        >(modelFilter, ColumnKey.NAME),
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CC.txt_config_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        ellipsis: true,
        render(description: string) {
          return (
            <LayoutCell>
              <Tooltip
                placement="top"
                rootClassName="text-break-line"
                className="text-break-line line-clamp-1"
                title={description}
              >
                {description}
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CC.txt_config_maximum_payment"),
        key: ColumnKey.MAX_OVER_PAYMENT_AMOUNT,
        dataIndex: ColumnKey.MAX_OVER_PAYMENT_AMOUNT,
        width: columnsWidth.maxOverpaymentAmount,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<
          ContractClassification,
          ContractClassificationFilter
        >(modelFilter, ColumnKey.MAX_OVER_PAYMENT_AMOUNT),
        render(maxOverpaymentAmount: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(maxOverpaymentAmount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CC.txt_config_percentage"),
        key: ColumnKey.MAX_OVER_PAYMENT_PERCENTAGE,
        dataIndex: ColumnKey.MAX_OVER_PAYMENT_PERCENTAGE,
        width: columnsWidth.maxOverpaymentPercentage,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<
          ContractClassification,
          ContractClassificationFilter
        >(modelFilter, ColumnKey.MAX_OVER_PAYMENT_PERCENTAGE),
        render(maxOverpaymentPercentage: number) {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={
                  maxOverpaymentPercentage.toString()
                    ? `${formatNumber(maxOverpaymentPercentage)}%`
                    : ""
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_status"),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: columnsWidth.status,
        sorter: true,
        sortOrder: getAntOrderType<
          ContractClassification,
          ContractClassificationFilter
        >(modelFilter, ColumnKey.STATUS),
        render(isActive: boolean) {
          const { keyI18n, type } = getStatus(isActive);

          return (
            <LayoutCell>
              <Tag
                size="md"
                value={translate(keyI18n)}
                status={type}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: columnsWidth.overflowMenu,
        render(_, { id, isUsed }: ContractClassification) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () =>
                handleActionContractClassification({
                  modal: ContractClassificationModal.DETAIL,
                  id,
                }),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () =>
                handleActionContractClassification({
                  modal: ContractClassificationModal.EDIT,
                  id,
                }),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () =>
                handleActionContractClassification({
                  modal: ContractClassificationModal.DELETE,
                  id,
                }),
              isShow: isUsed || !validAction("DELETE") ? false : true,
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
    [translate, modelFilter, handleActionContractClassification, validAction]
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
          onClick={() =>
            handleActionContractClassification({
              modal: ContractClassificationModal.DELETE,
            })
          }
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          loading={loadingList}
          columns={columns}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={EMPTY_WIDTH_400}
              />
            ),
          }}
          isDragable
        />
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
