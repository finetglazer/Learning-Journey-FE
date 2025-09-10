import { Col, Row } from "antd";
import { NUMBER_MAX_13 } from "config/const";
import {
  MAX_LENGTH_TEXT_AREA,
  MODAL_WIDTH_600,
  NUMBER_TYPE_INPUT,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import dayjs from "dayjs";
import { isEmpty, isEqual, isNil } from "lodash";
import { ContractGuarantee } from "models/ContractAnnex";
import { useContractAnnexDetailContext } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/context";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useEffect } from "react";
import {
  DateRangePicker,
  FormItem,
  InputNumber,
  Modal,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./GuaranteeContractModal.scss";
import { JPY_CURRENCY } from "core/helpers/number";
import {
  getMaxNumberByCurrency,
  getNumberTypeByCurrency,
} from "core/helpers/currency";

const SIZE_COL_LARGE = 24;
const SIZE_COL_SMALL = 12;
const SIZE_ROW = 12;

type GuaranteeContractModalProps = {
  open: boolean;
  handleCancel: () => void;
  recordEdit?: ContractGuarantee;
};

const GuaranteeContractModal = ({
  open,
  handleCancel,
  recordEdit,
}: GuaranteeContractModalProps) => {
  const [translate] = useTranslation();

  const {
    model: modelDetail,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContractAnnexDetailContext();

  const { model, dispatch } = detailService.useModel<ContractGuarantee>(
    ContractGuarantee,
    {
      ...new ContractGuarantee(),
    }
  );
  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
  } = fieldService.useField(model, dispatch);

  useEffect(() => {
    if (recordEdit) {
      handleChangeAllField({
        ...recordEdit,
        guaranteeDuration: [
          dayjs(recordEdit?.fromDate),
          dayjs(recordEdit?.toDate),
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordEdit]);

  const validate = () => {
    const requiredFields = ["guaranteeType", "guaranteeDuration", "amount"];
    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (
          isNil(model?.[field]) ||
          (isEqual(field, "guaranteeDuration") &&
            isEmpty(model.guaranteeDuration[numberConstants.ZERO]))
        ) {
          acc[field] = translate("CM.input_require_validation");
        }
        return acc;
      },
      {}
    );
    if (Object.keys(errors).length > numberConstants.ZERO) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    const maxLengthFields = [
      { name: "description", length: MAX_LENGTH_TEXT_AREA },
    ];

    for (const { name, length } of maxLengthFields) {
      if (model[name]?.length > length) {
        handleChangeAllField({
          ...model,
          errors: {
            ...model?.errors,
            [name]: translate("CM.input_max_length_validation", { length }),
          },
        });
        return false;
      }
    }
    return true;
  };

  const handleAddNew = () => {
    if (!validate()) {
      return;
    }

    const newModel = {
      guaranteeTypeId: Date.now(),
      ...model,
      toDate: model?.guaranteeDuration?.[numberConstants.ONE],
      fromDate: model?.guaranteeDuration?.[numberConstants.ZERO],
    };

    const updatedGuarantees = recordEdit
      ? modelDetail?.contractAppendixGuarantees?.map((guarantees) =>
          isEqual(guarantees?.guaranteeTypeId, recordEdit?.guaranteeTypeId)
            ? newModel
            : guarantees
        )
      : [
          ...(modelDetail?.contractAppendixGuarantees || []),
          { ...newModel, guaranteeTypeId: Date.now() },
        ];

    handleChangeSingleFieldMaster({
      fieldName: "contractAppendixGuarantees",
    })(updatedGuarantees);
    notifyToast({
      message: recordEdit
        ? translate("CA.update_guarantee_record_success")
        : translate("CT.add_new_guarantee_record"),
      type: "success",
    });

    handleCancel();
  };

  return (
    <Modal
      open={open}
      title={translate("CT.add_guarantee_info")}
      size={MODAL_WIDTH_600}
      closeIcon={true}
      handleSave={handleAddNew}
      handleCancel={handleCancel}
      isShowIconBack={false}
      titleButtonCancel={translate("CT.btn_cancel")}
      titleButtonApply={translate("CT.btn_add")}
    >
      <div className="guarantee_modal">
        <Row gutter={SIZE_ROW}>
          <Col span={SIZE_COL_SMALL}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "guaranteeType"
              )}
            >
              <Select
                isSmall={false}
                valueFilter={{
                  name: "",
                }}
                isSearch
                isRequired
                classFilter={undefined}
                getList={contractRepository.getGuaranteeType}
                onChange={handleChangeSelectField({
                  fieldName: "guaranteeType",
                })}
                searchType=""
                isEnumerable={false}
                placeHolder={translate("CA.select_guarantee_type")}
                value={model?.guaranteeType}
                label={translate("CA.txt_guarantee_type")}
              />
            </FormItem>
          </Col>
          <Col span={SIZE_COL_SMALL}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "guaranteeDuration"
              )}
            >
              <DateRangePicker
                value={model.guaranteeDuration || [null, null]}
                onChange={handleChangeDateField({
                  fieldName: "guaranteeDuration",
                })}
                label={translate("CA.txt_guarantee_calculation_time")}
                placeholder={[
                  translate("CA.txt_placeholder_guarantee_date"),
                  translate("CA.txt_placeholder_guarantee_date"),
                ]}
                isSmall={false}
                isRequired={true}
              />
            </FormItem>
          </Col>
        </Row>
        <Col span={SIZE_COL_LARGE}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "amount")}
          >
            <InputNumber
              isSmall={false}
              isRequired
              label={translate("CA.txt_amount_of_bail")}
              placeHolder={translate("CA.txt_placeholder_amount_of_bail")}
              onChange={handleChangeSingleField({
                fieldName: "amount",
              })}
              value={model?.amount}
              max={NUMBER_MAX_13}
              min={-NUMBER_MAX_13}
              numberType={getNumberTypeByCurrency(
                modelDetail?.contractInfo?.currency
              )}
              translate={translate}
              suffix={modelDetail?.contractInfo?.currency}
            />
          </FormItem>
        </Col>

        <Col span={SIZE_COL_LARGE}>
          <TextArea
            label={translate("CA.txt_note")}
            placeHolder={translate("CA.txt_placeholder_change_note")}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            maxLength={MAX_LENGTH_TEXT_AREA}
            translate={translate}
            showCount
            value={model?.description}
            resize="none"
          />
        </Col>
      </div>
    </Modal>
  );
};

export default GuaranteeContractModal;
