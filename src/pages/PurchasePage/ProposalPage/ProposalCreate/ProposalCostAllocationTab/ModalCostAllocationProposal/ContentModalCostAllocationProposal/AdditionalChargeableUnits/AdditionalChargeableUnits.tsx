import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, IcArrowsCounterClockwise } from "assets/icons";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue, GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { isEmpty, isNumber } from "lodash";
import {
  AutoCostAllocationDocumentAttachModel,
  AutoCostAllocationDocumentModel,
  LIST_TYPE_COST,
  ProposalCreateModel,
} from "models/Proposal";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, {
  Dispatch,
  Key,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  LayoutCell,
  ModalConfirm,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./AdditionalChargeableUnits.scss";
import { formatNumber } from "core/helpers/number";
interface Props {
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

const AdditionalChargeableUnits = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: Props) => {
  const {
    model,
    handleChangeSingleField,
    dispatchModel,
    handleUpdateListCostCenterByAllocationMonth,
    isRowDisabled,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [indexRow, setIndexRow] = useState<number>();
  const [idDelete, setIdDelete] = useState("");
  const [translate] = useTranslation();

  const typeRowSelection: RowSelectionType = "checkbox";

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    getCheckboxProps: (record: AutoCostAllocationDocumentAttachModel) => ({
      disabled: model?.isAdjust && isRowDisabled(record),
    }),
    renderCell: (value: boolean, record: AutoCostAllocationDocumentModel) => {
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
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
            disabled={model?.isAdjust && isRowDisabled(record)}
          />
        </div>
      );
    },
  };

  const handleAddRow = () => {
    const newAutoCostAllocationDocumentsAttach: AutoCostAllocationDocumentAttachModel =
      {
        id: dayjs().valueOf().toString(),
      };
    let autoCostAllocationDocumentAttach = [];
    if (model.autoCostAllocationDocumentsAttach) {
      autoCostAllocationDocumentAttach = [
        ...model.autoCostAllocationDocumentsAttach,
        newAutoCostAllocationDocumentsAttach,
      ];
    } else {
      autoCostAllocationDocumentAttach = [newAutoCostAllocationDocumentsAttach];
    }
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        autoCostAllocationDocumentsAttach: autoCostAllocationDocumentAttach,
      },
    });
  };

  const handleDeleteRowConfirm = (id: string, index: number) => {
    setIndexRow(index);
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const autoCostAllocationEdit =
      model.autoCostAllocationDocumentsAttach.filter(
        (item: AutoCostAllocationDocumentAttachModel) => item.id !== idDelete
      );

    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        autoCostAllocationDocumentsAttach: autoCostAllocationEdit,
        errors: {
          ...model.errors,
          [`autoCostAllocationDocumentsAttach[${indexRow}].preTaxUnitPrice`]:
            null,
          [`autoCostAllocationDocumentsAttach[${indexRow}].quantity`]: null,
          [`autoCostAllocationDocumentsAttach[${indexRow}].businessBranchId`]:
            null,
          [`autoCostAllocationDocumentsAttach[${indexRow}].businessDepartmentId`]:
            null,
          [`autoCostAllocationDocumentsAttach[${indexRow}].businessUnitId`]:
            null,
          [`autoCostAllocationDocumentsAttach[${indexRow}].percentage`]: null,
        },
      },
    });
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleChangeItemTable = (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    fieldNameError: string
  ) => {
    const autoCostAllocation = model.autoCostAllocationDocumentsAttach.map(
      (item: AutoCostAllocationDocumentAttachModel) => {
        if (item.id === id) {
          if (fieldName === "businessUnitId") {
            return {
              ...item,
              [fieldName]: objectValue || value,
              businessDepartmentId: "",
            };
          } else {
            return {
              ...item,
              [fieldName]: objectValue || value,
            };
          }
        }
        return item;
      }
    );

    handleChangeSingleField({
      fieldName: "autoCostAllocationDocumentsAttach",
      errorName: fieldNameError,
    })(autoCostAllocation);
  };

  const handleBulkDeleteRow = () => {
    const autoCostAllocationEdit =
      model.autoCostAllocationDocumentsAttach.filter(
        (item: AutoCostAllocationDocumentAttachModel) =>
          !selectedRowKeys.includes(item.id)
      );
    const errors = model.autoCostAllocationDocumentsAttach.reduce(
      (
        acc: Record<string, null>,
        item: AutoCostAllocationDocumentAttachModel,
        index: number
      ) => {
        if (selectedRowKeys.includes(item.id)) {
          acc[`autoCostAllocationDocumentsAttach[${index}].preTaxUnitPrice`] =
            null;
          acc[`autoCostAllocationDocumentsAttach[${index}].quantity`] = null;
          acc[
            `autoCostAllocationDocumentsAttach[${indexRow}].businessBranchId`
          ] = null;
          acc[
            `autoCostAllocationDocumentsAttach[${indexRow}].businessDepartmentId`
          ] = null;
          acc[`autoCostAllocationDocumentsAttach[${indexRow}].businessUnitId`] =
            null;
          acc[`autoCostAllocationDocumentsAttach[${indexRow}].percentage`] =
            null;
        }
        return acc;
      },
      {}
    );
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        autoCostAllocationDocumentsAttach: autoCostAllocationEdit,
        errors: {
          errors,
        },
      },
    });
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const renderCostDriverTitleRecord = () => {
    switch (model.costDriver?.code) {
      case LIST_TYPE_COST.COST__AREA:
        return translate("PP.proposal_acreage");
      case LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY:
        return translate("PP.proposal_employee_quantity");
      case LIST_TYPE_COST.COST__QUANTITY:
        return (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PP.proposal_quantity")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        );
      case LIST_TYPE_COST.COST__PERCENTAGE:
        return (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PP.proposal_percentage")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        );
      default:
        break;
    }
  };

  const renderRowCostDriver = (
    text: number,
    record: AutoCostAllocationDocumentAttachModel,
    index: number
  ) => {
    switch (model.costDriver?.code) {
      case LIST_TYPE_COST.COST__AREA:
        record.area = text || 0;
        return (
          <LayoutCell>{isNumber(text) ? formatNumber(text) : "---"}</LayoutCell>
        );
      case LIST_TYPE_COST.COST__QUANTITY:
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `autoCostAllocationDocumentsAttach[${index}].quantity`
              )}
            >
              <InputNumber
                isSmall
                isRequired
                placeHolder={translate("PP.proposal_quantity_placeholder")}
                className="payment-custom_input"
                value={record?.quantity}
                numberType={"DECIMAL"}
                isReverseSymb
                onChange={(value) =>
                  handleChangeItemTable(
                    "quantity",
                    value,
                    null,
                    record.id,
                    `autoCostAllocationDocumentsAttach[${index}].quantity`
                  )
                }
                disabled={model?.isAdjust && isRowDisabled(record)}
              />
            </FormItem>
          </LayoutCell>
        );
      case LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY:
        record.employeeCount = text || 0;
        return <LayoutCell>{text ? text : "---"}</LayoutCell>;
      case LIST_TYPE_COST.COST__PERCENTAGE:
        return (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `autoCostAllocationDocumentsAttach[${index}].percentage`
              )}
            >
              <InputNumber
                isSmall
                isRequired
                placeHolder={translate("PP.proposal_percentage_placeholder")}
                className="payment-custom_input"
                value={record?.percentage}
                isReverseSymb
                onChange={(value) =>
                  handleChangeItemTable(
                    "percentage",
                    value,
                    null,
                    record.id,
                    `autoCostAllocationDocumentsAttach[${index}].percentage`
                  )
                }
                allowNegative
                numberType={"DECIMAL"}
                max={100}
                min={0}
                disabled={model?.isAdjust && isRowDisabled(record)}
              />
            </FormItem>
          </LayoutCell>
        );
      default:
        break;
    }
  };

  const columns: ColumnProps<AutoCostAllocationDocumentAttachModel>[] =
    React.useMemo(
      () => [
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PP.branch_office")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessBranchId",
          dataIndex: "businessBranchId",
          render: (text, record, index) => {
            return (
              <LayoutCell>
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                  )}
                >
                  <Select
                    isRequired
                    searchProperty="name"
                    searchType=""
                    placeHolder={translate("PP.proposal_choose_branch_office")}
                    classFilter={DemoFilter}
                    isSearch
                    onChange={(value, objectValue) =>
                      handleChangeItemTable(
                        "businessBranchId",
                        value,
                        objectValue,
                        record.id,
                        `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                      )
                    }
                    valueFilter={{
                      name: "",
                    }}
                    getList={proposalRepository.listBusinessBranchId}
                    isEnumerable={false}
                    render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                    value={record?.businessBranchId}
                    appendToBody
                    disabled={model?.isAdjust && isRowDisabled(record)}
                  />
                </FormItem>
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PP.department_block")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessUnitId",
          dataIndex: "businessUnitId",
          render: (text, record, index) => (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                )}
              >
                <Select
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PP.proposal_choose_department_block")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={true}
                  classFilter={undefined}
                  isSearch
                  onChange={(value, objectValue) =>
                    handleChangeItemTable(
                      "businessUnitId",
                      value,
                      objectValue,
                      record.id,
                      `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                    )
                  }
                  getList={proposalRepository.listBusinessUnitId}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessUnitId}
                  appendToBody
                  disabled={model?.isAdjust && isRowDisabled(record)}
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PP.sub_department")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessDepartmentId",
          dataIndex: "businessDepartmentId",
          render: (text, record, index) => (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                )}
              >
                <Select
                  disabled={
                    isEmpty(record.businessUnitId) ||
                    (model?.isAdjust && isRowDisabled(record))
                  }
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PP.proposal_choose_sub_department")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                    businessUnitId: record?.businessUnitId?.id || "",
                  }}
                  isSmall={true}
                  classFilter={undefined}
                  isSearch
                  onChange={(value, objectValue) =>
                    handleChangeItemTable(
                      "businessDepartmentId",
                      value,
                      objectValue,
                      record.id,
                      `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                    )
                  }
                  getList={proposalRepository.listBusinessDepartmentId}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessDepartmentId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: renderCostDriverTitleRecord(),
          key: "value",
          dataIndex: "value",
          sorter: false,
          render(text, record, index) {
            return renderRowCostDriver(text, record, index);
          },
        },
        {
          title: "",
          key: "action",
          dataIndex: "action",
          width: 40,
          render: (_, record, index) => {
            if (model?.isAdjust && isRowDisabled(record)) {
              return null;
            }

            return (
              <LayoutCell>
                <div className="payment-red cursor-pointer btn">
                  <TrashCan
                    size={20}
                    onClick={() => handleDeleteRowConfirm(record.id, index)}
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

  const columnsQuantity: ColumnProps<AutoCostAllocationDocumentAttachModel>[] =
    React.useMemo(
      () => [
        {
          title: () => (
            <div className="payment-font-14" style={{ display: "contents" }}>
              <label className={classNames("component__title")}>
                {translate("PP.branch_office")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessBranchId",
          width: 150,
          dataIndex: "businessBranchId",
          render: (text, record, index) => (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                )}
              >
                <Select
                  isRequired
                  searchProperty="name"
                  searchType=""
                  placeHolder={translate("PP.proposal_choose_branch_office")}
                  classFilter={DemoFilter}
                  isSearch
                  onChange={(value, objectValue) =>
                    handleChangeItemTable(
                      "businessBranchId",
                      value,
                      objectValue,
                      record.id,
                      `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                    )
                  }
                  valueFilter={{
                    name: "",
                  }}
                  getList={proposalRepository.listBusinessBranchId}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessBranchId}
                  appendToBody
                  disabled={model?.isAdjust && isRowDisabled(record)}
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14" style={{ display: "contents" }}>
              <label className={classNames("component__title")}>
                {translate("PP.department_block")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessUnitId",
          dataIndex: "businessUnitId",
          width: 150,
          render: (text, record, index) => (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                )}
              >
                <Select
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PP.proposal_choose_department_block")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={true}
                  classFilter={undefined}
                  isSearch
                  onChange={(value, objectValue) =>
                    handleChangeItemTable(
                      "businessUnitId",
                      value,
                      objectValue,
                      record.id,
                      `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                    )
                  }
                  getList={proposalRepository.listBusinessUnitId}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessUnitId}
                  appendToBody
                  disabled={model?.isAdjust && isRowDisabled(record)}
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14" style={{ display: "contents" }}>
              <label className={classNames("component__title")}>
                {translate("PP.sub_department")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessDepartmentId",
          dataIndex: "businessDepartmentId",
          width: 150,
          render: (text, record, index) => (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                )}
              >
                <Select
                  disabled={
                    isEmpty(record.businessUnitId) ||
                    (model?.isAdjust && isRowDisabled(record))
                  }
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PP.proposal_choose_sub_department")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                    businessUnitId: record?.businessUnitId?.id || "",
                  }}
                  isSmall={true}
                  classFilter={undefined}
                  isSearch
                  onChange={(value, objectValue) =>
                    handleChangeItemTable(
                      "businessDepartmentId",
                      value,
                      objectValue,
                      record.id,
                      `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                    )
                  }
                  getList={proposalRepository.listBusinessDepartmentId}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessDepartmentId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14" style={{ display: "contents" }}>
              <label className={classNames("component__title")}>
                {translate("PP.proposal_quantity")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "quantity",
          dataIndex: "quantity",
          sorter: false,
          width: 100,
          render(text, record, index) {
            return (
              <LayoutCell>
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `autoCostAllocationDocumentsAttach[${index}].quantity`
                  )}
                >
                  <InputNumber
                    isSmall
                    isRequired
                    placeHolder={translate(
                      "PP.proposal_quantity_placeholder_quantity"
                    )}
                    className="payment-custom_input"
                    value={record?.quantity}
                    numberType={"DECIMAL"}
                    isReverseSymb
                    onChange={(value) => {
                      handleChangeItemTable(
                        "quantity",
                        value,
                        null,
                        record.id,
                        `autoCostAllocationDocumentsAttach[${index}].quantity`
                      );
                    }}
                    max={NUMBER_MAX_13}
                    allowNegative
                    disabled={model?.isAdjust && isRowDisabled(record)}
                  />
                </FormItem>
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div
              className="payment-font-14"
              style={{ display: "contents", textAlign: "right" }}
            >
              <label className={classNames("component__title")}>
                {translate("PP.proposal_estimated_unit_price_includes_fees")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "estimateIncludesTax",
          dataIndex: "estimateIncludesTax",
          width: 160,
          sorter: false,
          render(text, record, index) {
            return (
              <LayoutCell>
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `autoCostAllocationDocumentsAttach[${index}].estimateIncludesTax`
                  )}
                >
                  <InputNumber
                    className="input-right"
                    isSmall
                    isRequired
                    placeHolder={translate("PP.proposal_enter_unit_price")}
                    value={record?.estimateIncludesTax}
                    numberType={getNumberTypeByCurrency(model.currency?.code)}
                    isReverseSymb
                    onChange={(value) => {
                      handleChangeItemTable(
                        "estimateIncludesTax",
                        value,
                        null,
                        record.id,
                        `autoCostAllocationDocumentsAttach[${index}].estimateIncludesTax`
                      );
                    }}
                    max={NUMBER_MAX_13}
                    allowNegative
                    disabled={model?.isAdjust && isRowDisabled(record)}
                  />
                </FormItem>
              </LayoutCell>
            );
          },
        },
        {
          title: () => (
            <div
              className="payment-font-14"
              style={{ display: "contents", textAlign: "right" }}
            >
              <label className={classNames("component__title")}>
                {translate("PP.proposal_the_reserve_unit_price_includes_tax")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "contingencyIncludesTax",
          dataIndex: "contingencyIncludesTax",
          sorter: false,
          width: 160,
          render(text, record, index) {
            return (
              <LayoutCell position="right">
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `autoCostAllocationDocumentsAttach[${index}].contingencyIncludesTax`
                  )}
                >
                  <InputNumber
                    className="input-right"
                    isSmall
                    isRequired
                    placeHolder={translate("PP.proposal_enter_unit_price")}
                    value={record?.contingencyIncludesTax}
                    isReverseSymb
                    onChange={(value) => {
                      handleChangeItemTable(
                        "contingencyIncludesTax",
                        value,
                        null,
                        record.id,
                        `autoCostAllocationDocumentsAttach[${index}].contingencyIncludesTax`
                      );
                    }}
                    numberType={getNumberTypeByCurrency(model.currency?.code)}
                    max={NUMBER_MAX_13}
                    allowNegative
                    disabled={model?.isAdjust && isRowDisabled(record)}
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
          width: 40,
          render: (_, record, index) => {
            if (model?.isAdjust && isRowDisabled(record)) {
              return null;
            }

            return (
              <LayoutCell>
                <div className="payment-red cursor-pointer btn">
                  <TrashCan
                    size={20}
                    onClick={() => handleDeleteRowConfirm(record.id, index)}
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

  const handleRenderColumn = () => {
    if (model.costDriver.code !== LIST_TYPE_COST.COST__QUANTITY) {
      return columns;
    } else if (model.isPriceExcludingTax) {
      return columns;
    } else {
      return columnsQuantity;
    }
  };

  return (
    // Attached document for reference
    <div className="pb-1">
      <div className="fs-6 fw-semibold">
        <div className="payment-flex_space_between m-b--2xs m-t--2xs">
          <Button
            type={"secondary"}
            icon={<img src={add} alt="" width={12} height={12} />}
            iconPlace={"left"}
            onClick={handleAddRow}
          >
            {translate("PP.proposal_add_cost_unit")}
          </Button>
          {(model.costDriver.code === LIST_TYPE_COST.COST__AREA ||
            model.costDriver.code ===
              LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY) && (
            <Button
              type={"text"}
              icon={
                <img
                  src={IcArrowsCounterClockwise}
                  alt=""
                  width={16}
                  height={16}
                />
              }
              iconPlace={"left"}
              onClick={handleUpdateListCostCenterByAllocationMonth}
            >
              {model.costDriver.code === LIST_TYPE_COST.COST__AREA
                ? translate("PP.proposal_update_acreage")
                : translate("PP.proposal_update_quantity_employee")}
            </Button>
          )}
        </div>
      </div>
      {/*Action control*/}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => setOpenModalConfirmDeleteAll(true)}
        >
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      <StandardTable
        rowKey={"id"}
        columns={handleRenderColumn()}
        dataSource={model.autoCostAllocationDocumentsAttach}
        isDragable={true}
        rowSelection={rowSelection}
        idContainer="table-id"
        rowClassName="payment-row"
        scroll={{ y: 400 }}
        className="payment-row_selection"
      />
      <ModalConfirm
        wrapClassName="payment-wrap-modal"
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PP.confirm_delete_cost_allocation_line")}
        content={translate("PP.delete_cost_allocation_line_warning")}
        titleButtonCancel={translate("PP.cancel_btn_label")}
        titleButtonApply={translate("PP.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        wrapClassName="payment-wrap-modal"
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PP.confirm_delete_cost_allocation_line")}
        content={translate("PP.delete_cost_allocation_line_warning")}
        titleButtonCancel={translate("PP.cancel_btn_label")}
        titleButtonApply={translate("PP.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default AdditionalChargeableUnits;
