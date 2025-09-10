import { ColumnProps } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { TrashIcon } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { STANDARD_TIME_FORMAT_MM_YYYY } from "core/config/consts";
import { formatCurrency } from "core/helpers/currency";
import { formatDate } from "core/helpers/date-time";
import { KeyType } from "core/services/service-types";
import { isEmpty, isNil } from "lodash";
import { BudgetPlan } from "models/CostOwner/BudgetPlan";
import { Project } from "models/Project/Project";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ModalType } from "../../BudgetSettlementCreateHook";
import { ContentDetailEmpty } from "./ContentDetailEmpty";
import "./ProjectTable.scss";

interface ProjectTableProps {
  dataSource: Project[];
  rowSelection?: TableRowSelection<Project>;
  selectedRowKeys?: KeyType[];
  setSelectedRowKeys?: Dispatch<SetStateAction<KeyType[]>>;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
}

const TableTitle = ({ title }: { title: string }) => (
  <div>
    <span>{title}</span>
  </div>
);

export const ProjectTable = ({
  dataSource,
  rowSelection,
  selectedRowKeys,
  setSelectedRowKeys,
  setModalType,
}: ProjectTableProps) => {
  const [translate] = useTranslation();

  const handleDeleteRow = useCallback(
    (row: Project) => {
      setModalType({ type: "DELETE", id: row?.id as string });
    },
    [setModalType]
  );

  const handleBulkDelete = useCallback(() => {
    setModalType({ type: "DELETE" });
  }, [setModalType]);

  const columns: ColumnProps<BudgetPlan>[] = useMemo(
    () => [
      {
        title: <TableTitle title={translate("BG.table_budget_nhcd_owner")} />,
        key: "businessUnit",
        dataIndex: "businessUnit",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <TableTitle title={translate("BG.table_budget_cn_pgd_owner")} />,
        key: "businessBranch",
        dataIndex: "businessBranch",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <TableTitle title={translate("BG.table_budget_tt_pb_owner")} />,
        key: "businessDepartment",
        dataIndex: "businessDepartment",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <TableTitle title={translate("BG.table_budget_project")} />,
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(item, row) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={row?.name}
                valueLine2={row?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <TableTitle title={translate("BG.table_budget_start_period")} />,
        key: "startTime",
        dataIndex: "startTime",
        sorter: false,
        width: "100px",
        render(item) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(item, STANDARD_TIME_FORMAT_MM_YYYY)?.replace(
                  "/",
                  "-"
                )}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <TableTitle title={translate("BG.table_budget_end_period")} />,
        key: "endTime",
        dataIndex: "endTime",
        sorter: false,
        width: "100px",
        render(item, row) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(item, STANDARD_TIME_FORMAT_MM_YYYY)?.replace(
                  "/",
                  "-"
                )}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("BG.table_budget_total_budget")} />
        ),
        key: "totalBudget",
        dataIndex: "totalBudget",
        sorter: false,
        width: "167px",
        align: "right",
        render(item, row) {
          return (
            <LayoutCell>
              <OneLineText
                className="table__text-left"
                value={formatCurrency(item)}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("BG.table_budget_used_budget")} />
        ),
        key: "usedBudget",
        dataIndex: "usedBudget",
        sorter: false,
        width: "167px",
        align: "right",
        render(item, row) {
          return (
            <LayoutCell>
              <OneLineText
                className="table__text-left"
                value={formatCurrency(item)}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("BG.table_budget_remaining_budget")} />
        ),
        key: "remainingBudget",
        dataIndex: "remainingBudget",
        sorter: false,
        width: "167px",
        align: "right",
        render(item, row) {
          return (
            <LayoutCell>
              <OneLineText
                className="table__text-left"
                value={formatCurrency(item)}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: null,
        key: "__delete",
        dataIndex: "__delete",
        sorter: false,
        width: "40px",
        render(item, row) {
          return (
            <LayoutCell>
              <div
                className="trash-container"
                onClick={() => handleDeleteRow(row)}
              >
                <TrashIcon fillColor="#DA3E33" />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [handleDeleteRow, rowSelection, translate]
  );

  const getTotals = (project: Project[]) => {
    return project.reduce(
      (accumulator, item) => {
        accumulator.totalBudget += item.totalBudget;
        accumulator.usedBudget += item.usedBudget;
        accumulator.remainingBudget += item.remainingBudget;

        return accumulator;
      },
      { totalBudget: 0, usedBudget: 0, remainingBudget: 0 }
    );
  };

  const footer = (project: unknown) => {
    if (isEmpty(project)) return undefined;

    const budgetPlan = getTotals(project as Project[]);

    return (
      <div className="project-table__container">
        <div
          className={classNames({
            "text-total-detail__container": isNil(rowSelection),
            "text-total__container": !isNil(rowSelection),
          })}
        >
          {translate("BG.total")}
        </div>
        <div
          className={classNames({
            "budget-text-detail__container": isNil(rowSelection),
            "budget-text__container": !isNil(rowSelection),
          })}
        >
          <span>{formatCurrency(budgetPlan?.totalBudget)}</span>
        </div>
        <div
          className={classNames({
            "budget-text-detail__container": isNil(rowSelection),
            "budget-text__container": !isNil(rowSelection),
          })}
        >
          <span>{formatCurrency(budgetPlan?.usedBudget)}</span>
        </div>
        <div
          className={classNames({
            "budget-remaining-detail__container": isNil(rowSelection),
            "budget-remaining__container": !isNil(rowSelection),
          })}
        >
          <span>{formatCurrency(budgetPlan?.remainingBudget)}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {isNil(rowSelection) ? null : (
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button type="secondary" size="sm" onClick={handleBulkDelete}>
            {translate("CL.delete_btn")}
          </Button>
        </ActionBarComponent>
      )}
      <div className="page-master__table">
        <StandardTable
          className="custom-table-settlement"
          rowKey="id"
          columns={isNil(rowSelection) ? [...columns.slice(0, -1)] : columns}
          dataSource={dataSource}
          locale={{ emptyText: <ContentDetailEmpty /> }}
          rowSelection={rowSelection}
          scroll={{ y: "calc(100vh - 446px)" }}
          footer={!isEmpty(dataSource) ? footer : undefined}
        />
      </div>
    </>
  );
};
