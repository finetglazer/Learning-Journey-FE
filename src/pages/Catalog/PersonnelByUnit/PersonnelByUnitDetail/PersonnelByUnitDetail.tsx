import { utilService } from "core/services/common-services/util-service";
import _, { isNull } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import { useCallback, useMemo } from "react";
import {
  FormItem,
  InputNumber,
  Modal,
  Select,
} from "react-components-design-system";
import "./PersonnelByUnitDetail.scss";
import { usePersonnelByUnitDetailHooks } from "./PersonnelByUnitDetailHooks";
import { BusinessUnit } from "models/BusinessUnit";
import { ConfirmSaveModal } from "./ConfirmSaveModal/ConfirmSaveModal";

const MODAL_WIDTH = 600;
interface SpecializedBankDetailProps {
  open: boolean;
  personnelByUnitId: string;
  handleCancel: (shouldReloadList?: boolean) => void;
  date?: string;
}

export const PersonnelByUnitDetail = ({
  open,
  personnelByUnitId,
  date,
  handleCancel,
}: SpecializedBankDetailProps) => {
  const {
    model,
    isLoading,
    translate,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    onSave,
    visibleConfirmModal,
    handleConfirmSave,
    handleCancelConfirmModal,
  } = usePersonnelByUnitDetailHooks(
    handleCancel,
    personnelByUnitId,
    open,
    date
  );

  const title: string = useMemo(() => {
    const translatedKey = isNull(personnelByUnitId)
      ? "PBU.title_create_cost_center"
      : "PBU.title_edit_cost_center";

    return translate(translatedKey);
  }, [personnelByUnitId, translate]);

  const handleChangeBussinessUnit = useCallback(
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
        <div className="personnel-by-unit-detail">
          <div className="d-flex gap-3">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "businessUnitId"
              )}
            >
              <Select
                label={translate("PBU.txt_nhcd_cost_center")}
                placeHolder={translate(
                  "PBU.placeholder_select_nhcd_cost_center"
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
                label={translate("PBU.txt_cn_pgd_cost_center")}
                placeHolder={translate(
                  "PBU.placeholder_select_cn_pgd_cost_center"
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
          <div className="d-flex gap-3">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "businessDepartmentId"
              )}
            >
              <Select
                label={translate("PBU.txt_tt_pb_cost_center")}
                placeHolder={translate(
                  "PBU.placeholder_select_tt_pb_cost_center"
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
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "employeeCount"
              )}
            >
              <InputNumber
                label={translate("PBU.txt_number_of_employees")}
                placeHolder={translate(
                  "PBU.placeholder_enter_number_of_employees"
                )}
                value={model?.employeeCount}
                onChange={handleChangeSingleField({
                  fieldName: "employeeCount",
                })}
                isSmall={false}
                isRequired
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
