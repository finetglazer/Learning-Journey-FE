import { AddAlt, TrashCan } from "@carbon/icons-react";
import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcPencilSvg } from "assets/icons";
import { LoadingCM } from "components";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { CalculationValue, PaymentTimeType } from "config/const";
import {
  PAYMENT_CREATE_ADVANCE_ROUTE,
  PAYMENT_CREATE_DEPOSIT_ROUTE,
  PAYMENT_CREATE_EXPENSE_ROUTE,
  PAYMENT_CREATE_ROUTE,
} from "config/route-const";
import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import {
  addNumberRoundFour,
  addNumbers,
  formatNumber,
  roundTo,
} from "core/helpers/number";
import { isEqual } from "lodash";
import { ContractDetailModel, PaymentSchedules } from "models/Contract";
import {
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  TYPE_PAYMENT_REQUEST_CONTRACT,
} from "models/Payment/PaymentRequestConstant";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import React, { Key, useContext, useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { lastValueFrom } from "rxjs";
import "./PaymentScheduleTable.scss";

const PaymentScheduleTable = () => {
  const [translate] = useTranslation();
  const {
    model,
    handleChangeSingleField,
    setIsOpenModalPaymentSchedule,
    setRecordEditPaymentSchedule,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const typeRowSelection: RowSelectionType = "checkbox";
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");
  const history = useHistory();
  const { id: idDetail } = useParams<{ id: string }>();
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  const roundNumber = useMemo(
    () =>
      isEqual(model?.currency, VND_CURRENCY_UNIT) ||
      isEqual(model?.currency, JPY_CURRENCY_UNIT)
        ? 0
        : 4,
    [model?.currency]
  );

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    getCheckboxProps: (record: PaymentSchedules) => ({
      disabled: record?.isTotal,
    }),
    renderCell: (value: boolean, record: PaymentSchedules) => {
      if (record.isTotal) return null;
      return (
        <LayoutCell>
          <div className="text-pre-wrap">
            <Checkbox
              checked={value}
              onChange={(e) => {
                if (e) {
                  setSelectedRowKeys([...selectedRowKeys, record.id]);
                } else {
                  setSelectedRowKeys(
                    selectedRowKeys.filter((key) => key !== record.id)
                  );
                }
              }}
            />
          </div>
        </LayoutCell>
      );
    },
  };

  const isPaymentTerm =
    model?.calculationValue?.id == CalculationValue.PAYMENT_TERM;
  const isPercentageRate =
    model?.calculationValue?.id == CalculationValue.PERCENTAGE_RATE;

  const handleEditRow = (record: PaymentSchedules) => {
    setRecordEditPaymentSchedule(record);
    setIsOpenModalPaymentSchedule(true);
  };

  const handlePressCreatePayment = async (record: PaymentSchedules) => {
    try {
      setIsLoadingPage(true);
      const requestBody = {
        contractId: idDetail,
        paymentScheduleInfoId: record?.id,
      };
      const response = await lastValueFrom(
        paymentRepository.createPaymentContract(requestBody)
      );
      setIsLoadingPage(false);
      switch (record?.suggestionType?.id) {
        case TYPE_PAYMENT_REQUEST_CONTRACT.PAYMENT:
          history.push(PAYMENT_CREATE_ROUTE, {
            result: response,
            paymentInheritanceId: idDetail,
            paymentScheduleInfoId: record?.id,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO,
          });
          break;

        case TYPE_PAYMENT_REQUEST_CONTRACT.ADVANCE:
          history.push(PAYMENT_CREATE_ADVANCE_ROUTE, {
            result: response,
            paymentInheritanceId: idDetail,
            paymentScheduleInfoId: record?.id,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO,
          });
          break;
        case TYPE_PAYMENT_REQUEST_CONTRACT.SPENDING:
          history.push(PAYMENT_CREATE_EXPENSE_ROUTE, {
            result: response,
            paymentInheritanceId: idDetail,
            paymentScheduleInfoId: record?.id,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO,
          });
          break;
        case TYPE_PAYMENT_REQUEST_CONTRACT.DEPOSIT:
          history.push(PAYMENT_CREATE_DEPOSIT_ROUTE, {
            result: response,
            paymentInheritanceId: idDetail,
            paymentScheduleInfoId: record?.id,
            paymentInheritanceType:
              PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO,
          });
          break;
      }
    } catch (error) {
      setIsLoadingPage(false);
      console.log("error", error);
    }
  };

  const columns: ColumnProps<PaymentSchedules>[] = React.useMemo(
    () => [
      {
        title: () => (
          <UnitTitle title={translate("CT.payment_period")} unit={" "} />
        ),
        key: "paymentBatch",
        dataIndex: "paymentBatch",
        width: 200,
        ellipsis: true,
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <label className="fw-bold p-x--2xs">
                {translate("CT.total")}
              </label>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                className="text-pre-wrap"
                value={record?.paymentBatch}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("CT.proposal_type")} unit={" "} />
        ),
        key: "paymentTimeType",
        dataIndex: "paymentTimeType",
        width: 140,
        render: (_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="text-pre-wrap"
                value={record?.suggestionType?.name}
              />
            </LayoutCell>
          );
        },
      },
      isPaymentTerm
        ? {
            title: () => (
              <UnitTitle title={translate("CT.payment_term")} unit={" "} />
            ),
            key: "payment_term",
            dataIndex: "payment_term",
            width: 140,
            render: (_, record) => {
              if (record.isTotal) return null;
              return (
                <LayoutCell>
                  <OneLineText value={record?.paymentTerm} />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      isPercentageRate
        ? {
            title: () => (
              <UnitTitle title={translate("CT.percentage_rate")} unit={" "} />
            ),
            key: "payment_term",
            dataIndex: "payment_term",
            width: 140,
            render: (_, record) => {
              if (record.isTotal)
                return (
                  <label className="fw-bold p-x--2xs">
                    {formatNumber(
                      model?.paymentSchedules?.reduce((prev, curr) => {
                        return addNumbers(prev, curr.percent);
                      }, 0)
                    )}
                    %
                  </label>
                );
              return (
                <LayoutCell>
                  <OneLineText
                    className="text-pre-wrap"
                    value={`${formatNumber(record?.percent)}%`}
                  />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      {
        title: () => (
          <UnitTitle
            title={translate("CT.amount")}
            unit={model?.currency || " "}
          />
        ),
        key: "amount",
        dataIndex: "amount",
        ellipsis: true,
        width: 140,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <label className="fw-bold p-x--2xs">
                {formatNumber(
                  roundTo(
                    model?.paymentSchedules?.reduce((prev, curr) => {
                      return addNumberRoundFour(prev, curr.amount);
                    }, 0),
                    roundNumber
                  )
                )}
              </label>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className="text-pre-wrap"
                value={formatNumber(record?.amount)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("CT.payment_condition")} unit={" "} />
        ),
        key: "paymentCondition",
        dataIndex: "paymentCondition",
        ellipsis: true,
        width: 215,
        render: (_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="text-pre-wrap"
                value={record?.paymentCondition}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("CT.payment_documents")} unit={" "} />
        ),
        key: "referenceDocument",
        dataIndex: "referenceDocument",
        ellipsis: true,
        width: 250,
        render: (_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                value={record?.referenceDocument}
                className="text-pre-wrap"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("CT.payment_reminder")} unit={" "} />
        ),
        key: "payment_reminder",
        dataIndex: "payment_reminder",
        ellipsis: true,
        width: 324,
        render: (_, record) => {
          if (record.isTotal) return null;
          const paymentReminder = getPaymentReminder(record);
          return (
            <LayoutCell>
              <Tooltip placement="top" title={paymentReminder}>
                <div className="d-flex">
                  <div className="text-payment-day">
                    {formatNumber(
                      record?.paymentDay?.id || Number(record?.paymentDay)
                    )}
                  </div>
                  <div className="text-payment-reminder">{paymentReminder}</div>
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: () => <UnitTitle title={translate("CT.note")} unit={" "} />,
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        width: 215,
        render: (_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="text-pre-wrap"
                value={record?.description}
              />
            </LayoutCell>
          );
        },
      },
      model?.isDetail && !model?.isSuggestive
        ? {
            width: 0,
          }
        : {
            title: "",
            key: "action",
            fixed: "right",
            dataIndex: "action",
            width: model?.isDetail ? 40 : 80,
            render: (_, record) => {
              if (record.isTotal) return null;

              if (model?.isSuggestive) {
                return (
                  <LayoutCell>
                    <div className="icon cursor-pointer btn">
                      <AddAlt
                        size={20}
                        onClick={() => handlePressCreatePayment(record)}
                      />
                    </div>
                  </LayoutCell>
                );
              }

              return (
                <LayoutCell>
                  <div
                    className="payment-red cursor-pointer btn m-l--xs"
                    onClick={() => handleEditRow(record)}
                  >
                    <img
                      src={IcPencilSvg}
                      alt="edit"
                      width={20}
                      height={20}
                      className="m-r--sm"
                    />
                  </div>
                  <div className="payment-red cursor-pointer btn">
                    <TrashCan
                      size={20}
                      onClick={() => handleDeleteRowConfirm(record.id)}
                    />
                  </div>
                </LayoutCell>
              );
            },
          },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPaymentTerm, isPercentageRate, translate, model?.paymentSchedules]
  );

  const getPaymentReminder = (record: PaymentSchedules) => {
    if (record?.paymentTimeType?.id === PaymentTimeType.DAYS) {
      return record?.paymentMilestoneType?.name;
    }
    if (record?.paymentTimeType?.id === PaymentTimeType.DATE) {
      return record?.months.map((month) => month?.name).join(", ");
    }
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const paymentSchedulesEdit = model.paymentSchedules.filter(
      (item: PaymentSchedules) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "paymentSchedules",
    })(paymentSchedulesEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const paymentSchedulesEdit = model.paymentSchedules.filter(
      (item: PaymentSchedules) => item.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "paymentSchedules",
    })(paymentSchedulesEdit);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  return (
    <div className="payment-schedule-table">
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      <StandardTable
        rowKey={"id"}
        columns={columns}
        rowSelection={model?.isDetail ? null : rowSelection}
        dataSource={[
          {
            isTotal: true,
          },
          ...(model?.paymentSchedules || []),
        ]}
        isDragable={true}
        idContainer="table-id"
        rowClassName="cost-allocation-row"
        scroll={{ y: "calc(100vh - 320px)" }}
        className="cost-allocation-row_selection"
      />
      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.confirm_delete_base")}
        content={translate("CT.delete_base_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.confirm_delete_base")}
        content={translate("CT.delete_base_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
      {isLoadingPage && <LoadingCM />}
    </div>
  );
};

export default PaymentScheduleTable;
