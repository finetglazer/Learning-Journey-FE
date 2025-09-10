import {
  FormItem,
  InputText,
  Modal,
  Radio,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import React, { useContext } from "react";
import { Col, Row, Space, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";
import { Bank } from "models/Bank";
import { MAX_LENGTH_255 } from "core/config/consts";

export const SupplierPaymentModal = () => {
  const {
    visiblePaymentModal,
    targetPayment,
    handleCancelPaymentModal,
    handleSavePaymentModal,
    handleChangeSimpleFieldPayment,
    setTargetPayment,
  } = useContext(SupplierDetailContext);

  const [translate] = useTranslation();
  return (
    <Modal
      open={visiblePaymentModal}
      title={
        !targetPayment?.id
          ? `${translate("SL.paymentModal.create")}`
          : `${translate("SL.paymentModal.detail")}`
      }
      size={800}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCancelPaymentModal}
      onCancel={handleCancelPaymentModal}
      handleSave={() => handleSavePaymentModal(targetPayment)}
      isShowIconBack={true}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        <Col lg={24} className="d-flex m-b--sm">
          <div className={"label-title m-r--xs"}>
            {translate("supplierEvaluationConfigs.status")}
          </div>
          <Switch
            checked={targetPayment.isActive}
            onChange={(checked) => {
              handleChangeSimpleFieldPayment("isActive")(checked);
            }}
            className={"switch_status"}
          />
          <span className="m-l--xs">
            {translate("supplierEvaluationConfigs.active")}
          </span>
        </Col>

        <Col lg={24} className="m-b--sm">
          <Radio.Group
            onChecked={(value) => {
              handleChangeSimpleFieldPayment("isIsDomestic")(value);
            }}
            value={targetPayment?.isIsDomestic}
          >
            <Space direction="horizontal">
              <Radio value={true}>
                {translate("SL.paymentModal.isIsDomestic")}
              </Radio>
              <Radio value={false}>
                {translate("SL.paymentModal.isnotIsDomestic")}
              </Radio>
            </Space>
          </Radio.Group>
        </Col>

        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetPayment,
              targetPayment?.isIsDomestic ? "bank" : "bankForeignName"
            )}
          >
            {targetPayment?.isIsDomestic ? (
              <Select
                label={translate("SL.paymentModal.bank")}
                placeHolder={translate("SL.paymentModal.placeholderName")}
                isRequired
                getList={supplierRepository.getDropdownBank}
                value={targetPayment?.bank}
                classFilter={Bank}
                onChange={(id: number, T?: Bank) => {
                  setTargetPayment({
                    ...targetPayment,
                    bankId: id,
                    bank: T,
                    errors: {
                      ...targetPayment?.errors,
                      bank: null,
                      bankForeignName: null,
                    },
                  });
                }}
                isSearch
                searchProperty="search"
                searchType={null}
                isEnumerable={false}
              />
            ) : (
              <InputText
                isRequired
                maxLength={500}
                label={translate("SL.paymentModal.bank")}
                placeHolder={translate("SL.paymentModal.bankPlaceholder")}
                value={targetPayment?.bankForeignName}
                onChange={handleChangeSimpleFieldPayment("bankForeignName")}
              />
            )}
          </FormItem>
        </Col>

        {/* <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetPayment,
              "branchName"
            )}
          >
            <InputText
              maxLength={500}
              isRequired
              label={translate("SL.paymentModal.branchName")}
              placeHolder={translate("SL.paymentModal.placeholderBranchName")}
              value={targetPayment?.branchName}
              onChange={handleChangeSimpleFieldPayment("branchName")}
            />
          </FormItem>
        </Col> */}

        {/* <Col lg={12} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetPayment,
              "shortName"
            )}
          >
            <InputText
              maxLength={500}
              label={translate("SL.paymentModal.shortName")}
              placeHolder={translate("SL.paymentModal.placeholderShortName")}
              value={
                targetPayment?.isIsDomestic
                  ? targetPayment?.bank?.name
                  : targetPayment?.shortName
              }
              onChange={handleChangeSimpleFieldPayment("shortName")}
              disabled={targetPayment?.isIsDomestic}
            />
          </FormItem>
        </Col> */}
        <Col lg={12} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetPayment,
              "bankAccountNo"
            )}
          >
            <InputText
              maxLength={15}
              isRequired
              label={translate("SL.paymentModal.bankAccountNo")}
              placeHolder={translate(
                "SL.paymentModal.placeholderBankAccountNo"
              )}
              value={targetPayment?.bankAccountNo}
              onChange={handleChangeSimpleFieldPayment("bankAccountNo")}
            />
          </FormItem>
        </Col>
        <Col lg={targetPayment?.isIsDomestic ? 12 : 24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetPayment,
              "bankAccountName"
            )}
          >
            <InputText
              maxLength={MAX_LENGTH_255}
              isRequired
              label={translate("SL.paymentModal.bankAccountName")}
              placeHolder={translate(
                "SL.paymentModal.placeholderBankAccountName"
              )}
              value={targetPayment?.bankAccountName}
              onChange={handleChangeSimpleFieldPayment("bankAccountName")}
            />
          </FormItem>
        </Col>
        {/* <Col lg={12} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetPayment,
              "beneficiaryUnit"
            )}
          >
            <InputText
              maxLength={500}
              isRequired
              label={translate("SL.paymentModal.beneficiaryUnit")}
              placeHolder={translate(
                "SL.paymentModal.placeholderBeneficiaryUnit"
              )}
              value={targetPayment?.beneficiaryUnit}
              onChange={handleChangeSimpleFieldPayment("beneficiaryUnit")}
            />
          </FormItem>
        </Col> */}
        {!targetPayment?.isIsDomestic ? (
          <Col lg={12} className="m-b--sm">
            <FormItem
              validateObject={utilService.getValidateObj(
                targetPayment,
                "swiftCode"
              )}
            >
              <InputText
                maxLength={500}
                isRequired
                label={translate("SL.paymentModal.swiftCode")}
                placeHolder={translate("SL.paymentModal.placeholderSwiftCode")}
                value={targetPayment?.swiftCode}
                onChange={handleChangeSimpleFieldPayment("swiftCode")}
              />
            </FormItem>
          </Col>
        ) : null}
      </Row>
    </Modal>
  );
};
