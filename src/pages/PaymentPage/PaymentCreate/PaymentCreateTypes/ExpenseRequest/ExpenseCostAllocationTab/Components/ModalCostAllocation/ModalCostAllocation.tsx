import dayjs from "dayjs";
import { isEmpty, isEqual } from "lodash";
import {
  AutoCostAllocationDocumentAttachModel,
  COST_DRIVER_TYPE,
  CostAllocation,
  PaymentCreateModel,
  VND_CURRENCY,
} from "models/Payment";
import { Dispatch, Key, SetStateAction, useContext, useState } from "react";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_MODAL_TYPE,
  PaymentCreateHookContext,
} from "../../../../../PaymentCreateHook";
import AllocationAcreage from "../AllocationAcreage/AllocationAcreage";

const MODAL_SIZE = 1100;

interface Props {
  changeSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

const ModalCostAllocation = ({ changeSelectedRowKeys }: Props) => {
  const {
    model,
    modalCostAllocation,
    isVNDOrJPY,
    setModalCostAllocation,
    handleChangeAllField,
    handleChangeSingleField,
    notifyToast,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const [translate] = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const ModalTitle = () => {
    return (
      <div className="d-flex">
        {translate("PM.payment_automatic_cost_allocation")}
      </div>
    );
  };

  const onDismiss = () => {
    setModalCostAllocation(DEFAULT_MODAL_TYPE);
    setSelectedRowKeys([]);
    handleChangeAllField({
      ...model,
      errors: {
        allocationMonth: null,
        autoCostAllocationDocumentsAttach: null,
        preTaxToTalAmountAuto: null,
        taxToTalAmountAuto: null,
        preTaxUnitPrice: null,
      },
    });
  };

  const handleSubmitModalCostAllocation = () => {
    const calculateTotalAreaAndEmployee = () => {
      const data =
        selectedRowKeys.length > 0
          ? model?.autoCostAllocationDocumentsAttach?.filter(
              (item: CostAllocation) => selectedRowKeys.includes(item.id)
            )
          : model?.autoCostAllocationDocumentsAttach;

      return (
        data?.reduce(
          (sum: number, item: AutoCostAllocationDocumentAttachModel) =>
            sum + (item?.value ?? 0),
          0
        ) || 0
      );
    };

    const totalAreaAndEmployee = calculateTotalAreaAndEmployee();

    const totalPreTaxAmount = (item: CostAllocation) => {
      switch (model.costDriver?.code) {
        case COST_DRIVER_TYPE.COST_DRIVER_AREA:
          if (model.preTaxToTalAmount || totalAreaAndEmployee || item.value) {
            if (isVNDOrJPY) {
              return Number(
                Math.round(
                  (model.preTaxToTalAmount?.toString()?.replaceAll(".", "") /
                    totalAreaAndEmployee) *
                    item.value
                )
              );
            } else {
              return Number(
                (
                  Math.round(
                    (model.preTaxToTalAmount?.toString()?.replaceAll(",", ".") /
                      totalAreaAndEmployee) *
                      item.value *
                      10000
                  ) / 10000
                ).toFixed(4)
              );
            }
          }
          return 0;
        case COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY:
          if (model.preTaxToTalAmount || totalAreaAndEmployee || item.value) {
            if (isVNDOrJPY) {
              return Number(
                Math.round(
                  (model.preTaxToTalAmount?.toString()?.replaceAll(".", "") /
                    totalAreaAndEmployee) *
                    item.value
                )
              );
            } else {
              return Number(
                (
                  Math.round(
                    (model.preTaxToTalAmount?.toString()?.replaceAll(",", ".") /
                      totalAreaAndEmployee) *
                      item.value *
                      10000
                  ) / 10000
                ).toFixed(4)
              );
            }
          }
          return 0;
        case COST_DRIVER_TYPE.COST_DRIVER_QUANTITY:
          if (model.isPriceExcludingTax) {
            if (model.preTaxUnitPrice || item.quantity) {
              if (model?.currency.code === VND_CURRENCY) {
                return Number(
                  Math.round(
                    model.preTaxUnitPrice?.toString()?.replaceAll(".", "") *
                      item.quantity
                  )
                );
              } else {
                return Number(
                  Math.round(
                    model.preTaxUnitPrice?.toString()?.replaceAll(",", ".") *
                      item.quantity *
                      10000
                  ) / 10000
                );
              }
            }
            return 0;
          } else {
            if (item.preTaxUnitPrice || item.quantity) {
              if (isVNDOrJPY) {
                return Number(Math.round(item.preTaxUnitPrice * item.quantity));
              } else {
                return Number(
                  Math.round(
                    item.preTaxUnitPrice?.toString()?.replaceAll(",", ".") *
                      item.quantity *
                      10000
                  ) / 10000
                );
              }
            }
            return 0;
          }
        case COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE:
          if (model.preTaxToTalAmount || item.percentage) {
            if (isVNDOrJPY) {
              return Number(
                Math.round(
                  (model.preTaxToTalAmount?.toString()?.replaceAll(".", "") /
                    100) *
                    item.percentage
                )
              );
            } else {
              return Number(
                Math.round(
                  (model.preTaxToTalAmount?.toString()?.replaceAll(",", ".") /
                    100) *
                    item.percentage *
                    10000
                ) / 10000
              );
            }
          }
          return 0;
      }
    };

    const totalTaxAmount = (item: CostAllocation) => {
      switch (model.costDriver?.code) {
        case COST_DRIVER_TYPE.COST_DRIVER_AREA:
          if (
            model.taxId ||
            model.taxToTalAmount ||
            totalAreaAndEmployee ||
            item.value
          ) {
            if (isVNDOrJPY) {
              return Math.round(
                (model.taxToTalAmount?.toString()?.replaceAll(".", "") /
                  totalAreaAndEmployee) *
                  item.value
              );
            } else {
              return Number(
                Math.round(
                  (model.taxToTalAmount?.toString()?.replaceAll(",", ".") /
                    totalAreaAndEmployee) *
                    item.value *
                    10000
                ) / 10000
              );
            }
          }
          return 0;
        case COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY:
          if (
            model.taxId ||
            model.taxToTalAmount ||
            totalAreaAndEmployee ||
            item.value
          ) {
            if (isVNDOrJPY) {
              return Number(
                Math.round(
                  (model.taxToTalAmount?.toString()?.replaceAll(".", "") /
                    totalAreaAndEmployee) *
                    item.value
                )
              );
            } else {
              return Number(
                Math.round(
                  (model.taxToTalAmount?.toString()?.replaceAll(",", ".") /
                    totalAreaAndEmployee) *
                    item.value *
                    10000
                ) / 10000
              );
            }
          }
          return 0;
        case COST_DRIVER_TYPE.COST_DRIVER_QUANTITY:
          if (model.taxId != null || totalPreTaxAmount) {
            const valuePreTax = totalPreTaxAmount(item);
            if (isVNDOrJPY) {
              return Number(
                Math.round(valuePreTax * model?.taxId?.rate * 0.01)
              );
            } else {
              return Number(
                Math.round(valuePreTax * model?.taxId?.rate * 0.01 * 10000) /
                  10000
              );
            }
          }
          return 0;
        case COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE:
          if (model.taxToTalAmount || item?.percentage) {
            if (isVNDOrJPY) {
              return Number(
                Math.round(
                  (model.taxToTalAmount?.toString()?.replaceAll(".", "") /
                    100) *
                    item?.percentage
                )
              );
            } else {
              return Number(
                Math.round(
                  (model.taxToTalAmount?.toString()?.replaceAll(",", ".") /
                    100) *
                    item?.percentage *
                    10000
                ) / 10000
              );
            }
          }
          return 0;
      }
    };

    const generateCostAllocationLines = (data: CostAllocation[]) => {
      return data.map((item: CostAllocation, index: number) => ({
        id: dayjs().valueOf().toString() + index,
        businessBranchId: item?.businessBranchId || null,
        businessDepartmentId: item?.businessDepartmentId || null,
        businessUnitId: item?.businessUnitId || null,
        expenseDetail: model.expenseDetail,
        taxType: model.taxId,
        taxAmount: totalTaxAmount(item) || 0,
        projectId: model.projectId,
        costLineId: model.costLineId,
        area: item?.area || null,
        quantity: item?.quantity || null,
        preTaxUnitPrice: model.isPriceExcludingTax
          ? model.preTaxUnitPrice
          : item?.preTaxUnitPrice || 0,
        employeeCount: item?.employeeCount || null,
        percentage: item?.percentage || null,
        costAllocationId: model.costAllocationId,
        preTaxAmount: totalPreTaxAmount(item) || 0,
      }));
    };

    const costAllocationLines =
      selectedRowKeys.length > 0
        ? generateCostAllocationLines(
            model?.autoCostAllocationDocumentsAttach?.filter(
              (item: CostAllocation) => selectedRowKeys.includes(item.id)
            ) || []
          )
        : generateCostAllocationLines(
            model?.autoCostAllocationDocumentsAttach || []
          );

    const duplicates = costAllocationLines?.filter(
      (item, index) =>
        costAllocationLines?.findIndex(
          (otherItem, otherIndex) =>
            index !== otherIndex &&
            item?.businessBranchId?.id != null &&
            otherItem?.businessBranchId?.id != null &&
            item?.businessBranchId?.id === otherItem?.businessBranchId?.id &&
            item?.businessDepartmentId?.id != null &&
            otherItem?.businessDepartmentId?.id != null &&
            item?.businessDepartmentId?.id ===
              otherItem?.businessDepartmentId?.id &&
            item?.businessUnitId?.id != null &&
            otherItem?.businessUnitId?.id != null &&
            item?.businessUnitId?.id === otherItem?.businessUnitId?.id
        ) !== -1
    );

    const totalPercentage = costAllocationLines.reduce(
      (total, item) => total + (item?.percentage || 0),
      0
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors: any = {};

    const regexExpenseDetail = /^(?!.*["'])(?=.{1,240}$).+$/;

    switch (model.costDriver?.code) {
      case COST_DRIVER_TYPE.COST_DRIVER_QUANTITY:
        if (
          (model.preTaxUnitPrice == null || isNaN(model.preTaxUnitPrice)) &&
          model.isPriceExcludingTax
        ) {
          errors["preTaxUnitPrice"] = translate("CM.input_require_validation");
        }
        if (!regexExpenseDetail.test(model.expenseDetail)) {
          errors["expenseDetail"] = translate("CM.input_regex_validation");
        }

        if (costAllocationLines?.length > 0) {
          if (!model.isPriceExcludingTax) {
            costAllocationLines.forEach(
              (item: AutoCostAllocationDocumentAttachModel, index: number) => {
                if (!errors["autoCostAllocationDocumentsAttach"]) {
                  errors["autoCostAllocationDocumentsAttach"] = {};
                }
                if (!errors["autoCostAllocationDocumentsAttach"][index]) {
                  errors["autoCostAllocationDocumentsAttach"][index] = {};
                }

                if (!item.businessBranchId) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                  ];
                }

                if (!item.businessUnitId) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                  ];
                }

                if (!item.businessDepartmentId) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                  ];
                }

                if (
                  item.preTaxUnitPrice == null ||
                  isNaN(item.preTaxUnitPrice)
                ) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].preTaxUnitPrice`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].preTaxUnitPrice`
                  ];
                }
                if (!item.quantity) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].quantity`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].quantity`
                  ];
                }
              }
            );
          } else {
            costAllocationLines.forEach(
              (item: AutoCostAllocationDocumentAttachModel, index: number) => {
                if (!errors["autoCostAllocationDocumentsAttach"]) {
                  errors["autoCostAllocationDocumentsAttach"] = {};
                }
                if (!errors["autoCostAllocationDocumentsAttach"][index]) {
                  errors["autoCostAllocationDocumentsAttach"][index] = {};
                }

                if (!item.businessBranchId) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                  ];
                }

                if (!item.businessUnitId) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                  ];
                }

                if (!item.businessDepartmentId) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                  ];
                }
                if (!item.quantity) {
                  errors[
                    `autoCostAllocationDocumentsAttach[${index}].quantity`
                  ] = translate("CM.input_require_validation");
                } else {
                  delete errors[
                    `autoCostAllocationDocumentsAttach[${index}].quantity`
                  ];
                }
              }
            );
          }
        }
        break;
      case COST_DRIVER_TYPE.COST_DRIVER_AREA:
        if (!model.allocationMonth) {
          errors["allocationMonth"] = translate("CM.input_require_validation");
        }
        if (!model.preTaxToTalAmount) {
          errors["preTaxToTalAmount"] = translate(
            "CM.input_require_validation"
          );
        }
        if (!regexExpenseDetail.test(model.expenseDetail)) {
          errors["expenseDetail"] = translate("CM.input_regex_validation");
        }

        if (model.taxToTalAmount === undefined) {
          errors["taxToTalAmount"] = translate("CM.input_require_validation");
        }
        if (costAllocationLines?.length > 0) {
          costAllocationLines.forEach(
            (item: AutoCostAllocationDocumentAttachModel, index: number) => {
              if (!errors["autoCostAllocationDocumentsAttach"]) {
                errors["autoCostAllocationDocumentsAttach"] = [];
              }

              if (!errors["autoCostAllocationDocumentsAttach"][index]) {
                errors["autoCostAllocationDocumentsAttach"][index] = {};
              }
              if (!item.businessBranchId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                ];
              }

              if (!item.businessUnitId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                ];
              }

              if (!item.businessDepartmentId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                ];
              }
            }
          );
        }
        break;
      case COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY:
        if (!model.allocationMonth) {
          errors["allocationMonth"] = translate("CM.input_require_validation");
        }
        if (!model.preTaxToTalAmount) {
          errors["preTaxToTalAmount"] = translate(
            "CM.input_require_validation"
          );
        }
        if (model.taxToTalAmount === undefined) {
          errors["taxToTalAmount"] = translate("CM.input_require_validation");
        }
        if (!regexExpenseDetail.test(model.expenseDetail)) {
          errors["expenseDetail"] = translate("CM.input_regex_validation");
        }

        if (costAllocationLines?.length > 0) {
          costAllocationLines.forEach(
            (item: AutoCostAllocationDocumentAttachModel, index: number) => {
              if (!errors["autoCostAllocationDocumentsAttach"]) {
                errors["autoCostAllocationDocumentsAttach"] = [];
              }

              if (!errors["autoCostAllocationDocumentsAttach"][index]) {
                errors["autoCostAllocationDocumentsAttach"][index] = {};
              }
              if (!item.businessBranchId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                ];
              }

              if (!item.businessUnitId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                ];
              }

              if (!item.businessDepartmentId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                ];
              }
            }
          );
        }
        break;
      case COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE:
        if (!model.preTaxToTalAmount) {
          errors["preTaxToTalAmount"] = translate(
            "CM.input_require_validation"
          );
        }
        if (model.taxToTalAmount === undefined) {
          errors["taxToTalAmount"] = translate("CM.input_require_validation");
        }
        if (!regexExpenseDetail.test(model.expenseDetail)) {
          errors["expenseDetail"] = translate("CM.input_regex_validation");
        }

        if (costAllocationLines?.length > 0 && !model.isPriceExcludingTax) {
          costAllocationLines.forEach(
            (item: AutoCostAllocationDocumentAttachModel, index: number) => {
              if (!errors["autoCostAllocationDocumentsAttach"]) {
                errors["autoCostAllocationDocumentsAttach"] = {};
              }
              if (!errors["autoCostAllocationDocumentsAttach"][index]) {
                errors["autoCostAllocationDocumentsAttach"][index] = {};
              }

              if (!item.percentage) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].percentage`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].percentage`
                ];
              }

              if (!item.businessBranchId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessBranchId`
                ];
              }

              if (!item.businessUnitId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessUnitId`
                ];
              }

              if (!item.businessDepartmentId) {
                errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                ] = translate("CM.input_require_validation");
              } else {
                delete errors[
                  `autoCostAllocationDocumentsAttach[${index}].businessDepartmentId`
                ];
              }
            }
          );
        }
        break;
    }
    handleChangeAllField({
      ...model,
      errors,
    });

    if (duplicates?.length > 0) {
      notifyToast({
        message: translate("PM.payment_duplicate_cost_center"),
        type: "error",
      });
    }

    if (costAllocationLines.length > 500) {
      notifyToast({
        message: translate("PM.payment_maximum_500_cost_allocation"),
        type: "error",
      });
    }

    if (
      model?.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE &&
      model.autoCostAllocationDocumentsAttach?.length > 0 &&
      totalPercentage != 100
    ) {
      notifyToast({
        message: translate("PM.payment_total_percentage_not_equal"),
        type: "error",
      });
    }

    delete errors.autoCostAllocationDocumentsAttach;

    if (
      model?.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE &&
      totalPercentage == 100 &&
      isEmpty(errors) &&
      duplicates?.length <= 0 &&
      costAllocationLines.length > 0 &&
      costAllocationLines.length < 500 &&
      regexExpenseDetail.test(model.expenseDetail) === true
    ) {
      handleChangeSingleField({
        fieldName: "costAllocation",
      })(costAllocationLines);
      setModalCostAllocation(DEFAULT_MODAL_TYPE);
      setSelectedRowKeys([]);
      changeSelectedRowKeys([]);
    }

    if (
      model?.costDriver?.code !== COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE &&
      isEmpty(errors) &&
      duplicates?.length <= 0 &&
      costAllocationLines.length > 0 &&
      costAllocationLines.length < 500 &&
      regexExpenseDetail.test(model.expenseDetail) === true
    ) {
      handleChangeSingleField({
        fieldName: "costAllocation",
      })(costAllocationLines);
      setModalCostAllocation(DEFAULT_MODAL_TYPE);
      setSelectedRowKeys([]);
      changeSelectedRowKeys([]);
    }
  };

  return (
    <>
      {isEqual(modalCostAllocation.type, "CREATE") && (
        <Modal
          title={<ModalTitle />}
          open={isEqual(modalCostAllocation.type, "CREATE")}
          size={MODAL_SIZE}
          centered
          titleButtonApply={translate("PM.btn_choose")}
          titleButtonCancel={translate("PM.bth_close")}
          handleCancel={onDismiss}
          onCancel={onDismiss}
          handleSave={handleSubmitModalCostAllocation}
          disableButtonApply={
            !model?.autoCostAllocationDocumentsAttach ||
            model?.autoCostAllocationDocumentsAttach?.length === 0
          }
          // loading={loading}
          isShowIconBack={false}
        >
          <AllocationAcreage
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        </Modal>
      )}
    </>
  );
};

export default ModalCostAllocation;
