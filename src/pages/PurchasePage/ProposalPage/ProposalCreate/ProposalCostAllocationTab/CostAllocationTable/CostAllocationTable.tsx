import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, ViewBudgetIcon } from "assets/icons";
import add from "assets/icons/add.svg";
import classNames from "classnames";
import ModalBudgetStatus from "components/ModalBudgetStatus/ModalBudgetStatus";
import { NUMBER_MAX_13 } from "config/const";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbersDecimal, formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { FieldValue, GeneralActionEnum } from "core/services/service-types";
import { isEmpty } from "lodash";
import { CostLine } from "models/CostLine";
import { VND_CURRENCY } from "models/Payment/PaymentRequestConstant";
import {
  CostAllocation,
  LIST_TYPE_COST,
  ProposalCreateModel,
  SHOPPING_PURPOSES,
  TypeFilterModel,
} from "models/Proposal";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import CostAllocationTableDetail from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/CostAllocationTableDetail/CostAllocationTableDetail";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import React, { useContext, useEffect, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map, of } from "rxjs";
import { ProposalCreateHookContext } from "../../ProposalCreateHook";
import AnotherCostAllocation from "../AnotherCostAllocation/AnotherCostAllocation";
import "./CostAllocationTable.scss";

const CostAllocationTable = () => {
  const {
    model,
    exchangeRateNumberType,
    handleClickAddCostAllocationLine,
    handleChangeSingleField,
    handleChangeAllField,
    dispatchModel,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const [translate] = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const [idDelete, setIdDelete] = useState("");

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [isOpenModalBudgetOverView, setIsOpenModalBudgetOverView] =
    useState(false);
  const checkShowViewBudgetStatus = () => {
    if (model.costAllocation?.length === 0) {
      return false;
    }
    return model.costAllocation?.some(
      (item: { costLineId: CostLine }) => item.costLineId
    );
  };
  const typeRowSelection: RowSelectionType = "checkbox";

  const handleChangeMultipleItemTable = (
    data: CostAllocation,
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
        (acc: { [key: string]: null }, name: string) => {
          acc[`costAllocationLines[${indexBeforeValidate}].${name}`] = null;
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

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
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

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  useEffect(() => {
    if (model.project) {
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          projectId: model.project,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.project]);

  useEffect(() => {
    handleChangeAllField({
      ...model,
      costLineId: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.projectId]);

  const getListCostLines = (filter: TypeFilterModel, record: CostLine) => {
    return of(record.projectId?.costLines).pipe(
      map((costLines: CostLine[]) => {
        if (!Array.isArray(costLines)) {
          return [];
        }

        const trimmedName = filter?.name?.trim();
        if (!trimmedName) {
          return costLines;
        }

        return costLines.filter((period) =>
          period?.code?.includes(trimmedName as string)
        );
      })
    );
  };
  const columns: ColumnProps<CostAllocation>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PP.branch_office")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "businessBranchId",
        dataIndex: "businessBranchId",
        width: 160,
        render: (text, record: CostAllocation) => {
          if (record.isTotal) {
            return (
              <label className="fw-bold p-x--2xs">
                {translate("PP.total")}
              </label>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocationLines[${record?.indexBeforeValidate}].businessBranchId`
                )}
              >
                <Select
                  placeHolder={translate("PP.proposal_choose_branch_office")}
                  isRequired
                  searchProperty="name"
                  searchType=""
                  isSearch
                  classFilter={undefined}
                  valueFilter={{
                    name: "",
                  }}
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
                  getList={proposalRepository.listBusinessBranchId}
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.businessBranchId}
                  appendToBody
                  disabled={
                    model?.isAdjust &&
                    model?.costAllocationLines?.some(
                      (line: CostAllocation) => line.id === record?.id
                    ) &&
                    record?.usedAmount > 0
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PP.department_block")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "businessUnitId",
        dataIndex: "businessUnitId",
        width: 160,
        render: (text, record: CostAllocation) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocationLines[${record?.indexBeforeValidate}].businessUnitId`
                )}
              >
                <Select
                  placeHolder={translate("PP.proposal_choose_department_block")}
                  isRequired
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  classFilter={undefined}
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
                  disabled={
                    model?.isAdjust &&
                    model?.costAllocationLines?.some(
                      (line: CostAllocation) => line.id === record?.id
                    ) &&
                    record?.usedAmount > 0
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PP.sub_department")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "businessDepartmentId",
        dataIndex: "businessDepartmentId",
        width: 160,
        render: (text, record: CostAllocation) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocationLines[${record?.indexBeforeValidate}].businessDepartmentId`
                )}
              >
                <Select
                  placeHolder={translate("PP.proposal_choose_sub_department")}
                  isRequired
                  searchType=""
                  valueFilter={{
                    name: "",
                    businessUnitId: record.businessUnitId?.id || "",
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
                  getList={proposalRepository.listBusinessDepartmentId}
                  isEnumerable={false}
                  value={record?.businessDepartmentId}
                  appendToBody
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  disabled={
                    model?.isAdjust &&
                    model?.costAllocationLines?.some(
                      (line: CostAllocation) => line.id === record?.id
                    )
                      ? record?.usedAmount > 0
                      : isEmpty(record.businessUnitId)
                  }
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label
              style={{ textAlign: "right" }}
              className={classNames("component__title")}
            >
              {translate("PP.estimated_amount")}
              <span className={classNames("text-danger", "text-danger-span")}>
                &nbsp;*
              </span>
            </label>
            <span className="columns-table__vnd">{model?.currency?.code}</span>
          </div>
        ),
        key: "estimateAmount",
        dataIndex: "estimateAmount",
        width: 160,
        render: (text, record: CostAllocation) => {
          if (record.isTotal)
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model.costAllocation.reduce(
                      (total: number, item: { estimateAmount: number }) =>
                        addNumbersDecimal(
                          total || 0,
                          item?.estimateAmount || 0
                        ),
                      0
                    )
                  )}
                />
              </LayoutCell>
            );
          return (
            <LayoutCell position="right">
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocationLines[${record?.indexBeforeValidate}].estimateAmount`
                )}
              >
                <InputNumber
                  className="input-right"
                  isRequired
                  placeHolder={translate(
                    "PP.proposal_enter_the_estimated_amount"
                  )}
                  isReverseSymb
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "estimateAmount",
                      value,
                      null,
                      record.id,
                      `costAllocationLines[${record?.indexBeforeValidate}].estimateAmount`
                    );
                  }}
                  value={record?.estimateAmount}
                  numberType={exchangeRateNumberType}
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label
              style={{ textAlign: "right" }}
              className={classNames("component__title")}
            >
              {translate("PP.reserve_amount")}
              <span className={classNames("text-danger", "text-danger-span")}>
                &nbsp;*
              </span>
            </label>
            <span className="columns-table__vnd">{model?.currency?.code}</span>
          </div>
        ),
        key: "contingencyAmount",
        dataIndex: "contingencyAmount",
        width: 160,
        render: (text, record: CostAllocation) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model.costAllocation.reduce(
                      (total: number, item: { contingencyAmount: number }) =>
                        addNumbersDecimal(
                          total || 0,
                          item?.contingencyAmount || 0
                        ),
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
                  `costAllocationLines[${record?.indexBeforeValidate}].contingencyAmount`
                )}
              >
                <InputNumber
                  isRequired
                  className="input-right"
                  placeHolder={translate(
                    "PP.proposal_enter_the_reserve_amount"
                  )}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "contingencyAmount",
                      value,
                      null,
                      record.id,
                      `costAllocationLines[${record?.indexBeforeValidate}].contingencyAmount`
                    );
                  }}
                  isReverseSymb
                  numberType={exchangeRateNumberType}
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  value={record?.contingencyAmount}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      ...(model?.isAdjust
        ? [
            {
              title: () => (
                <div className="columns-table">
                  <label
                    style={{ textAlign: "right" }}
                    className={classNames("component__title")}
                  >
                    {translate("PP.changes_compared_original_proposal")}
                  </label>
                  <span className="columns-table__vnd">
                    {model?.currency?.code}
                  </span>
                </div>
              ),
              key: "amountChanges",
              dataIndex: "amountChanges",
              width: 190,
              render: (text: string, record: CostAllocation) => {
                const contingencyAmount = record.contingencyAmount || 0;
                const estimateAmount = record.estimateAmount || 0;
                const originalTotalAmount = record.originalTotalAmount || 0;
                const calculatedValue = roundTo(
                  contingencyAmount + estimateAmount - originalTotalAmount,
                  detectIntegerCurrency(model?.currency?.code) ? 0 : 4
                );
                const totalCalculatedAmount = model.costAllocation.reduce(
                  (total: number, item: CostAllocation) =>
                    total +
                    ((item.estimateAmount || 0) +
                      (item.contingencyAmount || 0) -
                      (item.originalTotalAmount || 0)),
                  0
                );
                if (record.isTotal)
                  return (
                    <LayoutCell position="right">
                      <OneLineText
                        className="amount-title"
                        useTooltip
                        value={formatNumber(
                          roundTo(
                            totalCalculatedAmount,
                            detectIntegerCurrency(model?.currency?.code) ? 0 : 4
                          )
                        )}
                      />
                    </LayoutCell>
                  );

                return (
                  <LayoutCell position="right">
                    <OneLineText
                      useTooltip
                      value={
                        calculatedValue > 0
                          ? `+${formatNumber(calculatedValue)}`
                          : `${formatNumber(calculatedValue)}`
                      }
                      className={
                        calculatedValue >= 0 ? "text-green" : "text-red"
                      }
                    />
                  </LayoutCell>
                );
              },
            },
          ]
        : []),

      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PM.project_budget_item")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "projectId",
        dataIndex: "projectId",
        width: 214,
        render: (text, record: CostAllocation) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocationLines[${record?.indexBeforeValidate}].projectId`
                )}
              >
                <Select
                  disabled={
                    model?.isAdjust &&
                    model?.costAllocationLines?.some(
                      (line: CostAllocation) => line.id === record?.id
                    )
                      ? record?.usedAmount > 0
                      : isEmpty(record.businessDepartmentId) ||
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
                    isProject:
                      model?.procurementPurpose?.id ==
                      SHOPPING_PURPOSES.ACCORDING_PROJECT,
                    budgetId:
                      model?.procurementPurpose?.id ==
                      SHOPPING_PURPOSES.ACCORDING_PROJECT
                        ? model?.projectId?.id
                        : "",
                    costGroupId: model?.costGroup?.id,
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
                      : proposalRepository.projectByCostCenter
                  }
                  isEnumerable={false}
                  render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                  value={record?.projectId}
                  appendToBody
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="columns-table">
            <label className={classNames("component__title")}>
              {translate("PM.cost_line")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "costLineId",
        dataIndex: "costLineId",
        width: 150,
        render: (text, record: CostAllocation) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `costAllocationLines[${record?.indexBeforeValidate}].costLineId`
                )}
              >
                <Select
                  disabled={
                    model?.isAdjust &&
                    model?.costAllocationLines?.some(
                      (line: CostAllocation) => line.id === record?.id
                    )
                      ? record?.usedAmount > 0
                      : isEmpty(record?.projectId)
                  }
                  placeHolder={translate("PM.select")}
                  isRequired
                  searchType=""
                  searchProperty="name"
                  valueFilter={{
                    name: "",
                    budgetId: record.projectId?.id || "",
                  }}
                  classFilter={undefined}
                  isSearch
                  render={(t) => (t ? t.code : "")}
                  isEnumerable={false}
                  value={record?.costLineId}
                  appendToBody
                  getList={(search) => getListCostLines(search, record)}
                  onChange={(value, objectValue) => {
                    handleChangeItemTable(
                      "costLineId",
                      value,
                      objectValue,
                      record.id,
                      `costAllocationLines[${record?.indexBeforeValidate}].costLineId`
                    );
                  }}
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
        render: (_, record: CostAllocation) => {
          if (record.isTotal) return null;
          const isDisabled =
            model?.isAdjust &&
            model?.costAllocationLines?.some(
              (line: CostAllocation) => line.id === record?.id
            ) &&
            record?.usedAmount > 0;
          return (
            <LayoutCell className="action-column">
              <div className="payment-red cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={
                    isDisabled ? null : () => handleDeleteRowConfirm(record?.id)
                  }
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
                setSelectedRowKeys([...selectedRowKeys, record?.id]);
              } else {
                setSelectedRowKeys(
                  selectedRowKeys.filter((key) => key !== record?.id)
                );
              }
            }}
            disabled={
              model?.isAdjust &&
              model?.costAllocationLines?.some(
                (line: CostAllocation) => line.id === record?.id
              ) &&
              record?.usedAmount > 0
            }
          />
        </div>
      );
    },
  };

  if (model.isDetail) return <CostAllocationTableDetail />;

  return (
    <div className="cost-allocation-wrapper">
      <div className="cost-allocation-content">
        {model.costDriver?.code === LIST_TYPE_COST.COST__ABSOLUTE_AMOUNT ? (
          <Button
            icon={<img src={add} alt="img" width={12} height={12} />}
            iconPlace="left"
            type="secondary"
            onClick={handleClickAddCostAllocationLine}
          >
            {translate("PP.add_row")}
          </Button>
        ) : (
          <AnotherCostAllocation />
        )}
        <Button
          icon={<img src={ViewBudgetIcon} alt="img" width={16} height={16} />}
          iconPlace="left"
          type="text"
          onClick={() => {
            setIsOpenModalBudgetOverView(true);
          }}
          disabled={!checkShowViewBudgetStatus()}
          className="btn-budget"
        >
          {translate("PM.view_budget_status")}
        </Button>
      </div>

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
        dataSource={[
          ...model.costAllocation,
          {
            isTotal: true,
          },
        ]}
        isDragable={true}
        rowSelection={rowSelection}
        idContainer="table-id"
        rowClassName="cost-allocation-row"
        scroll={{ y: "calc(100vh - 320px)" }}
      />

      <ModalConfirm
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
      {isOpenModalBudgetOverView && (
        <ModalBudgetStatus
          costAllocation={model?.costAllocation}
          purposeOfPurchase={model?.procurementPurpose}
          handleCancelModalBudgetStatus={() => {
            setIsOpenModalBudgetOverView(false);
          }}
          open
          isProposal={true}
          rate={
            model.currency?.code != VND_CURRENCY ? model?.rateInfo?.rate : null
          }
        />
      )}
    </div>
  );
};

export default CostAllocationTable;
