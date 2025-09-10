import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { addNumberRoundTwo, addNumbers, roundTo } from "core/helpers/number";
import { get } from "lodash";
import { CostAllocation, PaymentDetailModel } from "models/Payment";
import { useContext, useMemo } from "react";
import {
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
              <label className="amount-title p-l--2xs">
                {translate("PM.total")}
              </label>
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
                    roundTo(
                      model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.reduce(
                        (total: number, item: { preTaxAmount: number }) =>
                          addNumbers(
                            total || 0,
                            Number(item?.preTaxAmount) || 0
                          ),
                        0
                      ),
                      isVNDOrJPY ? 0 : 4
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              {formatNumberToCurrency(
                roundTo(record?.preTaxAmount, isVNDOrJPY ? 0 : 4)
              )}
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
                    roundTo(
                      model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.reduce(
                        (total: number, item: { taxAmount: number }) =>
                          addNumbers(total || 0, Number(item?.taxAmount) || 0),
                        0
                      ),
                      isVNDOrJPY ? 0 : 4
                    )
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
                  roundTo(record?.taxAmount, isVNDOrJPY ? 0 : 4)
                )}
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
                    roundTo(
                      model?.paymentDetailInfomation?.costAllocation?.costAllocationLines?.reduce(
                        (
                          total: number,
                          item: { preTaxAmount: number; taxAmount: number }
                        ) =>
                          addNumberRoundTwo(
                            total || 0,
                            (item.preTaxAmount || 0) + (item.taxAmount || 0)
                          ),
                        0
                      ),
                      isVNDOrJPY ? 0 : 2
                    )
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
                  roundTo(
                    addNumberRoundTwo(
                      record.preTaxAmount || 0,
                      record.taxAmount || 0
                    ),
                    isVNDOrJPY ? 0 : 2
                  )
                )}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, model?.paymentDetailInfomation]
  );

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
    </div>
  );
};

export default CostAllocationTable;
