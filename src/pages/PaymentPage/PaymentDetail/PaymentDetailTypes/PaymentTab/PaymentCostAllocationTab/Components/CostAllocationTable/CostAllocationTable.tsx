import { ColumnProps } from "antd/lib/table";
import { ViewBudgetIcon } from "assets/icons";
import ModalBudgetStatus from "components/ModalBudgetStatus/ModalBudgetStatus";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { addNumberRoundFour, addNumbers } from "core/helpers/number";
import { get } from "lodash";
import { CostAllocation, PaymentDetailModel } from "models/Payment";
import { useContext, useMemo, useState } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PaymentDetailHookContext } from "../../../../../PaymentDetailHook";
import "./CostAllocationTable.scss";

const CostAllocationTable = () => {
  const { model, isVNDOrJPY, formatNumberToCurrency } =
    useContext<PaymentDetailModel>(PaymentDetailHookContext);
  const [translate] = useTranslation();
  const [isOpenModalBudgetOverView, setIsOpenModalBudgetOverView] =
    useState(false);

  const roundNumber = useMemo(() => (isVNDOrJPY ? 0 : 4), [isVNDOrJPY]);

  const columns: ColumnProps<CostAllocation>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="d-content p-b--xs">
            {translate("PM.branch_office")}
          </div>
        ),
        key: "businessBranchDTO",
        dataIndex: "businessBranchDTO",
        align: "left",
        sorter: false,
        width: 200,
        render: (_text_, record) => {
          if (record.isTotal) {
            return (
              <label className="amount-title">{translate("PM.total")}</label>
            );
          }
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.businessBranchDTO?.code} - ${record?.businessBranchDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-content p-b--xs">
            {translate("PM.department_block")}
          </div>
        ),
        key: "businessUnitDTO",
        dataIndex: "businessUnitDTO",
        align: "left",
        sorter: false,
        width: 200,
        render: (_text_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.businessUnitDTO?.code} - ${record?.businessUnitDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-content p-b--xs">
            {translate("PM.sub_department")}
          </div>
        ),
        key: "businessDepartmentDTO",
        dataIndex: "businessDepartmentDTO",
        align: "left",
        sorter: false,
        width: 200,
        render: (_text_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.businessDepartmentDTO?.code} - ${record?.businessDepartmentDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-content p-b--xs">
            {translate("PM.expense_detail")}
          </div>
        ),
        key: "expenseDetail",
        dataIndex: "expenseDetail",
        sorter: false,
        width: 200,
        render: (_text_, record) => {
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={record?.expenseDetail}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PM.amount_excluding_tax")}
            unit={model?.paymentDetailInfomation?.currencyDTO?.code}
          />
        ),
        key: "preTaxAmount",
        dataIndex: "preTaxAmount",
        width: 216,
        align: "right",
        sorter: false,
        render: (_text_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-total"
                  useTooltip
                  value={formatNumberToCurrency(
                    model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.reduce(
                      (total: number, item: { preTaxAmount: number }) =>
                        addNumbers(total || 0, Number(item?.preTaxAmount) || 0),
                      0
                    ),
                    roundNumber
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              {formatNumberToCurrency(record?.preTaxAmount, roundNumber)}
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-content p-b--xs">{translate("PM.tax_type")}</div>
        ),
        key: "taxDTO",
        dataIndex: "taxDTO",
        align: "left",
        sorter: false,
        width: 120,
        render: (_text_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={record.taxDTO?.name}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PM.tax_amount")}
            unit={model?.paymentDetailInfomation?.currencyDTO?.code}
          />
        ),
        key: "taxAmount",
        dataIndex: "taxAmount",
        align: "right",
        width: 160,
        sorter: false,
        render: (_text_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-total"
                  useTooltip
                  value={formatNumberToCurrency(
                    model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.reduce(
                      (total: number, item: { taxAmount: number }) =>
                        addNumbers(total || 0, Number(item?.taxAmount) || 0),
                      0
                    ),
                    roundNumber
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className="data-column"
                useTooltip
                value={formatNumberToCurrency(record?.taxAmount, roundNumber)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PM.total_amount")}
            unit={model?.paymentDetailInfomation?.currencyDTO?.code}
          />
        ),
        key: "totalAmount",
        dataIndex: "totalAmount",
        width: 145,
        align: "right",
        render: (text, record: CostAllocation) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-total"
                  useTooltip
                  value={formatNumberToCurrency(
                    model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.reduce(
                      (
                        total: number,
                        item: { preTaxAmount: number; taxAmount: number }
                      ) =>
                        addNumberRoundFour(
                          total || 0,
                          (item.preTaxAmount || 0) + (item.taxAmount || 0)
                        ),
                      0
                    ),
                    roundNumber
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className="data-column"
                useTooltip
                value={formatNumberToCurrency(
                  addNumberRoundFour(
                    record.preTaxAmount || 0,
                    record.taxAmount || 0
                  ),
                  roundNumber
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-content p-b--xs">
            {translate("PM.project_budget_item")}
          </div>
        ),
        key: "project",
        dataIndex: "project",
        align: "left",
        sorter: false,
        width: 213,
        render: (_text_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record.projectDTO?.code} - ${record.projectDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-content p-b--xs">{translate("PM.cost_line")}</div>
        ),
        key: "costLines",
        dataIndex: "costLines",
        align: "left",
        sorter: false,
        width: 213,
        render: (_text_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell position="left">
              <OneLineText
                className="data-column"
                useTooltip
                value={record.costLineDTO?.code}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, model?.paymentDetailInfomation]
  );

  const costAllocation =
    model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.map(
      (item: CostAllocation) => {
        return {
          businessBranchId: item.businessBranchDTO || null,
          businessUnitId: item.businessUnitDTO || null,
          businessDepartmentId: item.businessDepartmentDTO || null,
          projectId: item.projectDTO || null,
          costLineId: {
            id: item.costLineId,
          },
          preTaxAmount: item.preTaxAmount,
          taxAmount: item.taxAmount,
        };
      }
    );

  const purposeOfPurchase = {
    id: model?.paymentDetailInfomation?.paymentPurpose?.type,
  };

  const idsBudgetStatus = [
    ...(model?.paymentDetailInfomation?.applyAdvances?.map(
      (item: { id: string }) => item.id
    ) || []),
    ...(model?.paymentDetailInfomation?.refundPlanToSpents?.map(
      (item: { id: string }) => item.id
    ) || []),
  ];

  return (
    <div className="cost_allocation_detail p-x--sm">
      <div className="cost-allocation_method__wrapper">
        <div className="cost-allocation_method__header">
          <div className="cost-allocation_method__title">
            {translate("PM.cost_allocation_method")}
          </div>
          <div className="absolute_amount">
            <Select
              disabled
              value={get(
                model,
                "paymentDetailInfomation.costAllocation.costDriverDTO",
                ""
              )}
              classFilter={undefined}
              isSearch={false}
              isEnumerable={false}
              render={(t) => (t ? t?.name : "")}
            />
          </div>
          <div className="flex-1" />
          <Button
            icon={<img src={ViewBudgetIcon} alt="img" width={16} height={16} />}
            iconPlace="left"
            type="text"
            onClick={() => {
              setIsOpenModalBudgetOverView(true);
            }}
          >
            {translate("PM.view_budget_status")}
          </Button>
        </div>
      </div>
      <div className="page-master__table m-t--xs">
        <StandardTable
          rowKey="id"
          isDragable
          columns={columns}
          dataSource={[
            ...get(
              model,
              "paymentDetailInfomation.costAllocation.costAllocationLines",
              []
            ),
            {
              isTotal: true,
            },
          ]}
          scroll={{ y: "calc(100vh - 320px)" }}
          idContainer="table-id"
          className="payment-row_selection"
        />
      </div>

      {isOpenModalBudgetOverView && (
        <ModalBudgetStatus
          costAllocation={costAllocation}
          purposeOfPurchase={purposeOfPurchase}
          handleCancelModalBudgetStatus={() => {
            setIsOpenModalBudgetOverView(false);
          }}
          open
          ids={idsBudgetStatus}
          rate={model?.paymentDetailInfomation?.rateInfo?.rate}
          proposalId={model?.paymentDetailInfomation?.proposalId}
        />
      )}
    </div>
  );
};

export default CostAllocationTable;
