import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { CheckedDisable, CheckedGreen, CheckedRed } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { padMonth } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import type { TFunction } from "i18next";
import { BudgetDetailsModel } from "models/Payment";
import { LayoutCell, OneLineText } from "react-components-design-system";

interface ColumnBudgetStatusProps {
  translate: TFunction<"translation", undefined>;
  isShowReallocateAmount?: boolean;
}

const columnBudgetStatus = ({
  translate,
  isShowReallocateAmount,
}: ColumnBudgetStatusProps): ColumnProps<BudgetDetailsModel>[] => {
  return [
    {
      title: () => (
        <div className="ms-2">
          {translate("PM.payment_project_input_label")}
        </div>
      ),
      dataIndex: "budgetProject",
      key: "budgetProject",
      width: 240,
      render: (budgetProject) => (
        <LayoutCell className="d-flex flex-column align-items-start my-2 ms-2">
          {/* <div>{budgetProject?.code}</div> */}
          <OneLineText
            className="w-100 line-height-22"
            useTooltip
            value={budgetProject?.code}
          />
          <OneLineText
            className="w-100 status-style font-size-12"
            useTooltip
            value={budgetProject?.name}
          />
        </LayoutCell>
      ),
    },
    {
      title: () => <div>{translate("PM.cost_line")}</div>,
      dataIndex: "costLine",
      key: "costLine",
      width: 200,
      render: (costLine) => (
        <LayoutCell className="w-100 d-flex flex-column">
          <Tooltip
            placement="top"
            className="w-100"
            title={
              <>
                <div>{costLine?.code}</div>
                <div>{costLine?.budgetCalculationMethod}</div>
                <div>{costLine?.budgetPeriod}</div>
              </>
            }
          >
            <div>{costLine?.code}</div>
          </Tooltip>
          <OneLineText
            className="w-100 status-style font-size-12"
            useTooltip
            value={costLine?.name}
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <div className="text-nowrap">
          {translate("PM.budget_period_overview_page_title")}
        </div>
      ),
      width: 107,
      dataIndex: "periodText",
      key: "periodText",
      render: (_, record) => (
        <LayoutCell className="d-flex justify-content-start align-items-start">
          <OneLineText className="line-height-22" value={record?.periodText} />
        </LayoutCell>
      ),
    },
    {
      title: () => <div>{translate("PM.allow_to_exceed_budget")}</div>,
      width: 125,
      dataIndex: "costLine",
      key: "costLine",
      render: (costLine) => (
        <LayoutCell className="d-flex align-items-start justify-content-center">
          <div>
            <img
              src={costLine?.isBudgetOverruns ? CheckedGreen : CheckedDisable}
              alt=""
              width={13}
              height={13}
            />
          </div>
        </LayoutCell>
      ),
    },
    {
      title: () => <div>{translate("PM.table_status")}</div>,
      width: 85,
      dataIndex: "isOverBudget",
      key: "isOverBudget",
      render: (isOverBudget) => (
        <LayoutCell className="d-flex align-items-start justify-content-center">
          <div>
            <Tooltip
              placement="top"
              title={translate(
                isOverBudget
                  ? "PM.budget_over_title"
                  : "PM.budget_not_over_title"
              )}
            >
              <img
                src={isOverBudget ? CheckedRed : CheckedGreen}
                alt=""
                width={13}
                height={13}
              />
            </Tooltip>
          </div>
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PM.payment_promo_code_bugget_input_label")}
          className="align-items-end"
        />
      ),
      width: 145,
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <LayoutCell className="d-flex align-items-start justify-content-end">
          <OneLineText
            className="amount-title"
            useTooltip
            value={formatNumber(total)}
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PM.budget_used_title_table")}
          className="align-items-end"
        />
      ),
      width: 145,
      dataIndex: "usedAmount",
      key: "usedAmount",
      render: (usedAmount) => (
        <LayoutCell className="d-flex align-items-start justify-content-end">
          <OneLineText
            className="amount-title"
            useTooltip
            value={formatNumber(usedAmount)}
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PM.budget_amount_request_title_table")}
          className="align-items-end"
        />
      ),
      width: 145,
      dataIndex: "requestAmount",
      key: "requestAmount",
      render: (requestAmount) => (
        <LayoutCell className="d-flex align-items-start justify-content-end">
          <OneLineText
            className="amount-title"
            useTooltip
            value={formatNumber(requestAmount)}
          />
        </LayoutCell>
      ),
    },
    {
      title: () => (
        <>
          {isShowReallocateAmount && (
            <div className="d-inline-flex flex-column">
              <div>
                {translate("PM.budget_amount_reimbursement_title_table")}
              </div>
              <div className="text-currency-unit align-self-end">
                {translate("PM.payment_currency_unit")}
              </div>
            </div>
          )}
        </>
      ),
      width: isShowReallocateAmount ? 145 : 0,
      dataIndex: "reallocateAmount",
      key: "reallocateAmount ",
      align: "right",
      render: (reallocateAmount) => (
        <>
          {isShowReallocateAmount && (
            <LayoutCell className="d-flex align-items-start justify-content-end">
              <OneLineText
                className="amount-title"
                useTooltip
                value={formatNumber(reallocateAmount ?? 0)}
              />
            </LayoutCell>
          )}
        </>
      ),
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PM.budget_remaining_title_table")}
          className="align-items-end"
        />
      ),
      width: 145,
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (remainingAmount) => (
        <LayoutCell className="d-flex align-items-start justify-content-end">
          <OneLineText
            className="amount-title"
            useTooltip
            value={formatNumber(remainingAmount)}
          />
        </LayoutCell>
      ),
    },
  ];
};

export default columnBudgetStatus;
