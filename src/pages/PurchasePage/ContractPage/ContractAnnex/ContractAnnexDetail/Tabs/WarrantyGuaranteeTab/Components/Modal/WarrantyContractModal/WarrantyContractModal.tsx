import { Col, Row } from "antd";
import { listWarrantyCalculationTime, NUMBER_MAX_13 } from "config/const";
import {
  MAX_LENGTH_TEXT_AREA,
  MODAL_WIDTH_600,
  numberConstants,
} from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEqual, isNil } from "lodash";
import { ContractWarranty } from "models/ContractAnnex";
import { useContractAnnexDetailContext } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/context";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import {
  FormItem,
  InputNumber,
  Modal,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import "./WarrantyContractModal.scss";

const SIZE_COL_LARGE = 24;
const SIZE_COL_SMALL = 12;
const SIZE_ROW = 12;

type WarrantyContractModalProps = {
  open: boolean;
  handleCancel: () => void;
  recordEdit?: ContractWarranty;
};

const WarrantyContractModal = ({
  open,
  handleCancel,
  recordEdit,
}: WarrantyContractModalProps) => {
  const [translate] = useTranslation();

  const {
    model: modelDetail,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContractAnnexDetailContext();

  const { model, dispatch } = detailService.useModel<ContractWarranty>(
    ContractWarranty,
    {
      ...new ContractWarranty(),
      ...recordEdit,
    }
  );
  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeSingleField,
  } = fieldService.useField(model, dispatch);

  const validate = () => {
    const requiredFields = [
      "warrantyType",
      "warrantyPeriod",
      "warrantyTerm",
      "warrantyCalculationTime",
    ];
    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (isNil(model?.[field])) {
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

  const handleAddWarranty = () => {
    if (!validate()) {
      return;
    }

    const updatedWarranties = recordEdit
      ? modelDetail?.contractAppendixWarranties?.map((warranty) =>
          isEqual(warranty?.warrantyTypeId, recordEdit?.warrantyTypeId)
            ? model
            : warranty
        )
      : [
          ...(modelDetail?.contractAppendixWarranties || []),
          {
            ...model,
            warrantyTypeId: Date.now(),
          },
        ];

    handleChangeSingleFieldMaster({
      fieldName: "contractAppendixWarranties",
    })(updatedWarranties);

    notifyToast({
      message: recordEdit
        ? translate("CA.update_warranty_record_success")
        : translate("CT.add_new_warranty_record"),
      type: "success",
    });

    handleCancel();
  };

  return (
    <Modal
      open={open}
      title={translate("CT.add_warranty_info")}
      size={MODAL_WIDTH_600}
      closeIcon={true}
      handleSave={handleAddWarranty}
      handleCancel={handleCancel}
      isShowIconBack={false}
      titleButtonCancel={translate("CT.btn_cancel")}
      titleButtonApply={translate("CT.btn_add")}
    >
      <div className="warranty_modal">
        <Row gutter={SIZE_ROW}>
          <Col span={SIZE_COL_SMALL}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "warrantyType")}
            >
              <Select
                isSmall={false}
                valueFilter={{
                  name: "",
                }}
                isSearch
                isRequired
                classFilter={undefined}
                getList={contractRepository.getWarrantyType}
                onChange={handleChangeSelectField({
                  fieldName: "warrantyType",
                })}
                searchType=""
                isEnumerable={false}
                placeHolder={translate("CA.select_warranty_type")}
                value={model?.warrantyType}
                label={translate("CA.txt_type_warranty")}
              />
            </FormItem>
          </Col>
          <Col span={SIZE_COL_SMALL}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "warrantyPeriod"
              )}
            >
              <InputNumber
                isSmall={false}
                isRequired
                label={translate("CA.txt_warranty_time")}
                placeHolder={translate("CA.enter_months_warranty")}
                onChange={handleChangeSingleField({
                  fieldName: "warrantyPeriod",
                })}
                value={model?.warrantyPeriod}
                min={numberConstants.ZERO}
                max={NUMBER_MAX_13}
                translate={translate}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={SIZE_ROW}>
          <Col span={SIZE_COL_SMALL}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "warrantyTerm")}
            >
              <Select
                isSmall={false}
                valueFilter={{
                  name: "",
                }}
                isSearch
                isRequired
                classFilter={undefined}
                getList={contractRepository.getWarrantyTerm}
                onChange={handleChangeSelectField({
                  fieldName: "warrantyTerm",
                })}
                searchType=""
                isEnumerable={false}
                placeHolder={translate("CA.select_warranty_method")}
                value={model?.warrantyTerm}
                label={translate("CA.txt_warranty_form")}
              />
            </FormItem>
          </Col>
          <Col span={SIZE_COL_SMALL}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "warrantyCalculationTime"
              )}
            >
              <Select
                isRequired
                label={translate("CA.txt_warranty_period")}
                placeHolder={translate("CA.select_warranty_calculation_time")}
                valueFilter={{
                  name: "",
                }}
                isSmall={false}
                classFilter={undefined}
                isSearch={false}
                getList={() => of(listWarrantyCalculationTime)}
                onChange={handleChangeSelectField({
                  fieldName: "warrantyCalculationTime",
                })}
                value={model.warrantyCalculationTime}
              />
            </FormItem>
          </Col>
        </Row>

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

export default WarrantyContractModal;
