import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcGitFork, ViewBudgetIcon } from "assets/icons";
import add from "assets/icons/add.svg";
import ArrowDownIcon from "assets/icons/arrow_down.svg";
import classNames from "classnames";
import ModalBudgetStatus from "components/ModalBudgetStatus/ModalBudgetStatus";
import { NUMBER_MAX_13 } from "config/const";
import { NAME_BANK_REGEX } from "core/config/consts";
import {
  detectIntegerCurrency,
  getNumberTypeByCurrency,
} from "core/helpers/currency";
import {
  addNumberRoundFour,
  addNumbersDecimal,
  formatNumber,
  roundTo,
} from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue } from "core/services/service-types";
import { isEmpty, isEqual, isNil } from "lodash";
import {
  CODE_ABSOLUTEAMOUNT,
  COST_DRIVER_TYPE,
  CostAllocation,
  PaymentCreateModel,
  SHOPPING_PURPOSES,
  TypeFilterModel,
  VND_CURRENCY,
} from "models/Payment";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { convertToNumber } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { map, of } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import EmptyDataTable from "../EmptyDataTable/EmptyDataTable";
import ModalCostAllocation from "../ModalCostAllocation/ModalCostAllocation";
import "./CostAllocationMethod.scss";

function CostAllocationMethod() {
  const {
    model,
    paymentInheritanceInformation,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleClickAddCostAllocationLine,
    setModalCostAllocation,
    modalCostAllocation,
    formatNumberToCurrency,
    handleClickResetCostAllocationLine,
    costDriverDefault,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const [translate] = useTranslation();
  const { idDetail } = useParams() as { idDetail: string };

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  // = 0 kế thừa từ tờ trình chủ trương
  // = 1 kế thừa từ PO
  const isPaymentInheritance = [0, 1].includes(model.paymentInheritanceType);

  const maxDecimalPlaces = useMemo(() => {
    return model.costAllocation.reduce((acc, item) => {
      const preTaxDecimalLength =
        (item.preTaxAmount || 0).toString().split(".")[1]?.length || 0;
      const taxDecimalLength =
        (item.taxAmount || 0).toString().split(".")[1]?.length || 0;

      acc = Math.max(acc, preTaxDecimalLength, taxDecimalLength);

      return acc;
    }, 0);
  }, [model.costAllocation]);

  useEffect(() => {
    const costDriverDefault = model.costGroup?.costLines?.[0]?.costDriver;
    if (costDriverDefault) {
      handleChangeSingleField({
        fieldName: "costDriver",
      })(costDriverDefault);
    } else {
      getCostDriver();
    }
  }, [model.costGroup]);

  const getCostDriver = () => {
    paymentRepository.costDriver({}).subscribe({
      next: (response) => {
        const defaultCostDriver = response.find(
          (item) => item.code === CODE_ABSOLUTEAMOUNT
        );
        if (!model.costDriver) {
          handleChangeSingleField({
            fieldName: "costDriver",
          })(defaultCostDriver);
        }
      },
    });
  };

  const handleChangeItemTable = (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    fieldNameError: string
  ) => {
    const costAllocationEdit = model.costAllocation.map(
      (item: CostAllocation) => {
        if (item.id === id) {
          return {
            ...item,
            [fieldName]: objectValue || value,
          };
        }
        return item;
      }
    );
    handleChangeSingleField({
      fieldName: "costAllocation",
      errorName: fieldNameError,
    })(costAllocationEdit);
  };

  const handleChangeMultipleItemTable = (
    data: object,
    id: string,
    indexBeforeValidate: number,
    fieldNameError: string[]
  ) => {
    const costAllocationEdit = model.costAllocation.map(
      (item: CostAllocation) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }
    );

    if (fieldNameError && fieldNameError?.length > 0) {
      const errors = fieldNameError?.reduce(
        (acc: { [key: string]: null }, name) => {
          acc[
            `costAllocation.costAllocationLines[${indexBeforeValidate}].${name}`
          ] = null;
          return acc;
        },
        {}
      );

      handleChangeAllField({
        ...model,
        costAllocation: costAllocationEdit,
        errors: {
          ...model.errors,
          ...errors,
        },
      });
    } else {
      handleChangeAllField({
        ...model,
        costAllocation: costAllocationEdit,
      });
    }
  };

  const getListCostLines = (filter: TypeFilterModel, record: any) => {
    return of(record.projectId?.costLines || []).pipe(
      map((costLines: any[]) => {
        if (!filter.name?.trim()) {
          return costLines;
        } else {
          return costLines?.filter((period) =>
            period.code.includes(filter.name?.trim() as string)
          );
        }
      })
    );
  };

  const columns: ColumnProps<CostAllocation>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.branch_office")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "businessBranchId",
        dataIndex: "businessBranchId",
        width: 200,
        render: (text, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell>
                <label className="amount-title">{translate("PM.total")}</label>
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].businessBranchId`
                )}
              >
                <Select
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PM.payment_cn_pgd_placeholder")}
                  classFilter={DemoFilter}
                  isSearch
                  onChange={(value, objectValue) => {
                    handleChangeMultipleItemTable(
                      {
                        businessBranchId: objectValue,
                        costLineId: null,
                        projectId: null,
                      },
                      record.id,
                      record.indexBeforeValidate,
                      ["businessBranchId"]
                    );
                  }}
                  getList={(filter) =>
                    paymentRepository.listBusinessBranch({
                      ...filter,
                      ...paymentInheritanceInformation,
                    })
                  }
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessBranchId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.department_block")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "businessUnitId",
        dataIndex: "businessUnitId",
        width: 200,
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].businessUnitId`
                )}
              >
                <Select
                  isRequired
                  searchType=""
                  valueFilter={{
                    name: "",
                    ...paymentInheritanceInformation,
                  }}
                  classFilter={undefined}
                  placeHolder={translate("PM.payment_nhcd_placeholder")}
                  isSearch
                  onChange={(value, objectValue) => {
                    handleChangeMultipleItemTable(
                      {
                        businessUnitId: objectValue,
                        businessDepartmentId: null,
                        projectId: null,
                        costLineId: null,
                      },
                      record.id,
                      record.indexBeforeValidate,
                      ["businessUnitId"]
                    );
                  }}
                  getList={budgetRepository.costOwnerList}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessUnitId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.sub_department")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "businessDepartmentId",
        dataIndex: "businessDepartmentId",
        width: 200,
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].businessDepartmentId`
                )}
              >
                <Select
                  disabled={isEmpty(record.businessUnitId)}
                  placeHolder={translate("PM.payment_tt_pb_placeholder")}
                  isRequired
                  searchType=""
                  valueFilter={{
                    name: "",
                    businessUnitId: record.businessUnitId?.id || "",
                    ...paymentInheritanceInformation,
                  }}
                  classFilter={undefined}
                  isSearch
                  onChange={(value, objectValue) => {
                    handleChangeMultipleItemTable(
                      {
                        businessDepartmentId: objectValue,
                        costLineId: null,
                        projectId: null,
                      },
                      record.id,
                      record.indexBeforeValidate,
                      ["businessDepartmentId"]
                    );
                  }}
                  getList={paymentRepository.businessDepartment}
                  isEnumerable={false}
                  value={record?.businessDepartmentId}
                  appendToBody
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.expense_detail")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "expenseDetail",
        dataIndex: "expenseDetail",
        width: 200,
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].expenseDetail`
                )}
              >
                <InputText
                  isTableCell
                  isRequired
                  placeHolder={translate("PM.expense_detail_input")}
                  value={record?.expenseDetail}
                  onChange={(value: string) => {
                    handleChangeItemTable(
                      "expenseDetail",
                      value,
                      null,
                      record.id,
                      `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].expenseDetail`
                    );
                  }}
                  isByteCheck
                  maxLength={240}
                  translate={translate}
                  regexInput={NAME_BANK_REGEX}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("PM.amount_excluding_tax")}
            unit={model?.currency?.code}
            isRequire
          />
        ),
        key: "preTaxAmount",
        dataIndex: "preTaxAmount",
        width: 216,
        align: "right",
        render: (text, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model.costAllocation.reduce(
                      (total: string, item: CostAllocation) =>
                        addNumbersDecimal(total, item?.preTaxAmount || 0),
                      "0"
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].preTaxAmount`
                )}
              >
                <InputNumber
                  isInputRight
                  isTableCell
                  isRequired
                  placeHolder={translate("PM.plh_amount_excluding_tax")}
                  onChange={(value: number) => {
                    const taxAmount =
                      model.currency?.code != VND_CURRENCY
                        ? isNil(value)
                          ? 0
                          : value * (record?.taxType?.rate || 0) * 0.01
                        : Math.round(
                            isNil(value)
                              ? 0
                              : value * (record?.taxType?.rate || 0) * 0.01
                          );
                    const taxAmountRound = convertToNumber(
                      formatNumberToCurrency(taxAmount, true)
                    );
                    handleChangeMultipleItemTable(
                      {
                        taxAmount: taxAmountRound,
                        preTaxAmount: value,
                      },
                      record.id,
                      record.indexBeforeValidate,
                      ["preTaxAmount", "taxAmount"]
                    );
                  }}
                  value={record?.preTaxAmount ?? null}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.tax_type")}
            </label>
          </div>
        ),
        key: "taxType",
        dataIndex: "taxType",
        width: 120,
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <Select
                placeHolder={translate("PM.select_tax_type")}
                searchType=""
                valueFilter={{
                  name: "",
                  taxType: model.taxTypeEnum,
                }}
                classFilter={undefined}
                isSearch
                onChange={(value, objectValue) => {
                  const taxAmount =
                    (record?.preTaxAmount || 0) *
                    (objectValue?.rate || 0) *
                    0.01;
                  const taxAmountRound = convertToNumber(
                    formatNumberToCurrency(taxAmount, true)
                  );

                  handleChangeMultipleItemTable(
                    {
                      taxType: objectValue,
                      taxAmount:
                        model.currency?.code != VND_CURRENCY
                          ? taxAmountRound
                          : Math.round(taxAmount),
                    },
                    record.id,
                    record.indexBeforeValidate,
                    ["taxAmount"]
                  );
                }}
                getList={paymentRepository.taxType}
                isEnumerable={false}
                value={record?.taxType}
                appendToBody
                render={(tax) =>
                  tax?.id ? `${tax?.code} - ${tax?.name}` : null
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("PM.tax_amount")}
            unit={model?.currency?.code}
            isRequire
          />
        ),
        key: "taxAmount",
        dataIndex: "taxAmount",
        width: 160,
        align: "right",
        render: (text, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model.costAllocation.reduce(
                      (total: string, item: CostAllocation) =>
                        addNumbersDecimal(total || 0, item?.taxAmount || 0),
                      "0"
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].taxAmount`
                )}
              >
                <InputNumber
                  isInputRight
                  isTableCell
                  isRequired
                  disabled={isEmpty(record.taxType)}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "taxAmount",
                      value,
                      null,
                      record.id,
                      `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].taxAmount`
                    );
                  }}
                  value={record?.taxAmount}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("PM.total_amount")}
            unit={model?.currency?.code}
            isRequire
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
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    roundTo(
                      model.costAllocation.reduce(
                        (total: number, item: CostAllocation) =>
                          (total +=
                            (item.preTaxAmount || 0) + (item.taxAmount || 0)),
                        0
                      ),
                      detectIntegerCurrency(model?.currency?.code)
                        ? 0
                        : Math.min(maxDecimalPlaces, 4)
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
                  addNumberRoundFour(
                    record.preTaxAmount || 0,
                    record.taxAmount || 0
                  )
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.project_budget_item")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "project",
        dataIndex: "project",
        width: 214,
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].projectId`
                )}
              >
                <Select
                  disabled={
                    isEmpty(record.businessDepartmentId) ||
                    isEmpty(record.businessBranchId) ||
                    isEmpty(record.businessUnitId)
                  }
                  placeHolder={translate("PM.select")}
                  isRequired
                  searchType=""
                  valueFilter={{
                    name: "",
                    businessBranchId: record.businessBranchId?.id || "",
                    businessUnitId: record.businessUnitId?.id || "",
                    businessDepartmentId: record.businessDepartmentId?.id || "",
                    costGroupId: model.costGroupId,
                    isProject:
                      model?.purposeOfPurchase?.id ==
                      SHOPPING_PURPOSES.ACCORDING_PROJECT,
                    budgetId:
                      model?.purposeOfPurchase?.id ==
                      SHOPPING_PURPOSES.ACCORDING_PROJECT
                        ? model?.project?.id
                        : "",
                    ...paymentInheritanceInformation,
                  }}
                  classFilter={undefined}
                  isSearch
                  onChange={async (value, objectValue) => {
                    handleChangeMultipleItemTable(
                      {
                        projectId: objectValue,
                        costLineId: objectValue?.costLines?.[0],
                      },
                      record.id,
                      record?.indexBeforeValidate,
                      ["projectId", "costLineId"]
                    );
                  }}
                  getList={
                    record?.businessBranchId?.id ===
                      model.project?.businessBranch?.id &&
                    record?.businessBranchId?.id ===
                      model.project?.businessUnit?.id
                      ? () => of([model.project])
                      : model?.purposeOfPurchase?.id ==
                          SHOPPING_PURPOSES.ACCORDING_PROJECT &&
                        isEmpty(model.project)
                      ? () => of([])
                      : paymentRepository.projectByCostCenter
                  }
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record.projectId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            <label className={classNames("component__title p-b--xs")}>
              {translate("PM.cost_line")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "costLineId",
        dataIndex: "costLineId",
        width: 200,
        render: (text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].costLineId`
                )}
              >
                <Select
                  disabled={isEmpty(record?.projectId)}
                  placeHolder={translate("PM.select")}
                  isRequired
                  searchType=""
                  valueFilter={{
                    name: "",
                    budgetId: record?.projectId?.id || "",
                  }}
                  classFilter={undefined}
                  isSearch
                  onChange={(value, objectValue) => {
                    handleChangeItemTable(
                      "costLineId",
                      value,
                      objectValue,
                      record.id,
                      `costAllocation.costAllocationLines[${record?.indexBeforeValidate}].costLineId`
                    );
                  }}
                  getList={(search) => getListCostLines(search, record)}
                  render={(t) => (t ? t?.code : "")}
                  isEnumerable={false}
                  value={record?.costLineId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        fixed: "right",
        width: 40,
        render: (_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell className="action-column">
              <div className="payment-red cursor-pointer btn">
                <TrashCan
                  size={24}
                  onClick={() => handleDeleteRowConfirm(record.id)}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, translate]
  );

  const typeRowSelection: RowSelectionType = "checkbox";

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys.filter(Boolean));
    },
    selectedRowKeys,
    type: typeRowSelection,
    getCheckboxProps: (record: CostAllocation) => ({
      disabled: record?.isTotal,
    }),
    renderCell: (value: boolean, record: CostAllocation) => {
      if (record.isTotal) return null;
      return (
        <div className="d-flex justify-content-center align-items-center payment-height_40">
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
      );
    },
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleDeleteRow = () => {
    const costAllocation = model.costAllocation.filter(
      (item: CostAllocation) => item.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "costAllocation",
    })(costAllocation);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleBulkDeleteRow = () => {
    const costAllocationEdit = model.costAllocation.filter(
      (item: CostAllocation) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "costAllocation",
    })(costAllocationEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const [isOpenModalBudgetOverView, setIsOpenModalBudgetOverView] =
    useState(false);

  const checkShowViewBudgetStatus = () => {
    if (model.costAllocation?.length === 0) {
      return false;
    }
    return model.costAllocation?.some(
      (item) => item.costLineId && !isEmpty(item.preTaxAmount?.toString())
    );
  };

  const handleOpenModalAutoCostAllocation = () => {
    setModalCostAllocation({ type: "CREATE" });

    if (model?.paymentInheritanceType >= 0 || idDetail) {
      const taxTotalAmount = model.costAllocation.reduce(
        (total, item) => addNumberRoundFour(total || 0, item?.taxAmount || 0),
        0
      );
      const preTaxTotalAmount = model.costAllocation.reduce(
        (total, item) =>
          addNumberRoundFour(total || 0, item?.preTaxAmount || 0),
        0
      );

      handleChangeAllField({
        ...model,
        isPriceExcludingTax: model.isPriceExcludingTax ? true : false,
        autoCostAllocationDocumentsAttach:
          model?.autoCostAllocationDocumentsAttach?.length > 0
            ? model?.autoCostAllocationDocumentsAttach
            : model?.costAllocation?.map((item) => {
                return {
                  id: uuidv4(),
                  businessBranchId: item.businessBranchId,
                  businessDepartmentId: item.businessDepartmentId,
                  businessUnitId: item.businessUnitId,
                };
              }),
        taxId: model?.costAllocation?.[0]?.taxType,
        preTaxToTalAmount: preTaxTotalAmount,
        taxToTalAmount: taxTotalAmount,
        expenseDetail: model?.expenseDetail
          ? model?.expenseDetail
          : model?.costAllocation?.[0]?.expenseDetail,
        projectName: model?.projectName
          ? model?.projectName
          : model?.costAllocation?.[0]?.projectId,
        costLineId: model?.costLineId
          ? model?.costLineId
          : model?.costAllocation?.[0]?.costLineId,
        errors: {
          allocationMonth: null,
          autoCostAllocationDocumentsAttach: null,
          preTaxToTalAmountAuto: null,
          taxToTalAmountAuto: null,
          preTaxUnitPrice: null,
        },
      });
    } else {
      handleChangeAllField({
        ...model,
        isPriceExcludingTax: model.isPriceExcludingTax ? true : false,
        errors: {
          allocationMonth: null,
          autoCostAllocationDocumentsAttach: null,
          preTaxToTalAmountAuto: null,
          taxToTalAmountAuto: null,
          preTaxUnitPrice: null,
        },
      });
    }
  };

  const idsBudgetStatus = [
    ...(model?.advancePaymentList?.map((item) => item.id) || []),
    ...(model?.expenseApplicationList?.map((item) => item.id) || []),
  ];

  return (
    <div className="cost-allocation_method__wrapper">
      <div className="payment-cost-allocation_method__header">
        <div className="cost-allocation_method__costdriver">
          <div className="cost-allocation_method__title">
            {translate("PM.cost_allocation_method")}
          </div>
          <div className="absolute_amount">
            <Select
              disabled={model.costAllocation.length > 0}
              getList={paymentRepository.costDriver}
              value={model.costDriver}
              classFilter={undefined}
              isSearch={false}
              isEnumerable={false}
              valueFilter={{
                name: "",
              }}
              onChange={(id, value) => {
                handleChangeAllField({
                  ...model,
                  projectName: model.project ? model.project : null,
                  costLineId: model.project
                    ? model.project?.costLines?.[0]
                    : null,
                  allocationMonth: null,
                  expenseDetail: null,
                  preTaxToTalAmount: null,
                  taxToTalAmount: null,
                  taxId: null,
                  businessBranchId: null,
                  businessUnitId: null,
                  businessDepartmentId: null,
                  autoCostAllocationDocumentsAttach: null,
                  isPriceExcludingTax: null,
                  preTaxUnitPrice: null,
                });
                handleChangeSelectField({
                  fieldName: "costDriver",
                })(id, value);
              }}
              allowClear={false}
            />
          </div>
          {model.costDriver &&
            model.costDriver?.code !==
              COST_DRIVER_TYPE.COST_DRIVER_ABSOLUTE_AMOUNT && (
              <Button
                icon={<img src={IcGitFork} alt="img" width={16} height={16} />}
                iconPlace="left"
                type="text"
                onClick={handleOpenModalAutoCostAllocation}
              >
                {translate("PM.payment_auto_cost_allocation_btn")}
              </Button>
            )}
        </div>
        <div className="cost-allocation_method__action">
          {model.costAllocation?.length > 0 &&
            model.costDriver?.code ===
              COST_DRIVER_TYPE.COST_DRIVER_ABSOLUTE_AMOUNT && (
              <Button
                icon={<img src={add} alt="img" width={12} height={12} />}
                iconPlace="left"
                type="secondary"
                onClick={handleClickAddCostAllocationLine}
              >
                {translate("PM.add_row")}
              </Button>
            )}
          {isPaymentInheritance &&
            model?.costDriver?.code ===
              COST_DRIVER_TYPE.COST_DRIVER_ABSOLUTE_AMOUNT &&
            costDriverDefault ===
              COST_DRIVER_TYPE.COST_DRIVER_ABSOLUTE_AMOUNT &&
            model?.costAllocation?.length <= 0 && (
              <Button
                icon={
                  <img src={ArrowDownIcon} alt="img" width={16} height={16} />
                }
                iconPlace="left"
                type="secondary"
                onClick={handleClickResetCostAllocationLine}
              >
                {translate("PM.btn_taken_from_ttct")}
              </Button>
            )}
          <div className="flex-1" />
          <Button
            icon={<img src={ViewBudgetIcon} alt="img" width={16} height={16} />}
            iconPlace="left"
            type="text"
            onClick={() => {
              setIsOpenModalBudgetOverView(true);
            }}
            disabled={!checkShowViewBudgetStatus()}
          >
            {translate("PM.view_budget_status")}
          </Button>
        </div>
      </div>
      <div className="cost-allocation_method__table">
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button type="secondary" size="sm" onClick={handleBulkDelete}>
            {translate("CL.delete_btn")}
          </Button>
        </ActionBarComponent>
        {model.costAllocation.length === 0 ? (
          <EmptyDataTable />
        ) : (
          <StandardTable
            rowKey={"id"}
            columns={columns}
            dataSource={[
              ...model.costAllocation,
              {
                isTotal: true,
              },
            ]}
            isDragable={true}
            rowSelection={rowSelection}
            idContainer="table-id"
            rowClassName="cost-allocation-row payment-custom_row_table"
            scroll={{ y: "calc(100vh - 320px)" }}
            className="cost-allocation-row_selection payment-custom_table"
          />
        )}
        <ModalConfirm
          open={isOpenModelConfirmDeleteRow}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("PM.confirm_delete_cost_allocation_line")}
          content={translate("PM.delete_cost_allocation_line_warning")}
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
          title={translate("PM.confirm_delete_cost_allocation_line")}
          content={translate("PM.delete_cost_allocation_line_warning")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={() => {
            handleBulkDeleteRow();
          }}
          handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        />
        {isOpenModalBudgetOverView && (
          <ModalBudgetStatus
            costAllocation={model?.costAllocation}
            purposeOfPurchase={model?.purposeOfPurchase}
            handleCancelModalBudgetStatus={() => {
              setIsOpenModalBudgetOverView(false);
            }}
            open
            ids={idsBudgetStatus}
            rate={
              model?.currency?.code != VND_CURRENCY ? model?.rateInfo?.rate : 1
            }
            proposalId={model?.proposalId}
          />
        )}
        {isEqual(modalCostAllocation.type, "CREATE") && (
          <ModalCostAllocation
            key={modalCostAllocation.type}
            changeSelectedRowKeys={setSelectedRowKeys}
          />
        )}
      </div>
    </div>
  );
}

export default CostAllocationMethod;
