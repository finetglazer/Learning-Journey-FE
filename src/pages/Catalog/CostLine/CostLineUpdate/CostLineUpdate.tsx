import { Switch } from "antd";
import InformationSvg from "assets/icons/CostLine/ic_information.svg";
import { costLineRepository } from "core/repositories/CostLineRepository";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty, isEqual } from "lodash";
import { CostLine } from "models/CostLine";
import { useContext } from "react";
import {
  Checkbox,
  FormItem,
  InputText,
  Modal,
  Select,
} from "react-components-design-system";
import {
  budgetCalculationMethodList,
  budgetPeriodList,
} from "../CostLineMaster/constants";
import { CostLineModelFilter } from "../CostLineMaster/CostLineMasterAdvanceFilter";
import {
  CostLineMaster,
  CostLineMasterContext,
  DEFAULT_MODAL_TYPE,
} from "../CostLineMaster/CostLineMasterHook";
import "./CostLineUpdate.scss";
import { useCostLineUpdateHook } from "./CostLineUpdateHook";

const MODAL_SIZE = 600;

export const CostLineUpdate = () => {
  const { modal, setModalType } = useContext<CostLineMaster>(
    CostLineMasterContext
  );

  const {
    translate,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
    onSave,
    loading,
    model,
  } = useCostLineUpdateHook(setModalType, modal?.id);

  const onDismiss = () => {
    setModalType(DEFAULT_MODAL_TYPE);
    handleChangeAllField({ ...new CostLine(), isActive: true });
  };

  const ModalTitle = () => {
    return (
      <div className="d-flex">{translate("CL.update_cost_line_title")}</div>
    );
  };

  return (
    <Modal
      title={<ModalTitle />}
      open={isEqual(modal.type, "UPDATE")}
      size={MODAL_SIZE}
      centered
      titleButtonApply={translate("CL.save_btn")}
      titleButtonCancel={translate("CL.close_btn")}
      handleCancel={onDismiss}
      onCancel={onDismiss}
      handleSave={onSave}
      loading={loading}
      isShowIconBack={false}
    >
      {/* Body */}
      <div className="d-flex size-full flex-column gap-3">
        {/* Warning View */}
        {!isEmpty(model?.message) && (
          <div className="warning-box">
            <img className="mt-1" src={InformationSvg} alt="" />
            <span className="text-description">{model.message}</span>
          </div>
        )}
        <FormItem
          validateObject={utilService.getValidateObj(model, "isActive")}
        >
          <div className="d-flex flex-row gap-2">
            <span className="status-style">{translate("CM.txt_status")}</span>
            <Switch
              className="switch__custom"
              value={model.isActive}
              onChange={handleChangeBoolField({
                fieldName: "isActive",
              })}
              disabled={!isEmpty(model?.message)}
            />
            <span className="active-style">
              {translate("CL.active_status_txt")}
            </span>
          </div>
        </FormItem>
        {/* Code line code */}
        <FormItem validateObject={utilService.getValidateObj(model, "code")}>
          <InputText
            isRequired
            maxLength={50}
            label={translate("CL.code_line_code_txt")}
            placeHolder={translate("CL.code_input_placeholder")}
            value={model.code}
            onChange={handleChangeSingleField({
              fieldName: "code",
            })}
          />
        </FormItem>
        {/* Code line name */}
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            isRequired
            maxLength={500}
            label={translate("CL.code_line_name_txt")}
            placeHolder={translate("CL.name_input_placeholder")}
            value={model.name}
            onChange={handleChangeSingleField({
              fieldName: "name",
            })}
          />
        </FormItem>
        {/* Code line parent */}
        <FormItem validateObject={utilService.getValidateObj(model, "parent")}>
          <Select
            disabled={model?.isUsed}
            label={translate("CL.code_line_parent_txt")}
            placeHolder={translate("CL.parent_search_placeholder")}
            searchProperty="name"
            type={1}
            isSmall={false}
            isSearch
            classFilter={CostLineModelFilter}
            getList={(value) => {
              return costLineRepository.parent(value, model?.id);
            }}
            value={model.parent}
            onChange={handleChangeSelectField({
              fieldName: "parent",
            })}
            isEnumerable={false}
            render={(t) => t?.name}
            appendToBody
          />
        </FormItem>
        {/* Budget view */}
        <div className="d-flex flex-row gap-3">
          {/* Period */}
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "budgetPeriodValue"
            )}
          >
            <Select
              isRequired
              label={translate("CL.budget_period_txt")}
              placeHolder={translate("CL.budget_period_search_placeholder")}
              getList={budgetPeriodList}
              classFilter={CostLineModelFilter}
              value={model.budgetPeriodValue}
              onChange={handleChangeSelectField({
                fieldName: "budgetPeriodValue",
              })}
              disabled={model?.isUsed}
              appendToBody
            />
          </FormItem>
          {/* Calculation method */}
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "budgetCalculationMethodValue"
            )}
          >
            <Select
              isRequired
              label={translate("CL.calculation_method_txt")}
              placeHolder={translate(
                "CL.budget_calculation_method_search_placeholder"
              )}
              getList={budgetCalculationMethodList}
              classFilter={CostLineModelFilter}
              value={model.budgetCalculationMethodValue}
              onChange={handleChangeSelectField({
                fieldName: "budgetCalculationMethodValue",
              })}
              disabled={model?.isUsed}
              appendToBody
            />
          </FormItem>
        </div>
        {/* Cost driver view */}
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "defaultCostDriverValue"
          )}
        >
          <Select
            label={translate("CL.driver_default_txt")}
            placeHolder={translate("CL.driver_default_input_placeholder")}
            searchProperty="name"
            type={1}
            isSmall={false}
            isSearch
            classFilter={CostLineModelFilter}
            getList={costLineRepository.costDriver}
            value={model.defaultCostDriverValue}
            onChange={handleChangeSelectField({
              fieldName: "defaultCostDriverValue",
            })}
            isEnumerable={false}
            render={(t) => t?.name}
            appendToBody
          />
        </FormItem>
        <FormItem
          validateObject={utilService.getValidateObj(model, "isTransfer")}
        >
          <Checkbox
            label={translate("CL.allow_budget_transfer_txt")}
            checked={model.isTransfer}
            onChange={handleChangeBoolField({
              fieldName: "isTransfer",
            })}
          />
        </FormItem>
        <FormItem
          validateObject={utilService.getValidateObj(model, "isBudgetOverruns")}
        >
          <Checkbox
            label={translate("CL.allow_budget_exceed_txt")}
            checked={model.isBudgetOverruns}
            onChange={handleChangeBoolField({
              fieldName: "isBudgetOverruns",
            })}
            disabled={model?.isUsed}
          />
        </FormItem>
      </div>
    </Modal>
  );
};
