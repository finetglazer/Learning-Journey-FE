import { ColumnProps } from "antd/lib/table";
import { useMemo } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { toFixedNumber } from "core/helpers/calculator";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import {
  BusinessUnitDTOModel,
  ExChangeRateModel,
  PaymentTypeApplicationModel,
} from "models/Payment";
import { LayoutCell, OneLineText } from "react-components-design-system";
import "./useColumnApplicationTypeView.scss";

type props = {
  translate: (key: string) => string;
  formatNumberToCurrency: (value: number) => string;
  advancePaymentList?: PaymentTypeApplicationModel[];
  expenseApplicationList?: PaymentTypeApplicationModel[];
  depositApplicationList?: PaymentTypeApplicationModel[];
};

const useColumnApplicationTypeView = ({
  translate,
  formatNumberToCurrency,
  advancePaymentList,
  expenseApplicationList,
  depositApplicationList,
}: props) => {
  const columnsAdvancePaymentView: ColumnProps<PaymentTypeApplicationModel>[] =
    useMemo(
      () =>
        [
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_advance_code_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "code",
            dataIndex: "code",
            sorter: false,
            width: 180,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="left">
                    <label className="summary-column_payment_title ms-0">
                      {translate("PM.total")}
                    </label>
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={value} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_advance_description_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "description",
            dataIndex: "description",
            width: 485,
            sorter: false,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={value} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_advance_create_date_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "actionDate",
            dataIndex: "actionDate",
            width: 150,
            sorter: false,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={dayjs(value).format(STANDARD_DATE_FORMAT_SLASH)}
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.table_money_type")}
                </label>
              </div>
            ),
            key: "currency",
            dataIndex: "currency",
            width: 74,
            sorter: false,
            render(
              currency: BusinessUnitDTOModel,
              record: PaymentTypeApplicationModel
            ) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={currency?.code} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14 d-flex justify-content-end">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.payment_exchange_rate_input_label")}
                </label>
              </div>
            ),
            key: "rateInfo",
            dataIndex: "rateInfo",
            width: 80,
            sorter: false,
            render(
              rateInfo: ExChangeRateModel,
              record: PaymentTypeApplicationModel
            ) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumberToCurrency(rateInfo?.rate || 0)}
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14 d-flex justify-content-end">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_advance_amount_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "amount",
            dataIndex: "amount",
            width: 145,
            sorter: false,
            render(amount: number, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      className="summary-column_payment_title"
                      value={formatNumberToCurrency(
                        advancePaymentList.reduce(
                          (total, item) => total + (item.amount || 0),
                          0
                        )
                      )}
                      useTooltip={true}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumberToCurrency(amount || 0)}
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14 d-flex justify-content-end">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_advance_amount_request_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "amount",
            dataIndex: "amount",
            width: 176,
            sorter: false,
            render(amount: number, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      className="summary-column_payment_title"
                      value={formatNumber(
                        toFixedNumber(
                          advancePaymentList.reduce(
                            (total, item) =>
                              total + (item.amount * item?.rateInfo?.rate || 0),
                            0
                          ),
                          0
                        )
                      )}
                      useTooltip={true}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumber(
                      toFixedNumber(amount * record?.rateInfo?.rate || 0, 0)
                    )}
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
        ].filter(Boolean),
      [advancePaymentList]
    );

  const columnsExpenseView: ColumnProps<PaymentTypeApplicationModel>[] =
    useMemo(
      () =>
        [
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.payment_code_expense")}
                </label>
              </div>
            ),
            key: "code",
            dataIndex: "code",
            sorter: false,
            width: 180,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="left">
                    <label className="summary-column_payment_title ms-0">
                      {translate("PM.total")}
                    </label>
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={value} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.payment_interpretation_expense")}
                </label>
              </div>
            ),
            key: "description",
            dataIndex: "description",
            sorter: false,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={value} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.time_of_use_hhdv")}
                </label>
              </div>
            ),
            key: "startPeriod",
            dataIndex: "startPeriod",
            width: 200,
            sorter: false,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={
                      value
                        ? `${dayjs(value).format(
                            STANDARD_DATE_FORMAT_SLASH
                          )} - ${dayjs(record?.endPeriod).format(
                            STANDARD_DATE_FORMAT_SLASH
                          )}`
                        : ""
                    }
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.table_money_type")}
                </label>
              </div>
            ),
            key: "currency",
            dataIndex: "currency",
            width: 74,
            sorter: false,
            render(
              currency: BusinessUnitDTOModel,
              record: PaymentTypeApplicationModel
            ) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={currency?.code} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14 d-flex justify-content-end">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.payment_amount_expense")}
                </label>
              </div>
            ),
            key: "amount",
            dataIndex: "amount",
            width: 140,
            sorter: false,
            render(amount: number, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      className="summary-column_payment_title"
                      value={formatNumberToCurrency(
                        expenseApplicationList.reduce(
                          (total, item) => total + (item.amount || 0),
                          0
                        )
                      )}
                      useTooltip={true}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumberToCurrency(amount || 0)}
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
        ].filter(Boolean),
      [expenseApplicationList]
    );

  const columnsDepositView: ColumnProps<PaymentTypeApplicationModel>[] =
    useMemo(
      () =>
        [
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_deposit_code_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "code",
            dataIndex: "code",
            sorter: false,
            width: 180,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="left">
                    <label className="summary-column_payment_title ms-0">
                      {translate("PM.total")}
                    </label>
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={value} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_deposit_description_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "description",
            dataIndex: "description",
            sorter: false,
            width: 903,
            render(value: string, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={value} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate("PM.table_money_type")}
                </label>
              </div>
            ),
            key: "currency",
            dataIndex: "currency",
            width: 74,
            sorter: false,
            render(
              currency: BusinessUnitDTOModel,
              record: PaymentTypeApplicationModel
            ) {
              if (record.isTotal) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={currency?.code} useTooltip={true} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <div className="payment-font-14 d-flex justify-content-end">
                <label className={classNames("component__title text-nowrap")}>
                  {typeof translate === "function" &&
                    translate(
                      "PM.payment_table_title_deposit_amount_payment_application"
                    )}
                </label>
              </div>
            ),
            key: "amount",
            dataIndex: "amount",
            width: 145,
            sorter: false,
            render(amount: number, record: PaymentTypeApplicationModel) {
              if (record.isTotal) {
                return (
                  <LayoutCell position="right">
                    <OneLineText
                      className="summary-column_payment_title"
                      value={formatNumberToCurrency(
                        depositApplicationList.reduce(
                          (total, item) => total + (item.amount || 0),
                          0
                        )
                      )}
                      useTooltip={true}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="right">
                  <OneLineText
                    value={formatNumberToCurrency(amount || 0)}
                    useTooltip={true}
                  />
                </LayoutCell>
              );
            },
          },
        ].filter(Boolean),
      [depositApplicationList]
    );

  return {
    columnsAdvancePaymentView,
    columnsExpenseView,
    columnsDepositView,
  };
};

export default useColumnApplicationTypeView;
