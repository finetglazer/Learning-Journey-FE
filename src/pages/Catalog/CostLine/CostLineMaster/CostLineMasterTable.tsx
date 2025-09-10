import { ColumnProps } from "antd/lib/table";
import PencilSvg from "assets/icons/CostLine/ic_pencil_line.svg";
import TrashOutlineSvg from "assets/icons/CostLine/ic_trash_outline.svg";
import TrashOutlineDisabledSvg from "assets/icons/CostLine/ic_trash_outline_disabled.svg";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty, isEqual } from "lodash";
import {
  BudgetCalculationMethod,
  BudgetPeriod,
  CostLine,
} from "models/CostLine";
import { Status } from "models/Status";
import React, { useCallback, useContext, useMemo } from "react";
import { Model } from "react-3layer-common";
import {
  ActionBarComponent,
  ActionRow,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { CircleStatus } from "./CircleStatus";
import { CostLineEmptySearchData } from "./CostLineEmptySearchData";
import "./CostLineMaster.scss";
import { CostLineMaster, CostLineMasterContext } from "./CostLineMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

interface ActionRowType<T extends Model> {
  record?: T;
  visible?: boolean;
  x?: number;
  y?: number;
  rowHeight?: number;
}

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const CostLineMasterTable = () => {
  const costLineMaster = useContext<CostLineMaster>(CostLineMasterContext);
  const [actionRow, setActionRow] = React.useState<ActionRowType<CostLine>>({
    visible: true,
    record: null,
    x: 0,
    y: 0,
  });
  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    rowSelection,
    setSelectedRowKeys,
    onRowClicked,
    setModalType,
    selectedRowKeys,
    countFilter,
  } = costLineMaster;

  const [translate] = useTranslation();

  const { validAction } =
    authorizationService.useAuthorizedAction("CATALOG_COSTLINE");

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const handleBulkDelete = React.useCallback(() => {
    setModalType({ type: "DELETE" });
  }, [setModalType]);

  const handleDelete = useCallback(
    ({ id }: CostLine) => {
      setModalType({ type: "DELETE", id });
    },
    [setModalType]
  );

  const handleUpdate = useCallback(
    ({ id }: CostLine) => {
      setModalType({ type: "UPDATE", id });
    },
    [setModalType]
  );

  const menu = useCallback(
    (item: CostLine) => {
      const list: ListOverflowMenu[] = [
        // preview
        {
          title: translate("generalActions.preview"),
          action: () => onRowClicked(item),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleUpdate(item),
          isShow: validAction("UPDATE"),
        },

        // Delete
        {
          title: translate("generalActions.delete"),
          action: () => handleDelete(item),
          isShow: item?.isUsed || !validAction("DELETE") ? false : true,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [handleDelete, handleUpdate, onRowClicked, translate, validAction]
  );

  const columns: ColumnProps<CostLine>[] = useMemo(
    () => [
      {
        title: translate("CL.code_line_code_txt"),
        key: "code",
        dataIndex: "code",
        sorter: false,
        render(item, row) {
          return (
            <LayoutCell>
              <div className="w-100" onClick={() => onRowClicked(row)}>
                <OneLineText
                  value={item}
                  className="text-table-content-primary"
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CL.code_line_name_txt"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(...params: [string, CostLine, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CL.code_line_parent_txt"),
        key: "parentDisplay",
        dataIndex: "parentDisplay",
        sorter: false,
        render(...params: [string, CostLine, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CL.budget_period_txt"),
        key: "budgetPeriod",
        dataIndex: "budgetPeriod",
        sorter: false,
        width: "10%",
        render(budgetPeriod: BudgetPeriod) {
          const textTranslated = translate(
            `CL.${BudgetPeriod[budgetPeriod]}_txt`
          );
          return (
            <LayoutCell>
              <OneLineText value={textTranslated} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CL.calculation_method_txt"),
        key: "budgetCalculationMethod",
        dataIndex: "budgetCalculationMethod",
        sorter: false,
        width: "10%",
        render(budgetCalculationMethod: BudgetCalculationMethod) {
          const textTranslated = translate(
            `CL.${BudgetCalculationMethod[budgetCalculationMethod]}_txt`
          );
          return (
            <LayoutCell>
              <OneLineText value={textTranslated} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CL.allow_transfer_txt"),
        key: "isTransfer",
        dataIndex: "isTransfer",
        sorter: false,
        width: "112px",
        align: "center",
        render(status: Status) {
          return (
            <LayoutCell>
              <CircleStatus active={isEqual(status, true)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CL.allow_budget_exceed_txt"),
        key: "isBudgetOverruns",
        dataIndex: "isBudgetOverruns",
        sorter: false,
        width: "136px",
        align: "center",
        render(status: boolean) {
          return (
            <LayoutCell>
              <CircleStatus active={isEqual(status, true)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.txt_status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: false,
        width: "200px",
        render(status: boolean) {
          const value = isEqual(status, true)
            ? translate("CL.active_status_txt")
            : translate("CL.deactivate_status_txt");
          const statusValue = isEqual(status, true) ? "SUCCESS" : "DEFAULT";

          return (
            <LayoutCell>
              <Tag
                size="md"
                value={value}
                status={statusValue}
                isShowDot={false}
                isShowBorder={true}
              />
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
        render(id: number, record: CostLine) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [menu, onRowClicked, translate]
  );

  return (
    <>
      {/* Action control */}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CL.delete_btn")}
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
          scroll={{ y: "calc(100vh - 326px)" }}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          idContainer="table-id"
          locale={{
            emptyText: <CostLineEmptySearchData />,
          }}
        />
        <ActionRow
          actionRow={actionRow}
          tableKey={"table-id"}
          setActionRow={setActionRow}
        >
          <div className="action-row-content">
            <button
              className="action-row__button"
              onClick={() => handleUpdate(actionRow.record)}
            >
              <img src={PencilSvg} alt="" />
            </button>
            <button
              className={`action-row__button ${
                isEqual(actionRow.record?.isUsed, true) ? "cursor-none" : ""
              }`}
              onClick={() => handleDelete(actionRow.record)}
              disabled={isEqual(actionRow.record?.isUsed, true)}
            >
              <img
                src={
                  isEqual(actionRow.record?.isUsed, true)
                    ? TrashOutlineDisabledSvg
                    : TrashOutlineSvg
                }
                alt=""
              />
            </button>
          </div>
        </ActionRow>
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
