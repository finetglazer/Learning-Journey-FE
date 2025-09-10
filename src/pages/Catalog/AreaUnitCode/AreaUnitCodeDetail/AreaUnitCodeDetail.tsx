import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import _, { isNull } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import React, { useMemo } from "react";
import {
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  Modal,
  Select,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import "./AreaUnitCodeDetail.scss";
import { useAreaUnitCodeDetailHooks } from "./AreaUnitCodeDetailHooks";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { NUMBER_MAX_13 } from "config/const";
import { BusinessUnit } from "models/Project/Project";
import { ConfirmSaveModal } from "./ConfirmSaveModal/ConfirmSaveModal";
import { getDateToVietnam } from "core/helpers/date-time";
const MODAL_WIDTH = 600;
const DATE_FORMAT = [
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_INVERSE,
];
const DATE_PLACEHOLDER = "dd/mm/yy";

interface AreaUnitCodeDetailProps {
  open: boolean;
  areaUnitCodeId: string;
  handleCancel: (shouldReloadList?: boolean) => void;
  date?: string;
}

export const AreaUnitCodeDetail = ({
  open,
  areaUnitCodeId,
  date,
  handleCancel,
}: AreaUnitCodeDetailProps) => {
  const {
    model,
    isLoading,
    translate,
    handleChangeAllField,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeDateField,
    handleConfirmSave,
    visibleConfirmModal,
    onSave,
    handleCancelConfirmModal,
  } = useAreaUnitCodeDetailHooks(handleCancel, areaUnitCodeId, open, date);

  const title: string = useMemo(() => {
    const translatedKey = isNull(areaUnitCodeId)
      ? "AUC.title_create_cost_center"
      : "AUC.title_edit_cost_center";

    return translate(translatedKey);
  }, [areaUnitCodeId, translate]);

  const handleChangeBussinessUnit = React.useCallback(
    (id: number, T?: BusinessUnit) => {
      const newModel = _.cloneDeep(model);
      if (!newModel?.businessUnitId || newModel?.businessUnitId !== id) {
        newModel.businessUnit = T;
        newModel.businessUnitId = id;
        newModel.businessDepartment = undefined;
        newModel.businessDepartmentId = undefined;
        handleChangeAllField(newModel);
      }
    },
    [handleChangeAllField, model]
  );

  return (
    <>
      <Modal
        open={open}
        loading={isLoading}
        isShowIconBack={false}
        size={MODAL_WIDTH}
        title={title}
        titleButtonApply={translate("CM.txt_save")}
        titleButtonCancel={translate("CM.btn_close")}
        handleSave={model?.id ? onSave : handleConfirmSave}
        handleCancel={handleCancel}
      >
        <div className="area-unit-code-detail">
          <div className="d-flex gap-3">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "businessUnitId"
              )}
            >
              <Select
                label={translate("AUC.txt_nhcd_cost_center")}
                placeHolder={translate(
                  "AUC.placeholder_select_nhcd_cost_center"
                )}
                classFilter={undefined}
                searchProperty="name"
                searchType=""
                isSearch={true}
                valueFilter={{
                  name: "",
                }}
                onChange={handleChangeBussinessUnit}
                getList={budgetRepository.costOwnerList}
                isEnumerable={false}
                render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
                value={model?.businessUnit}
                isSmall={false}
                isRequired
                appendToBody
              />
            </FormItem>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "businessBranchId"
              )}
            >
              <Select
                label={translate("AUC.txt_cn_pgd_cost_center")}
                placeHolder={translate(
                  "AUC.placeholder_select_cn_pgd_cost_center"
                )}
                classFilter={undefined}
                searchProperty="name"
                searchType=""
                isSearch={true}
                valueFilter={{
                  name: "",
                }}
                getList={paymentRepository.listBusinessBranchId}
                onChange={handleChangeSelectField({
                  fieldName: "businessBranch",
                })}
                isEnumerable={false}
                render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
                value={model?.businessBranch}
                isSmall={false}
                isRequired
                appendToBody
              />
            </FormItem>
          </div>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "businessDepartmentId"
            )}
          >
            <Select
              label={translate("AUC.txt_tt_pb_cost_center")}
              placeHolder={translate(
                "AUC.placeholder_select_tt_pb_cost_center"
              )}
              searchType=""
              valueFilter={{
                name: "",
                businessUnitId: model?.businessUnitId
                  ? model?.businessUnitId
                  : undefined,
              }}
              isEnumerable={false}
              classFilter={undefined}
              isSearch
              getList={purchaseRequestRepository.getListPurchaseProposal}
              onChange={handleChangeSelectField({
                fieldName: "businessDepartment",
              })}
              value={model?.businessDepartment}
              isSmall={false}
              isRequired
              appendToBody
              disabled={!model?.businessUnitId}
            />
          </FormItem>
          <div className="d-flex gap-3">
            <FormItem
              validateObject={utilService.getValidateObj(model, "area")}
            >
              <InputNumber
                label={translate("AUC.txt_area_m2")}
                placeHolder={translate("AUC.placeholder_input_area")}
                value={model?.area}
                onChange={handleChangeSingleField({
                  fieldName: "area",
                })}
                isSmall={false}
                max={NUMBER_MAX_13}
                numberType="DECIMAL"
                isRequired
              />
            </FormItem>
            <FormItem
              validateObject={utilService.getValidateObj(model, "contractCode")}
            >
              <InputText
                label={translate("AUC.txt_contract_code")}
                placeHolder={translate("AUC.placeholder_input_contract_code")}
                value={model?.contractCode}
                onChange={handleChangeSingleField({
                  fieldName: "contractCode",
                })}
                isSmall={false}
              />
            </FormItem>
          </div>
          <div className="d-flex gap-3">
            <FormItem
              validateObject={utilService.getValidateObj(model, "startTime")}
            >
              <DatePicker
                label={translate("AUC.txt_contract_start_date")}
                placeholder={DATE_PLACEHOLDER}
                className="area-unit-code__action__left__date"
                dateFormat={DATE_FORMAT}
                isSmall={false}
                value={
                  model?.startTime
                    ? getDateToVietnam(model.startTime)
                    : undefined
                }
                onChange={handleChangeDateField({
                  fieldName: "startTime",
                })}
              />
            </FormItem>
            <FormItem
              validateObject={utilService.getValidateObj(model, "expireTime")}
            >
              <DatePicker
                label={translate("AUC.txt_contract_end_date")}
                placeholder={DATE_PLACEHOLDER}
                className="area-unit-code__action__left__date"
                dateFormat={DATE_FORMAT}
                isSmall={false}
                value={
                  model?.expireTime
                    ? getDateToVietnam(model.expireTime)
                    : undefined
                }
                onChange={handleChangeDateField({
                  fieldName: "expireTime",
                })}
              />
            </FormItem>
          </div>
        </div>
      </Modal>
      <ConfirmSaveModal
        visibleConfirmModal={visibleConfirmModal}
        onSave={onSave}
        handleCancel={handleCancelConfirmModal}
        date={date}
      />
    </>
  );
};
