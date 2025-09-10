import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import {
  DeleteRoundIcon,
  emptyIcon,
  IcArrowsCounterClockwise,
} from "assets/icons";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { NUMBER_MAX_13 } from "config/const";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue, GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { isEmpty } from "lodash";
import {
  AutoCostAllocationDocumentAttachModel,
  AutoCostAllocationDocumentModel,
  COST_DRIVER_TYPE,
  PaymentCreateModel,
} from "models/Payment";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
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
import { PaymentCreateHookContext } from "../../../../../PaymentCreateHook";

interface Props {
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

const ChargeableUnitDocumentTable = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: Props) => {
  const {
    translate,
    model,
    paymentInheritanceInformation,
    handleChangeSingleField,
    dispatchModel,
    handleUpdateListCostCenterByAllocationMonth,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [indexRow, setIndexRow] = useState<number>();
  const [idDelete, setIdDelete] = useState("");

  const typeRowSelection: RowSelectionType = "checkbox";
  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
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
              businessDepartmentId: null,
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
      (acc: any, item: AutoCostAllocationDocumentAttachModel) => {
        if (selectedRowKeys.includes(item.id)) {
          acc[
            `autoCostAllocationDocumentsAttach[${indexRow}].preTaxUnitPrice`
          ] = null;
          acc[`autoCostAllocationDocumentsAttach[${indexRow}].quantity`] = null;
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
      case COST_DRIVER_TYPE.COST_DRIVER_AREA:
        return translate("PM.payment_acreage");
      case COST_DRIVER_TYPE.COST_DRIVER_QUANTITY:
        return (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_quantity")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        );
      case COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY:
        return translate("PM.payment_employee_quantity");
      case COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE:
        return (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_percentage")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        );
      default:
        break;
    }
  };

  const renderRowCostDriver = (
    text: string,
    record: AutoCostAllocationDocumentAttachModel,
    index: number
  ) => {
    switch (model.costDriver?.code) {
      case COST_DRIVER_TYPE.COST_DRIVER_AREA:
        return (
          <LayoutCell position="left">
            {text ? formatNumber(text) : "---"}
          </LayoutCell>
        );
      case COST_DRIVER_TYPE.COST_DRIVER_QUANTITY:
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
                isTableCell
                isSmall
                isRequired
                placeHolder={translate("PM.payment_quantity_placeholder")}
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
              />
            </FormItem>
          </LayoutCell>
        );
      case COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY:
        return (
          <LayoutCell position="left">
            {text ? formatNumber(text) : "---"}
          </LayoutCell>
        );
      case COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE:
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
                isTableCell
                isSmall
                isRequired
                placeHolder={translate("PM.payment_percentage_placeholder")}
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
                numberType={"DECIMAL"}
                max={100}
                min={0}
                translate={translate as TFunction}
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
                {translate("PM.payment_cn_pgd")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessBranchId",
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
                  placeHolder={translate("PM.payment_cn_pgd_placeholder")}
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
          ),
        },
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PM.payment_nhcd")}
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
                  placeHolder={translate("PM.payment_nhcd_placeholder")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                    ...paymentInheritanceInformation,
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
                  getList={budgetRepository.costOwnerList}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessUnitId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PM.payment_tt_pb")}
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
                  disabled={isEmpty(record.businessUnitId)}
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PM.payment_tt_pb_placeholder")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                    businessUnitId: record?.businessUnitId?.id || "",
                    ...paymentInheritanceInformation,
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
                  getList={paymentRepository.businessDepartment}
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
          align: "left",
          render(text, record, index) {
            return renderRowCostDriver(text, record, index);
          },
        },
        {
          title: "",
          key: "action",
          dataIndex: "action",
          width: 40,
          render: (_, record, index) => (
            <LayoutCell>
              <div className="payment-red cursor-pointer btn">
                <TrashCan
                  size={24}
                  onClick={() => handleDeleteRowConfirm(record.id, index)}
                />
              </div>
            </LayoutCell>
          ),
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
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PM.payment_cn_pgd")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "businessBranchId",
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
                  placeHolder={translate("PM.payment_cn_pgd_placeholder")}
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
                  getList={paymentRepository.listBusinessBranch}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessBranchId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PM.payment_nhcd")}
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
                  placeHolder={translate("PM.payment_nhcd_placeholder")}
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
                  getList={budgetRepository.costOwnerList}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessUnitId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          ),
        },
        {
          title: () => (
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PM.payment_tt_pb")}
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
                  disabled={isEmpty(record.businessUnitId)}
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PM.payment_tt_pb_placeholder")}
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                    businessUnitId: record.businessUnitId?.id || "",
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
                  getList={paymentRepository.businessDepartment}
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
            <div className="payment-font-14">
              <label className={classNames("component__title")}>
                {translate("PM.payment_quantity")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "quantity",
          dataIndex: "quantity",
          sorter: false,
          align: "left",
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
                    isTableCell
                    isSmall
                    isRequired
                    placeHolder={translate("PM.payment_quantity_placeholder")}
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
                    translate={translate as TFunction}
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
                {translate("PM.payment_price_excluding_tax")}
                <span className="text-danger">&nbsp;*</span>
              </label>
            </div>
          ),
          key: "preTaxUnitPrice",
          dataIndex: "preTaxUnitPrice",
          sorter: false,
          align: "left",
          render(text, record, index) {
            return (
              <LayoutCell>
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `autoCostAllocationDocumentsAttach[${index}].preTaxUnitPrice`
                  )}
                >
                  <InputNumber
                    isTableCell
                    isSmall
                    isRequired
                    placeHolder={translate(
                      "PM.payment_price_excluding_tax_placeholder"
                    )}
                    className="payment-custom_input"
                    value={record?.preTaxUnitPrice}
                    isReverseSymb
                    onChange={(value) =>
                      handleChangeItemTable(
                        "preTaxUnitPrice",
                        value,
                        null,
                        record.id,
                        `autoCostAllocationDocumentsAttach[${index}].preTaxUnitPrice`
                      )
                    }
                    numberType={getNumberTypeByCurrency(model.currency?.code)}
                    allowNegative
                    max={NUMBER_MAX_13}
                    translate={translate as TFunction}
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
          render: (_, record, index) => (
            <LayoutCell>
              <div className="payment-red cursor-pointer btn">
                <TrashCan
                  size={24}
                  onClick={() => handleDeleteRowConfirm(record.id, index)}
                />
              </div>
            </LayoutCell>
          ),
        },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [model, translate]
    );

  const handleRenderColumn = () => {
    if (model.costDriver?.code !== COST_DRIVER_TYPE.COST_DRIVER_QUANTITY) {
      return columns;
    } else if (!model.isPriceExcludingTax) {
      return columnsQuantity;
    } else {
      return columns;
    }
  };

  return (
    // Attached document for reference
    <div className="pb-1">
      <div className="fs-6 fw-semibold">
        {model.autoCostAllocationDocumentsAttach?.length > 0 && (
          <div className="payment-flex_space_between m-b--2xs m-t--2xs">
            <Button
              type={"secondary"}
              icon={<img src={add} alt="" width={12} height={12} />}
              iconPlace={"left"}
              onClick={handleAddRow}
            >
              {translate("PM.payment_add_cost_unit")}
            </Button>
            {(model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA ||
              model.costDriver?.code ===
                COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY) && (
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
                {model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA
                  ? translate("PM.payment_update_acreage")
                  : translate("PM.payment_update_quantity_employee")}
              </Button>
            )}
          </div>
        )}
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

      {!model.autoCostAllocationDocumentsAttach?.length ||
      model.autoCostAllocationDocumentsAttach?.length === 0 ? (
        <div className="m-t--sm">
          <EmptyInitializeTable
            textButton={translate("PM.payment_add_cost_unit")}
            content={
              <div className="invoice-width_content_empty">
                {translate("PM.empty_data")}
              </div>
            }
            icon={<img src={emptyIcon} alt="" />}
            onHandleClickAdd={handleAddRow}
          />
        </div>
      ) : (
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
      )}

      <ModalConfirm
        wrapClassName="payment-wrap-modal"
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
        wrapClassName="payment-wrap-modal"
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
    </div>
  );
};

export default ChargeableUnitDocumentTable;
