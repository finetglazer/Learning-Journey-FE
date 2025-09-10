import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import type { ColumnProps } from "antd/es/table";
import { useTranslation } from "react-i18next";
import {
  PaymentMethod,
  PaymentMethodType,
  PaymentRequestType,
  PaymentRequestTypeGroup,
} from "models/Report/CostItems";
import dayjs from "dayjs";
import { formatNumber } from "core/helpers/number";
import { Tooltip } from "antd";
import {
  listPurchasingPlanType,
  listPurchasingPlanStatusEnum,
  NOT_AVAILABLE,
} from "config/const";
import { Link, useHistory } from "react-router-dom";
import { PURCHASE_REQUEST_VIEW_ROUTE } from "config/route-const";
import styles from "pages/ReportPage/Payment/ReportPage.module.scss";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { isNil } from "lodash";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import {
  PurchaseRequestBranch,
  PurchaseRequestDepartment,
  PurchaseRequestUnit,
  PurchaseSummary,
} from "models/Report/Summary";
import {
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { useCallback } from "react";

export function getPaymentRequestType(type: number): string {
  return PaymentRequestType[type as PaymentRequestTypeGroup];
}

export function getPaymentMethodDescription(type: number): string {
  return PaymentMethodType[type as PaymentMethod];
}

export function useColumns({
  pageIndex,
  pageSize,
}: {
  pageIndex: number;
  pageSize: number;
}): ColumnProps<PurchaseSummary>[] {
  const [translate] = useTranslation();
  const history = useHistory();

  const getPurchasePlanTypeByRouter = useCallback(
    (id?: TYPE_PURCHASING_PLAN) => {
      let itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
        (el) => el.pathEdit === history.location.pathname
      );

      if (id) {
        itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
          (el) => el.id === id
        );
      }

      return itemPurchasePlanType;
    },
    [history.location.pathname]
  );

  return [
    {
      title: translate("report.purchase.purchase_plan_summary.table.txt_order"),
      width: 55,
      key: "noNumber",
      dataIndex: "noNumber",
      render(_, __, index: number) {
        return (
          <LayoutCell>
            <OneLineText
              value={((pageIndex - 1) * pageSize + (index + 1)).toString()}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_creation_date"
      ),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 96,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={
                dayjs(value)?.isValid()
                  ? formatDate(value, STANDARD_DATE_FORMAT_SLASH)
                  : NOT_AVAILABLE
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_approval_date"
      ),
      key: "approvedDate",
      dataIndex: "approvedDate",
      width: 96,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={
                isNil(value)
                  ? NOT_AVAILABLE
                  : formatDate(value, STANDARD_DATE_FORMAT_SLASH)
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_summary.table.txt_code"),
      width: 189,
      key: "code",
      dataIndex: "code",
      render(value: string, record: PurchaseSummary) {
        return (
          <LayoutCell>
            <Link
              className="text-decoration-none"
              to={`${
                getPurchasePlanTypeByRouter(record?.classification)?.pathView
              }/${record?.id}`}
              rel="noopener noreferrer"
              onClick={(event) => {
                event.stopPropagation();
              }}
              target="_blank"
            >
              <OneLineText
                className={styles["text-table-content-primary"]}
                value={value}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_summary.table.txt_name"),
      width: 250,
      key: "name",
      dataIndex: "name",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_prev_VAT"
      ),
      width: 145,
      key: "amountBeforeTax",
      dataIndex: "amountBeforeTax",
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(value) ? NOT_AVAILABLE : formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_summary.table.txt_vat"),
      width: 145,
      key: "taxAmount",
      dataIndex: "taxAmount",
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(value) ? NOT_AVAILABLE : formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_summary.table.txt_total"),
      width: 145,
      key: "totalAmount",
      dataIndex: "totalAmount",
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(value) ? NOT_AVAILABLE : formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_currency"
      ),
      width: 74,
      key: "currency",
      dataIndex: "currency",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={isNil(value) ? NOT_AVAILABLE : value?.toString()}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_supplier_code"
      ),
      width: 140,
      key: "supplierCode",
      dataIndex: "supplierCode",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value ?? NOT_AVAILABLE} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_supplier_name"
      ),
      width: 200,
      key: "supplierName",
      dataIndex: "supplierName",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value ?? NOT_AVAILABLE} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.purchase.purchase_plan_summary.table.txt_form"),
      width: 160,
      key: "classification",
      dataIndex: "classification",
      render(value: number) {
        const item = listPurchasingPlanType.find((type) => type.id === value);
        return (
          <LayoutCell>
            <OneLineText value={item?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate(
            "report.purchase.purchase_plan_summary.table.txt_cost_saving"
          )}
          unit={
            <div>
              {translate(
                "report.purchase.purchase_plan_summary.table.txt_request_minus_purchase_total"
              )}
            </div>
          }
        />
      ),
      className: "p-0",
      width: 160,
      key: "costSaving",
      dataIndex: "costSaving",
      render(value: string) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={isNil(value) ? NOT_AVAILABLE : formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_staff_handle"
      ),
      width: 180,
      key: "createUser",
      dataIndex: "createUser",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${value + " - " + record?.createdUserFullName}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_unit_handle"
      ),
      width: 180,
      key: "organizationName",
      dataIndex: "organizationName",
      render(value: string, record: PurchaseSummary) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${record?.organizationCode + " - " + value}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_status"
      ),
      width: 130,
      key: "status",
      dataIndex: "status",
      render(id) {
        const item = listPurchasingPlanStatusEnum.find(
          (type) => type.id === id
        );
        return (
          <LayoutCell>
            <Tag
              size="md"
              value={item?.name}
              status={item?.code}
              isShowDot={false}
              isShowBorder={true}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_purchase_code"
      ),
      width: 154,
      key: "purchaseRequestCode",
      dataIndex: "purchaseRequestCode",
      render(value: string, record) {
        return (
          <LayoutCell>
            <Link
              className="text-decoration-none"
              to={PURCHASE_REQUEST_VIEW_ROUTE + `/${record?.purchaseRequestId}`}
              rel="noopener noreferrer"
              target="_blank"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <OneLineText
                className={styles["text-table-content-primary"]}
                value={value}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_purchase_name"
      ),
      width: 200,
      key: "purchaseRequestName",
      dataIndex: "purchaseRequestName",
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_purchase_created_date"
      ),
      key: "purchaseRequestCreatedDate",
      dataIndex: "purchaseRequestCreatedDate",
      width: 122,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={
                dayjs(value)?.isValid()
                  ? formatDate(value, STANDARD_DATE_FORMAT_SLASH)
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_purchase_total"
      ),
      key: "purchaseRequestTotalAmount",
      dataIndex: "purchaseRequestTotalAmount",
      width: 160,
      align: "right",
      render(value: string, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={
                value
                  ? `${formatNumber(value)} ${
                      record?.purchaseRequestCurrency || ""
                    }`
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_purchase_delivery"
      ),
      key: "purchaseRequestSubmissionDate",
      dataIndex: "purchaseRequestSubmissionDate",
      width: 140,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={
                dayjs(value)?.isValid()
                  ? formatDate(value, STANDARD_DATE_FORMAT_SLASH)
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_branch_created"
      ),
      key: "purchaseRequestBranch",
      dataIndex: "purchaseRequestBranch",
      width: 160,
      render(value: PurchaseRequestBranch) {
        return (
          <LayoutCell>
            <OneLineText value={value?.code ? value?.code + " - " + value?.name : ""} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_bank_block_created"
      ),
      key: "purchaseRequestUnit",
      dataIndex: "purchaseRequestUnit",
      width: 180,
      render(value: PurchaseRequestUnit) {
        return (
          <LayoutCell>
            <OneLineText value={value?.code ? value?.code + " - " + value?.name : ""} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_department_created"
      ),
      key: "purchaseRequestDepartment",
      dataIndex: "purchaseRequestDepartment",
      width: 200,
      render(value: PurchaseRequestDepartment) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${value?.code ? value?.code + " - " + value?.name : ""}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value?.name}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.purchase.purchase_plan_summary.table.txt_staff_created"
      ),
      key: "purchaseRequestCreatedUser",
      dataIndex: "purchaseRequestCreatedUser",
      width: 180,
      render(value: string, record) {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${
                value + " - " + record?.purchaseRequestCreatedUserFullName
              }`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {value}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
  ];
}
