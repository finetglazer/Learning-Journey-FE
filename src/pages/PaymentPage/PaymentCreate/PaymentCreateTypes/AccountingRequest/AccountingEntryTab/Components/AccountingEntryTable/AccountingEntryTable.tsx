import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, emptyIcon } from "assets/icons";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { NAME_BANK_REGEX } from "core/config/consts";
import { addNumbers, formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue, GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
import { isEmpty } from "lodash";
import {
  AccountingEntryModel,
  PaymentCreateModel,
  VND_CURRENCY,
} from "models/Payment";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import React, { Key, useContext, useState } from "react";
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
import "./AccountingEntryTable.scss";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";

const AccountingEntryTable = () => {
  const { translate, model, handleChangeSingleField, dispatchModel } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [indexRow, setIndexRow] = useState<number>();
  const [idDelete, setIdDelete] = useState("");

  const typeRowSelection: RowSelectionType = "checkbox";
  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys.filter(Boolean));
    },
    selectedRowKeys,
    type: typeRowSelection,
    getCheckboxProps: (record: AccountingEntryModel) => ({
      disabled: record?.isTotal,
    }),
    renderCell: (value: boolean, record: AccountingEntryModel) => {
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

  const handleAddRow = () => {
    const newaccountingEntryData: AccountingEntryModel = {
      id: dayjs().valueOf().toString(),
    };
    let accountingEntryData = [];
    if (model.accountingEntry) {
      accountingEntryData = [...model.accountingEntry, newaccountingEntryData];
    } else {
      accountingEntryData = [newaccountingEntryData];
    }
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        accountingEntry: accountingEntryData,
      },
    });
  };

  const handleDeleteRowConfirm = (id: string, index: number) => {
    setIndexRow(index);
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const autoCostAllocationEdit = model.accountingEntry.filter(
      (item: AccountingEntryModel) => item.id !== idDelete
    );

    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        accountingEntry: autoCostAllocationEdit,
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
    const autoCostAllocation = model.accountingEntry.map(
      (item: AccountingEntryModel) => {
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
      fieldName: "accountingEntry",
      errorName: fieldNameError,
    })(autoCostAllocation);
  };

  const handleBulkDeleteRow = () => {
    const autoCostAllocationEdit = model.accountingEntry.filter(
      (item: AccountingEntryModel) => !selectedRowKeys.includes(item.id)
    );
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        accountingEntry: autoCostAllocationEdit,
      },
    });
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const columns: ColumnProps<AccountingEntryModel>[] = React.useMemo(
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
        render: (_text, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell>
                <label className="amount-title_accounting">
                  {translate("PM.total")}
                </label>
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `journalEntries[${record?.indexBeforeValidate}].businessBranchId`
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
                      `journalEntries[${record?.indexBeforeValidate}].businessBranchId`
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
          );
        },
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
        render: (_text, record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `journalEntries[${record?.indexBeforeValidate}].businessUnitId`
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
                      `journalEntries[${record?.indexBeforeValidate}].businessUnitId`
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
          );
        },
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
        render: (_text, record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `journalEntries[${record?.indexBeforeValidate}].businessDepartmentId`
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
                      `journalEntries[${record?.indexBeforeValidate}].businessDepartmentId`
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
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_accounting_account")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "accountEntry",
        dataIndex: "accountEntry",
        render: (_text, record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `journalEntries[${record?.indexBeforeValidate}].accountEntry`
                )}
              >
                <Select
                  isRequired
                  searchProperty="name"
                  placeHolder={translate("PM.expense_detail_input")}
                  classFilter={undefined}
                  isSearch
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  onChange={(value, objectValue) =>
                    handleChangeItemTable(
                      "accountEntry",
                      value,
                      objectValue,
                      record.id,
                      `journalEntries[${record?.indexBeforeValidate}].accountEntry`
                    )
                  }
                  getList={paymentRepository.getglAcountDropdown}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record.accountEntry}
                  appendToBody
                  isEnumerable={false}
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
              {translate("PM.payment_accounting_interpretation")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "description",
        dataIndex: "description",
        render: (_text, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `journalEntries[${record?.indexBeforeValidate}].description`
                )}
              >
                <InputText
                  isTableCell
                  isRequired
                  placeHolder={translate("PM.expense_detail_input")}
                  value={record?.description}
                  onChange={(value: string) => {
                    handleChangeItemTable(
                      "description",
                      value,
                      null,
                      record.id,
                      `journalEntries[${record?.indexBeforeValidate}].description`
                    );
                  }}
                  isByteCheck
                  maxLength={240}
                  translate={translate as TFunction}
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
            title={translate("PM.payment_debit_amount")}
            unit={model?.currency?.code}
            isRequire
          />
        ),
        key: "debitAmount",
        dataIndex: "debitAmount",
        sorter: false,
        align: "right",
        width: 160,
        render: (_text, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model.accountingEntry?.reduce(
                      (total, item) =>
                        addNumbers(total || 0, Number(item?.debitAmount) || 0),
                      0
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
                  `journalEntries[${record?.indexBeforeValidate}].debitAmount`
                )}
              >
                <InputNumber
                  isInputRight
                  isTableCell
                  isSmall
                  isRequired
                  placeHolder={translate("PM.plh_amount_excluding_tax")}
                  className="payment-custom_input"
                  value={record?.debitAmount}
                  isReverseSymb
                  onChange={(value) => {
                    handleChangeItemTable(
                      "debitAmount",
                      value,
                      null,
                      record.id,
                      `journalEntries[${record?.indexBeforeValidate}].debitAmount`
                    );
                  }}
                  numberType={
                    model.currency?.code != VND_CURRENCY ? "DECIMAL" : null
                  }
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
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
          <UnitTitleTable
            title={translate("PM.payment_credit_amount")}
            unit={model?.currency?.code}
            isRequire
          />
        ),
        key: "creditAmount",
        dataIndex: "creditAmount",
        sorter: false,
        align: "right",
        width: 160,
        render: (_text, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model.accountingEntry?.reduce(
                      (total, item) =>
                        addNumbers(total || 0, Number(item?.creditAmount) || 0),
                      0
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `journalEntries[${record?.indexBeforeValidate}].creditAmount`
                )}
              >
                <InputNumber
                  isInputRight
                  isTableCell
                  isSmall
                  isRequired
                  placeHolder={translate("PM.plh_amount_excluding_tax")}
                  className=""
                  value={record?.creditAmount}
                  onChange={(value) =>
                    handleChangeItemTable(
                      "creditAmount",
                      value,
                      null,
                      record.id,
                      `journalEntries[${record?.indexBeforeValidate}].creditAmount`
                    )
                  }
                  numberType={
                    model.currency?.code != VND_CURRENCY ? "DECIMAL" : null
                  }
                  allowNegative
                  isReverseSymb
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
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
        render: (_, record, index) => {
          if (record?.isTotal) return null;
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

  return (
    <div className="p-b--sm p-x--sm">
      <div className="fs-6 fw-semibold">
        {model.accountingEntry?.length > 0 && (
          <div className="m-b--2xs m-t--2xs">
            <Button
              type={"secondary"}
              icon={<img src={add} alt="" width={12} height={12} />}
              iconPlace={"left"}
              onClick={handleAddRow}
            >
              {translate("PM.add_row")}
            </Button>
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
      {model.accountingEntry?.length === 0 ? (
        <EmptyInitializeTable
          content={<div>{translate("PM.empty_data")}</div>}
          textButton={translate("PM.accounting_entry_add")}
          icon={<img src={emptyIcon} alt="" />}
          onHandleClickAdd={handleAddRow}
          disableButton={false}
          isSolid={false}
        />
      ) : (
        <StandardTable
          rowKey={"id"}
          columns={columns}
          dataSource={[
            ...model.accountingEntry,
            {
              isTotal: true,
            },
          ]}
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
        title={translate("PM.payment_title_confirm_delete_accounting_entries")}
        content={translate(
          "PM.payment_content_confirm_delete_accounting_entries"
        )}
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
        title={translate("PM.payment_title_confirm_delete_accounting_entries")}
        content={translate(
          "PM.payment_content_confirm_delete_accounting_entries"
        )}
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

export default AccountingEntryTable;
