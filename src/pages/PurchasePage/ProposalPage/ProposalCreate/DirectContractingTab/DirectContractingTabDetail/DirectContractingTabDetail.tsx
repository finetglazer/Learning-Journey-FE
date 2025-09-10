import { ChevronDown } from "@carbon/icons-react";
import { Col } from "antd";
import {
  listAppointmentMethodEnum,
  listContractValueTypeEnum,
  NUMBER_MAX_13,
} from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import { get, isEqual, isUndefined } from "lodash";
import { SupplierModel } from "models/Payment";
import { EDirectContractingType, ProposalCreateModel } from "models/Proposal";
import { useContext, useMemo, useState } from "react";
import { ModelFilter } from "react-3layer-common";
import {
  BORDER_TYPE,
  FormItem,
  InputNumber,
  InputText,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { ProposalCreateHookContext } from "../../ProposalCreateHook";
import SupplierModal from "../Components/SupplierModal/SupplierModal";
import { EDirectContractingField } from "../DirectContractingTab";
import "./DirectContractingTabDetail.scss";
import { getNumberTypeByCurrency } from "core/helpers/currency";

const MAX_LENGTH_SHORT = 255;
const MAX_LENGTH_LONG = 500;

const DirectContractingTabDetail = () => {
  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    dispatchModel,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const [translate] = useTranslation();

  const [isModalSupplierOpen, setModalSupplierOpen] = useState<boolean>(false);

  const appointmentMethod = useMemo(
    () => get(model, EDirectContractingField.APPOINTMENT_METHOD),
    [model]
  );

  const isAppointmentMethodSelected = useMemo(
    () => !isUndefined(appointmentMethod),
    [appointmentMethod]
  );

  const isDirectContractingWithoutAssessment = useMemo(
    () =>
      isEqual(
        appointmentMethod?.id,
        EDirectContractingType.DIRECT_CONTRACTING_WITHOUT_ASSESSMENT
      ),
    [appointmentMethod]
  );

  const appointmentSupplier: SupplierModel = useMemo(
    () => get(model, EDirectContractingField.SUPPLIER),
    [model]
  );

  const handleOpenSupplierModal = () => {
    setModalSupplierOpen(true);
  };

  const handleCancelSupplierModal = () => {
    setModalSupplierOpen(false);
  };

  const handleSelectSupplier = (supplier: SupplierModel) => {
    dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        errors: { [`${EDirectContractingField.SUPPLIER}Id`]: null },
      },
    });

    handleChangeSelectField({
      fieldName: EDirectContractingField.SUPPLIER,
    })(undefined, supplier);

    handleCancelSupplierModal();
  };

  const renderTypeAndNameContracting = () => (
    <div className="row_wrapper">
      <Col span={8}>
        <Select
          label={translate("PP.appointment_method_title")}
          placeHolder={translate("PP.appointment_method_placeholder")}
          value={get(model, EDirectContractingField.APPOINTMENT_METHOD, "")}
          getList={() => of(listAppointmentMethodEnum)}
          classFilter={ModelFilter}
          render={(item) => item?.name}
          onChange={handleChangeSelectField({
            fieldName: EDirectContractingField.APPOINTMENT_METHOD,
          })}
          isSmall={false}
          isShowTooltip
        />
      </Col>

      {isAppointmentMethodSelected && (
        <Col span={16}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              EDirectContractingField.NAME
            )}
          >
            <InputText
              label={translate("PP.contractor_appointment_name_title")}
              placeHolder={translate("PP.contractor_appointment_placeholder")}
              value={get(model, EDirectContractingField.NAME)}
              onChange={handleChangeSingleField({
                fieldName: EDirectContractingField.NAME,
              })}
              isRequired
              isSmall={false}
              maxLength={MAX_LENGTH_LONG}
            />
          </FormItem>
        </Col>
      )}
    </div>
  );

  const renderExecutionTimeAndReason = () => (
    <div className="row_wrapper">
      {isDirectContractingWithoutAssessment && (
        <Col span={8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              EDirectContractingField.EXECUTION_TIME
            )}
          >
            <InputText
              label={translate("PP.execution_time_title")}
              placeHolder={translate("PP.execution_time_placeholder")}
              value={get(model, EDirectContractingField.EXECUTION_TIME)}
              onChange={handleChangeSingleField({
                fieldName: EDirectContractingField.EXECUTION_TIME,
              })}
              isRequired
              isSmall={false}
              maxLength={MAX_LENGTH_SHORT}
            />
          </FormItem>
        </Col>
      )}

      <Col span={isDirectContractingWithoutAssessment ? 16 : 24}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.APPOINTMENT_REASON
          )}
        >
          <InputText
            label={translate("PP.appointment_reason_title")}
            placeHolder={translate("PP.appointment_reason_placeholder")}
            value={get(model, EDirectContractingField.APPOINTMENT_REASON)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.APPOINTMENT_REASON,
            })}
            isRequired
            isSmall={false}
            maxLength={MAX_LENGTH_LONG}
          />
        </FormItem>
      </Col>
    </div>
  );

  const renderTaxInformation = () => (
    <div className="row_wrapper">
      <Col span={8}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            `${EDirectContractingField.SUPPLIER}Id`
          )}
        >
          <div className="select_supplier" onClick={handleOpenSupplierModal}>
            <InputText
              label={translate("PP.tax_code_title")}
              placeHolder={translate("PP.tax_code_placeholder")}
              isRequired
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              value={appointmentSupplier?.taxCode}
              autoFocusInput={false}
              suffix={<ChevronDown />}
              readOnly
            />
          </div>
        </FormItem>
      </Col>

      <Col span={16} className="flex">
        <Col span={12}>
          <InputText
            label={translate("PP.supplier_name_title")}
            value={appointmentSupplier?.name || ""}
            isSmall={false}
            readOnly
          />
        </Col>
        <Col span={12}>
          <Col span={12}>
            <InputText
              label={translate("PP.supplier_code_title")}
              value={appointmentSupplier?.code || ""}
              isSmall={false}
              readOnly
            />
          </Col>
          <Col span={12}>
            <InputText
              label={translate("PP.supplier_type_title")}
              value={String(appointmentSupplier?.type || "")}
              isSmall={false}
              readOnly
            />
          </Col>
        </Col>
      </Col>
    </div>
  );

  const renderContractValueType = () => (
    <div className="row_wrapper">
      <Col span={12}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.CONTRACT_VALUE_TYPE
          )}
        >
          <Select
            label={translate("PP.contract_value_type_title")}
            placeHolder={translate("PP.contract_value_type_placeholder")}
            value={get(model, EDirectContractingField.CONTRACT_VALUE_TYPE)}
            getList={() => of(listContractValueTypeEnum)}
            classFilter={ModelFilter}
            render={(item) => item?.name}
            onChange={handleChangeSelectField({
              fieldName: EDirectContractingField.CONTRACT_VALUE_TYPE,
            })}
            isSmall={false}
            isRequired
            isShowTooltip
          />
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.CONTRACT_VALUE
          )}
        >
          <InputNumber
            label={translate("PP.contract_value_title")}
            isRequired
            placeHolder={translate("PP.contract_value_placeholder")}
            isSmall={false}
            value={get(model, EDirectContractingField.CONTRACT_VALUE)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.CONTRACT_VALUE,
            })}
            isReverseSymb
            max={NUMBER_MAX_13}
            translate={translate}
            numberType={getNumberTypeByCurrency(model?.currency?.code)}
          />
        </FormItem>
      </Col>
    </div>
  );

  const renderTaxLiabilityAndContractType = () => (
    <div className="row_wrapper">
      <Col span={12}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.TAX_PAYER
          )}
        >
          <InputText
            label={translate("PP.tax_payer_title")}
            placeHolder={translate("PP.tax_payer_placeholder")}
            value={get(model, EDirectContractingField.TAX_PAYER)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.TAX_PAYER,
            })}
            isSmall={false}
            maxLength={MAX_LENGTH_SHORT}
          />
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.CONTRACT_TYPE
          )}
        >
          <InputText
            label={translate("PP.contract_type_title")}
            placeHolder={translate("PP.contract_type_placeholder")}
            value={get(model, EDirectContractingField.CONTRACT_TYPE)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.CONTRACT_TYPE,
            })}
            isSmall={false}
            maxLength={MAX_LENGTH_SHORT}
          />
        </FormItem>
      </Col>
    </div>
  );

  const renderPaymentGuaranteeWarranty = () => (
    <div className="row_wrapper">
      <Col span={8}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.PAYMENT_TERMS
          )}
        >
          <TextArea
            label={translate("PP.payment_condition_title")}
            placeHolder={translate("PP.payment_condition_placeholder")}
            value={get(model, EDirectContractingField.PAYMENT_TERMS)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.PAYMENT_TERMS,
            })}
            resize="none"
            maxLength={MAX_LENGTH_LONG}
            showCount
          />
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.GUARANTEE_CONTENT
          )}
        >
          <TextArea
            label={translate("PP.guarantee_content_title")}
            placeHolder={translate("PP.guarantee_content_placeholder")}
            value={get(model, EDirectContractingField.GUARANTEE_CONTENT)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.GUARANTEE_CONTENT,
            })}
            resize="none"
            maxLength={MAX_LENGTH_LONG}
            showCount
          />
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            EDirectContractingField.WARRANTY_CONTENT
          )}
        >
          <TextArea
            label={translate("PP.warranty_content_title")}
            placeHolder={translate("PP.warranty_content_placeholder")}
            value={get(model, EDirectContractingField.WARRANTY_CONTENT)}
            onChange={handleChangeSingleField({
              fieldName: EDirectContractingField.WARRANTY_CONTENT,
            })}
            resize="none"
            maxLength={MAX_LENGTH_LONG}
            showCount
          />
        </FormItem>
      </Col>
    </div>
  );

  return (
    <div className="tab_container">
      {renderTypeAndNameContracting()}

      {isAppointmentMethodSelected && (
        <>
          {renderExecutionTimeAndReason()}
          {renderTaxInformation()}
        </>
      )}

      {isDirectContractingWithoutAssessment && (
        <>
          {renderContractValueType()}
          {renderTaxLiabilityAndContractType()}
          {renderPaymentGuaranteeWarranty()}
        </>
      )}

      <SupplierModal
        isModalOpen={isModalSupplierOpen}
        handleCancelSupplierModal={handleCancelSupplierModal}
        handleApplySupplier={handleSelectSupplier}
        selectedSupplier={appointmentSupplier}
      />
    </div>
  );
};

export default DirectContractingTabDetail;
