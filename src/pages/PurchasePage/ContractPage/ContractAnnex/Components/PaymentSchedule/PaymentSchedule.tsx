import { Tooltip } from "antd";
import type { ColumnProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { IcPencilSvg, IcPlusSVG, IcTrashRed } from "assets/icons";
import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import {
  CalculationValue,
  listValueCalculationPaymentSchedule,
  PaymentTimeType,
} from "config/const";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { get, isEmpty, isEqual, isNil, isNumber, isUndefined } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { PaymentSchedules } from "models/Contract/Contract";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { Dispatch, useEffect, useState } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import PaymentScheduleModal from "../Modal/PaymentScheduleModal/PaymentScheduleModal";
import styles from "./PaymentSchedule.module.scss";
import usePaymentScheduleHooks, { TypeAction } from "./PaymentScheduleHooks";
import ErrorRow from "components/TableCustom/ErrorRow";
import { Model } from "react-3layer-common";
import { useCalculatorContract } from "../hooks/useCaculatorContract";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex/ContractAnnex";

interface PaymentScheduleProps<T> {
  isEditMode?: boolean;
  model: T & {
    contractAppendixPaymentSchedules?: PaymentSchedules[];
    errors?: Model.Errors<Model>;
    contractAppendixGoodsItems?: SelectAdjustableGoodsServicesModel[];
    calculationValue?: OptionBaseModel | CalculationValue;
    contractInfo?: {
      contractValue?: number;
      currency?: string;
    };
  };
  dispatch?: Dispatch<GeneralAction<T>>;
}

export default function PaymentSchedule<T>({
  isEditMode,
  model,
  dispatch,
}: PaymentScheduleProps<T>) {
  const [translate] = useTranslation();
  const {
    calculationValue,
    calculationSelected,
    typeAction,
    detailModel,
    paymentSchedules,
    selectedRowKeys,
    rowSelection,
    handleAction,
    setSelectedRowKeys,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    handleClose,
    handleAddPaymentSchedule,
    handleDeleteContractTerms,
  } = usePaymentScheduleHooks<T>({ model, onDispatch: dispatch });

  const { contractValue } = useCalculatorContract({
    contractValueOrigin: model?.contractInfo?.contractValue,
    goodServices: model?.contractAppendixGoodsItems,
  });

  const paymentScheduleModalProps = {
    calculationValue: calculationSelected,
    onClose: handleClose,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeMultipleSelectField,
    model: detailModel,
    onAddPaymentSchedule: handleAddPaymentSchedule,
    currency: model?.contractInfo?.currency,
    contractValue,
  };

  const addPaymentSchedule = () => {
    if (!isEditMode) return;

    return (
      <Button
        icon={<img src={IcPlusSVG} alt="" />}
        iconPlace="left"
        className="w-fit"
        type="secondary"
        onClick={() => handleAction(TypeAction.CREATE, null)}
      >
        {translate("CT.add_payment_schedule")}
      </Button>
    );
  };

  const isTotalRow = (record: PaymentSchedules) => {
    return isNil(record?.id);
  };

  const [total, setTotal] = useState<PaymentSchedules[]>([]);

  useEffect(() => {
    const paymentSchedule = new PaymentSchedules();
    if (isEmpty(paymentSchedules)) {
      return setTotal([]);
    }

    const itemTop = paymentSchedules.reduce(
      (sum, item) => ({
        ...sum,
        amount: sum.amount + item.amount,
        percent: sum.percent + item.percent,
      }),
      {
        ...paymentSchedule,
        amount: 0,
        percent: 0,
        paymentBatch: translate("CT.total"),
      }
    );

    setTotal([itemTop]);
  }, [model.contractAppendixPaymentSchedules, paymentSchedules, translate]);

  const columns: ColumnProps<PaymentSchedules>[] = [
    {
      key: "id",
      width: 40,
      fixed: "left",
      render: (record, _, index) => {
        const isTotal = isTotalRow(record);

        const errorMessageTotal = get(
          model?.errors,
          "contractAppendixPaymentSchedules"
        );
        if (
          (isTotal && isUndefined(errorMessageTotal)) ||
          (!isTotal && errorMessageTotal)
        )
          return <></>;
        const message =
          get(
            model?.errors,
            `contractAppendixPaymentSchedules[${index - 1}].amount`
          ) ||
          get(
            model?.errors,
            `contractAppendixPaymentSchedules[${index - 1}].percent`
          ) ||
          get(
            model?.errors,
            `contractAppendixPaymentSchedules[${index - 1}].paymentDay`
          ) ||
          get(
            model?.errors,
            `contractAppendixPaymentSchedules[${
              index - 1
            }].paymentMilestoneType`
          );
        return <ErrorRow message={errorMessageTotal || message} />;
      },
      hidden: !isEditMode,
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.payment_period")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "paymentBatch",
      dataIndex: "paymentBatch",
      width: 200,
      ellipsis: true,
      render: (value: string, record) => {
        const isTotal = isTotalRow(record);
        return (
          <LayoutCell>
            <OneLineText
              className={classNames({
                [styles["font-bolder"]]: isTotal,
              })}
              value={value}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.proposal_type")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "suggestionType",
      dataIndex: "suggestionType",
      width: 140,
      render: (value: OptionBaseModel) => {
        return (
          <LayoutCell>
            <OneLineText value={value?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.payment_term")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "paymentTerm",
      dataIndex: "paymentTerm",
      width: 140,
      render: (value: string) => {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
      hidden: calculationSelected !== CalculationValue.PAYMENT_TERM,
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.percentage_rate")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "percent",
      dataIndex: "percent",
      width: 140,
      render: (value: number, record) => {
        const isTotal = isTotalRow(record);
        const percent = isNumber(value) ? `${formatNumber(value)}%` : "";

        return (
          <LayoutCell>
            <OneLineText
              className={classNames({
                [styles["font-bolder"]]: isTotal,
              })}
              value={percent}
            />
          </LayoutCell>
        );
      },
      hidden: calculationSelected !== CalculationValue.PERCENTAGE_RATE,
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.amount")}
          unit={model?.contractInfo?.currency}
        />
      ),
      key: "amount",
      dataIndex: "amount",
      ellipsis: true,
      width: 140,
      align: "right",
      render: (value: number, record) => {
        const isTotal = isTotalRow(record);
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                [styles["font-bolder"]]: isTotal,
              })}
              value={formatCurrency({
                value,
                code: model?.contractInfo?.currency,
                shouldRoundTwoNumber:
                  calculationSelected === CalculationValue.PERCENTAGE_RATE,
              })}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.payment_condition")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "paymentCondition",
      dataIndex: "paymentCondition",
      ellipsis: true,
      width: 215,
      render: (value: string) => {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.payment_documents")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "referenceDocument",
      dataIndex: "referenceDocument",
      ellipsis: true,
      width: 250,
      render: (value: string) => {
        return (
          <LayoutCell>
            <Tooltip title={value}>
              <p className="text-break-line">{value}</p>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.payment_reminder")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "paymentTimeType",
      ellipsis: true,
      width: 324,
      render: (record: PaymentSchedules) => {
        const paymentTimeType = record?.paymentTimeType?.id;
        const isDays = isEqual(paymentTimeType, PaymentTimeType.DAYS);
        const valueLeft = isDays
          ? (record?.paymentDay as unknown as string)
          : record?.paymentDay?.name;
        const valueRight = isDays
          ? record?.paymentMilestoneType?.name
          : record?.months?.map((item) => item?.name).join(", ");

        return (
          <LayoutCell>
            <div className={styles["payment-day"]}>
              <OneLineText value={valueLeft} />
            </div>
            <OneLineText value={valueRight} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("CT.note")}
          className={styles["unit-hidden"]}
        />
      ),
      key: "description",
      dataIndex: "description",
      ellipsis: true,
      width: 215,
      render: (value: string) => {
        return (
          <LayoutCell>
            <Tooltip title={value}>
              <p className="text-break-line">{value}</p>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      key: "id",
      dataIndex: "id",
      width: 90,
      fixed: "right",
      render: (id: string, record) => {
        const isTotal = isTotalRow(record);
        if (isTotal || isEqual(record?.canDelete, false)) return null;

        const handleClick = (action: TypeAction) => {
          handleAction(action, id);
        };

        return (
          <LayoutCell>
            <div className="action-row">
              <button onClick={() => handleClick(TypeAction.EDIT)}>
                <img src={IcPencilSvg} alt="" />
              </button>
              <button onClick={() => handleClick(TypeAction.DELETE)}>
                <img src={IcTrashRed} alt="" />
              </button>
            </div>
          </LayoutCell>
        );
      },
      hidden: !isEditMode,
    },
  ];

  const rowSelections: TableRowSelection<PaymentSchedules> = {
    ...rowSelection,
    renderCell: (_: boolean, record, __: number, originNode) => {
      if (isTotalRow(record) || isEqual(record?.canDelete, false)) return <></>;
      return originNode;
    },
    getCheckboxProps: (record) => {
      const isTotal = isTotalRow(record);
      return {
        disabled: isTotal || isEqual(record?.canDelete, false),
      };
    },
  };

  const items = [
    {
      key: 0,
      label: translate("CA.tab_payment_schedule"),
      children: (
        <div className="d-flex flex-column gap-2">
          <div className={styles["calculation-select"]}>
            <label>{translate("CT.value_calculation")}</label>
            <Select
              valueFilter={{
                name: "",
              }}
              classFilter={undefined}
              value={calculationValue || listValueCalculationPaymentSchedule[0]}
              getList={() => of(listValueCalculationPaymentSchedule)}
              onChange={(_, option) => {
                dispatch({
                  type: GeneralActionEnum.UPDATE,
                  payload: {
                    calculationValue: option,
                  } as T,
                });
              }}
              disabled={Boolean(paymentSchedules?.length)}
              readOnly={!isEditMode}
              allowClear={false}
              isSearch={false}
            />
          </div>
          <TableWithEmpty
            emptyExtra={<CloudyEmpty>{addPaymentSchedule()}</CloudyEmpty>}
            list={[...total, ...paymentSchedules]}
            className={styles["custom-table"]}
            rowSelection={isEditMode ? rowSelections : undefined}
            columns={columns}
            scroll={{ y: "calc(100vh - 416px)" }}
            actionBarComponent={
              <>
                {addPaymentSchedule()}
                <ActionBarComponent
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                >
                  <Button
                    type="secondary"
                    size="sm"
                    onClick={() => handleAction(TypeAction.DELETE, null)}
                  >
                    {translate("CM.txt_delete")}
                  </Button>
                </ActionBarComponent>
              </>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles["content-collapse"]}>
        <AdvancedCollapseView items={items} />
      </div>
      {[TypeAction.CREATE, TypeAction.EDIT].includes(typeAction) && (
        <PaymentScheduleModal {...paymentScheduleModalProps} />
      )}

      {isEqual(typeAction, TypeAction.DELETE) && (
        <DeleteRecordModal
          handleCancel={handleClose}
          handleConfirm={handleDeleteContractTerms}
          title={translate("CT.confirm_delete_base")}
          content={translate("CT.delete_base_warning")}
          loading={false}
          open
        />
      )}
    </>
  );
}
