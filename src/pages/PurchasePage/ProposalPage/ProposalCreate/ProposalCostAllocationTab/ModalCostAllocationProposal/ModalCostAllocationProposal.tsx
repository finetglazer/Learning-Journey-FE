import { Key } from "antd/lib/table/interface";
import { detectIntegerCurrency } from "core/helpers/currency";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import { isEmpty, isEqual, isNil } from "lodash";
import {
  AutoCostAllocationDocumentAttachModel,
  CostAllocation,
  DEFAULT_MODAL_TYPE,
  LIST_TYPE_COST,
  ProposalCreateModel,
  ProposalValidCostCenterModel,
} from "models/Proposal";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { useContext, useState } from "react";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { lastValueFrom } from "rxjs";
import { ProposalCreateHookContext } from "../../ProposalCreateHook";
import ContentModalCostAllocationProposal from "./ContentModalCostAllocationProposal/ContentModalCostAllocationProposal";
const MODAL_SIZE = 1100;

const ModalCostAllocationProposal = () => {
  const {
    model,
    modalCostAllocation,
    setModalCostAllocation,
    handleChangeAllField,
    notifyToast,
    handleChangeSingleField,
    isRowDisabled,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);
  const [translate] = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const onDismiss = () => {
    setModalCostAllocation(DEFAULT_MODAL_TYPE);
    setSelectedRowKeys([]);
    handleChangeAllField({
      ...model,
      errors: {
        allocationMonth: null,
        autoCostAllocationDocumentsAttach: null,
        estimateIncludesTax: null,
        contingencyIncludesTax: null,
      },
    });
  };

  const handleSubmitModalCostAllocation = async () => {
    const calculateTotalAreaAndEmployee = () => {
      const data =
        selectedRowKeys.length > 0
          ? model?.autoCostAllocationDocumentsAttach?.filter(
              (item: CostAllocation) => selectedRowKeys.includes(item.id)
            )
          : model?.autoCostAllocationDocumentsAttach;

      return (
        data?.reduce(
          (sum: number, item: CostAllocation) => sum + (item?.value ?? 0),
          0
        ) || 0
      );
    };

    const totalAreaAndEmployee = calculateTotalAreaAndEmployee();

    const contingencyAmount = (item: CostAllocation) => {
      const contingencyAmountValue =
        Number(
          formatNumber(model.totalContingencyAmount)
            ?.replaceAll(".", "")
            ?.replaceAll(",", ".")
        ) || 0;
      const totalValue = totalAreaAndEmployee || 0;

      switch (model.costDriver?.code) {
        case LIST_TYPE_COST.COST__AREA: {
          if (contingencyAmountValue && totalValue && item.value) {
            const areaValue = item.value || 0;

            if (totalValue === 0) return 0;

            return detectIntegerCurrency(model?.currency?.code)
              ? Math.round((contingencyAmountValue / totalValue) * areaValue)
              : Number(
                  ((contingencyAmountValue / totalValue) * areaValue).toFixed(2)
                );
          }
          return 0;
        }

        case LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY: {
          if (contingencyAmountValue && totalValue && item.value) {
            const employeeValue = item.value || 0;

            if (totalValue === 0) return 0;

            return detectIntegerCurrency(model?.currency?.code)
              ? Math.round(
                  (contingencyAmountValue / totalValue) * employeeValue
                )
              : Number(
                  (
                    (contingencyAmountValue / totalValue) *
                    employeeValue
                  ).toFixed(2)
                );
          }
          return 0;
        }

        case LIST_TYPE_COST.COST__QUANTITY: {
          const quantityValue = item.quantity || 0;

          if (model.isPriceExcludingTax) {
            if (contingencyAmountValue && quantityValue) {
              return detectIntegerCurrency(model?.currency?.code)
                ? Math.round(model?.contingencyIncludesTax * quantityValue)
                : Number(
                    (model?.contingencyIncludesTax * quantityValue).toFixed(2)
                  );
            }
          } else {
            if (item.contingencyIncludesTax && quantityValue) {
              return detectIntegerCurrency(model?.currency?.code)
                ? Math.round(item?.contingencyIncludesTax * quantityValue)
                : Number(
                    (item?.contingencyIncludesTax * quantityValue).toFixed(2)
                  );
            }
          }
          return 0;
        }

        case LIST_TYPE_COST.COST__PERCENTAGE: {
          const percentageValue = item.percentage || 0;

          if (contingencyAmountValue && percentageValue) {
            return detectIntegerCurrency(model?.currency?.code)
              ? Math.round((contingencyAmountValue / 100) * percentageValue)
              : Number(
                  ((contingencyAmountValue / 100) * percentageValue).toFixed(2)
                );
          }
          return 0;
        }

        default:
          return 0;
      }
    };

    const estimateAmount = (item: CostAllocation) => {
      const estimateAmountValue =
        Number(
          formatNumber(model.totalEstimateAmount)
            ?.replaceAll(".", "")
            ?.replaceAll(",", ".")
        ) || 0;

      const totalValue = totalAreaAndEmployee || 0;

      switch (model.costDriver?.code) {
        case LIST_TYPE_COST.COST__AREA: {
          if (estimateAmountValue && totalValue && item.value) {
            const areaValue = item.value || 0;

            if (totalValue === 0) return 0;

            return detectIntegerCurrency(model?.currency?.code)
              ? Math.round((estimateAmountValue / totalValue) * areaValue)
              : Number(
                  ((estimateAmountValue / totalValue) * areaValue).toFixed(2)
                );
          }
          return 0;
        }

        case LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY: {
          if (estimateAmountValue && totalValue && item.value) {
            const employeeValue = item.value || 0;

            if (totalValue === 0) return 0;

            return detectIntegerCurrency(model?.currency?.code)
              ? Math.round((estimateAmountValue / totalValue) * employeeValue)
              : Number(
                  ((estimateAmountValue / totalValue) * employeeValue).toFixed(
                    2
                  )
                );
          }
          return 0;
        }

        case LIST_TYPE_COST.COST__QUANTITY: {
          const quantityValue = item.quantity || 0;

          if (model.isPriceExcludingTax) {
            if (estimateAmountValue && quantityValue) {
              return detectIntegerCurrency(model?.currency?.code)
                ? Math.round(model?.estimateIncludesTax * quantityValue)
                : Number(
                    (model?.estimateIncludesTax * quantityValue).toFixed(2)
                  );
            }
          } else {
            if (item?.estimateIncludesTax && quantityValue) {
              return detectIntegerCurrency(model?.currency?.code)
                ? Math.round(item?.estimateIncludesTax * quantityValue)
                : Number(
                    (item?.estimateIncludesTax * quantityValue).toFixed(2)
                  );
            }
          }
          return 0;
        }

        case LIST_TYPE_COST.COST__PERCENTAGE: {
          const percentageValue = item.percentage || 0;

          if (estimateAmountValue && percentageValue) {
            return detectIntegerCurrency(model?.currency?.code)
              ? Math.round((estimateAmountValue / 100) * percentageValue)
              : Number(
                  ((estimateAmountValue / 100) * percentageValue).toFixed(2)
                );
          }
          return 0;
        }

        default:
          return 0;
      }
    };

    const generateCostAllocationLines = async (data: CostAllocation[]) => {
      const costCenter: ProposalValidCostCenterModel[] = data.map((cost) => {
        return {
          businessBranchId: cost?.businessBranchId?.id,
          businessUnitId: cost?.businessUnitId?.id,
          businessDepartmentId: cost?.businessDepartmentId?.id,
          budgetId: model?.projectName?.id,
          costLineId: model?.costLineName?.id,
        };
      });
      const listValidCostCenter = await lastValueFrom(
        proposalRepository.validCostCenter(costCenter)
      );

      return data
        ?.filter((item) => (model.isAdjust ? !isRowDisabled(item) : true))
        .map((item: CostAllocation, index: number) => ({
          id: dayjs().valueOf().toString() + index,
          businessBranchId: item.businessBranchId,
          businessDepartmentId: item.businessDepartmentId,
          businessUnitId: item.businessUnitId,
          estimateAmount: estimateAmount(item) || 0,
          contingencyAmount: contingencyAmount(item) || 0,
          projectId: listValidCostCenter?.includes(index)
            ? model.projectName
            : null,
          costLineId: listValidCostCenter?.includes(index)
            ? model.costLineName
            : null,

          area: item.area,
          estimateIncludesTax: item.estimateIncludesTax,
          contingencyIncludesTax: item.contingencyIncludesTax,
          quantity: item.quantity,
          employeeCount: item.employeeCount,
          percentage: item.percentage,
          costAllocationId: model.costAllocationId,
        }));
    };

    const costAllocationLines =
      selectedRowKeys.length > 0
        ? await generateCostAllocationLines(
            model?.autoCostAllocationDocumentsAttach?.filter(
              (item: CostAllocation) => selectedRowKeys.includes(item.id)
            ) || []
          )
        : await generateCostAllocationLines(
            model?.autoCostAllocationDocumentsAttach
          );

    const duplicates = costAllocationLines?.filter(
      (item, index) =>
        costAllocationLines?.findIndex(
          (otherItem, otherIndex) =>
            index !== otherIndex &&
            item?.businessBranchId?.id === otherItem?.businessBranchId?.id &&
            item?.businessDepartmentId?.id ===
              otherItem?.businessDepartmentId?.id &&
            item?.businessUnitId?.id === otherItem?.businessUnitId?.id &&
            item?.estimateIncludesTax === otherItem?.estimateIncludesTax &&
            item?.contingencyIncludesTax === otherItem?.contingencyIncludesTax
        ) !== -1
    );

    const totalPercentage = costAllocationLines.reduce(
      (total, item) => total + (item?.percentage || 0),
      0
    );

    const errors = {};

    handleChangeAllField({
      ...model,
    });

    if (duplicates?.length > 0) {
      notifyToast({
        message: translate("PM.payment_duplicate_cost_center"),
        type: "error",
      });
    }

    if (
      model?.costDriver?.code === LIST_TYPE_COST.COST__PERCENTAGE &&
      totalPercentage != 100
    ) {
      notifyToast({
        message: translate("PM.payment_total_percentage_not_equal"),
        type: "error",
      });
    }

    if (
      model?.costDriver?.code === LIST_TYPE_COST.COST__PERCENTAGE &&
      totalPercentage == 100 &&
      isEmpty(errors) &&
      duplicates?.length <= 0 &&
      costAllocationLines?.length > 0 &&
      costAllocationLines?.length < 500
    ) {
      handleChangeSingleField({
        fieldName: "costAllocation",
      })(costAllocationLines);
      setModalCostAllocation(DEFAULT_MODAL_TYPE);
      setSelectedRowKeys([]);
    }

    if (
      model?.costDriver?.code !== LIST_TYPE_COST.COST__PERCENTAGE &&
      isEmpty(errors) &&
      duplicates?.length <= 0 &&
      costAllocationLines?.length > 0 &&
      costAllocationLines?.length < 500
    ) {
      const updatedCostAllocation = model.isAdjust
        ? [...(model.costAllocation || []), ...costAllocationLines] // Gộp dữ liệu cũ và mới
        : costAllocationLines;
      handleChangeSingleField({
        fieldName: "costAllocation",
      })(updatedCostAllocation);
      setModalCostAllocation(DEFAULT_MODAL_TYPE);
      setSelectedRowKeys([]);
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmModalVisible(false);
  };

  const handleConfirmSaveAction = () => {
    setIsConfirmModalVisible(false);
    handleSubmitModalCostAllocation();
  };

  const handleOpenConfirmModal = () => {
    const errors: Record<string, string> = {};
    const costAllocationLines = model?.autoCostAllocationDocumentsAttach || [];
    if (
      !(costAllocationLines?.length > 0 && costAllocationLines?.length < 500)
    ) {
      errors["autoCostAllocationDocumentsAttach"] = translate(
        "CM.input_require_validation"
      );
    }

    const validateField = (
      item: AutoCostAllocationDocumentAttachModel,
      fieldName: string,
      index: number,
      errors: Record<string, string>,
      message: string
    ) => {
      const fieldKey = `autoCostAllocationDocumentsAttach[${index}].${fieldName}`;
      if (isNil(item[fieldName])) {
        errors[fieldKey] = message;
      } else {
        delete errors[fieldKey];
      }
    };

    const validateCostAllocationLines = (
      costAllocationLines: AutoCostAllocationDocumentAttachModel[],
      errors: Record<string, string>,
      fieldsToValidate: string[],
      message: string
    ) => {
      costAllocationLines.forEach((item, index) => {
        fieldsToValidate.forEach((field) => {
          validateField(item, field, index, errors, message);
        });
      });
    };

    switch (model.costDriver?.code) {
      case LIST_TYPE_COST.COST__QUANTITY:
        if (model.isPriceExcludingTax) {
          if (isNil(model.estimateIncludesTax)) {
            errors["estimateIncludesTax"] = translate(
              "CM.input_require_validation"
            );
          }
          if (isNil(model.contingencyIncludesTax)) {
            errors["contingencyIncludesTax"] = translate(
              "CM.input_require_validation"
            );
          }
        }

        if (costAllocationLines?.length > 0) {
          const fieldsToValidate = [
            "businessBranchId",
            "businessUnitId",
            "businessDepartmentId",
            "quantity",
          ];
          if (!model.isPriceExcludingTax) {
            fieldsToValidate.push(
              "estimateIncludesTax",
              "contingencyIncludesTax"
            );
          }
          validateCostAllocationLines(
            costAllocationLines,
            errors,
            fieldsToValidate,
            translate("CM.input_require_validation")
          );
        }
        break;

      case LIST_TYPE_COST.COST__AREA:
      case LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY:
        if (!model.allocationMonth) {
          errors["allocationMonth"] = translate("CM.input_require_validation");
        }
        if (costAllocationLines?.length > 0) {
          const fieldsToValidate = [
            "businessBranchId",
            "businessUnitId",
            "businessDepartmentId",
          ];
          validateCostAllocationLines(
            costAllocationLines,
            errors,
            fieldsToValidate,
            translate("CM.input_require_validation")
          );
        }
        break;

      case LIST_TYPE_COST.COST__PERCENTAGE:
        if (costAllocationLines?.length > 0 && !model.isPriceExcludingTax) {
          const fieldsToValidate = [
            "businessBranchId",
            "businessUnitId",
            "businessDepartmentId",
            "percentage",
          ];
          validateCostAllocationLines(
            costAllocationLines,
            errors,
            fieldsToValidate,
            translate("CM.input_require_validation")
          );
        }
        break;
    }

    handleChangeAllField({
      ...model,
      errors,
    });

    if (isEmpty(errors)) {
      setIsConfirmModalVisible(true);
    }
  };

  return (
    <div>
      {isEqual(modalCostAllocation.type, "CREATE") && (
        <Modal
          title={translate("PP.automatic_cost_allocation")}
          open={isEqual(modalCostAllocation.type, "CREATE")}
          size={MODAL_SIZE}
          centered
          titleButtonApply={translate("PP.btn_save")}
          titleButtonCancel={translate("PP.btn_close")}
          handleCancel={onDismiss}
          onCancel={onDismiss}
          handleSave={handleOpenConfirmModal}
          isShowIconBack={false}
        >
          <ContentModalCostAllocationProposal
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        </Modal>
      )}
      {isConfirmModalVisible && (
        <Modal
          title={translate("PP.determine_cost_analysis_automatically")}
          open={isConfirmModalVisible}
          size={500}
          centered
          titleButtonApply={translate("PP.btn_confirm")}
          titleButtonCancel={translate("PP.btn_close")}
          handleCancel={handleCancelConfirm}
          onCancel={handleCancelConfirm}
          handleSave={handleConfirmSaveAction}
        >
          <div>
            {model?.isAdjust
              ? translate("PP.content_confirm_automatically_adjust")
              : translate("PP.content_confirm_automatically")}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModalCostAllocationProposal;
