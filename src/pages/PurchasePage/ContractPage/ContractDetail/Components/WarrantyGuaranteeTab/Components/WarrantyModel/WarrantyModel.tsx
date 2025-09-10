import { Col, Row } from "antd";
import { listWarrantyCalculationTime } from "config/const";
import appMessageService from "core/services/common-services/app-message-service";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isNil } from "lodash";
import { ContractDetailModel, Warranty } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useContext, useEffect } from "react";
import {
  FormItem,
  InputNumber,
  Modal,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import "./WarrantyModel.scss";

type Props = {
  open: boolean;
  handleCancel: () => void;
  recordEdit?: Warranty;
};

const WarrantyModel = ({ open, handleCancel, recordEdit }: Props) => {
  const [translate] = useTranslation();

  const {
    model: modelDetail,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const { model, dispatch } = detailService.useModel<Warranty>(Warranty, {
    ...new Warranty(),
  });
  const { notifyToast } = appMessageService.useCRUDMessage();

  const {
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeSingleField,
  } = fieldService.useField(model, dispatch);

  useEffect(() => {
    if (recordEdit) {
      handleChangeAllField(recordEdit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordEdit]);

  const validate = () => {
    const requiredFields = [
      "warrantyType",
      "warrantyPeriod",
      "warrantyTerms",
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
    if (Object.keys(errors).length > 0) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    const maxLengthFields = [{ name: "description", length: 500 }];

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
      ? modelDetail?.warranties?.map((warranty) =>
          warranty?.id === recordEdit?.id ? model : warranty
        )
      : [
          ...(modelDetail?.warranties || []),
          {
            ...model,
            id: Date.now(),
          },
        ];

    handleChangeSingleFieldMaster({
      fieldName: "warranties",
    })(updatedWarranties);
    notifyToast({
      message: translate("CT.add_new_warranty_record"),
      type: "success",
    });
    handleCancel();
  };

  return (
    <Modal
      open={open}
      title={translate("CT.add_warranty_info")}
      size={600}
      closeIcon={true}
      handleSave={handleAddWarranty}
      handleCancel={handleCancel}
      isShowIconBack={false}
      titleButtonCancel={translate("CT.btn_cancel")}
      titleButtonApply={translate("CT.btn_add")}
    >
      <div className="warranty_modal">
        <Row gutter={12}>
          <Col span={12}>
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
                placeHolder={translate("CT.select_warranty_type")}
                value={model?.warrantyType}
                label={translate("CT.warranty_type")}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "warrantyPeriod"
              )}
            >
              <InputNumber
                isSmall={false}
                isRequired
                label={translate("CT.warranty_duration")}
                placeHolder={translate("CT.enter_months")}
                onChange={handleChangeSingleField({
                  fieldName: "warrantyPeriod",
                })}
                value={model?.warrantyPeriod}
                min={0}
                translate={translate}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "warrantyTerms"
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
                getList={contractRepository.getWarrantyTerm}
                onChange={handleChangeSelectField({
                  fieldName: "warrantyTerms",
                })}
                searchType=""
                isEnumerable={false}
                placeHolder={translate("CT.select_warranty_method")}
                value={model?.warrantyTerms}
                label={translate("CT.warranty_method")}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "warrantyCalculationTime"
              )}
            >
              <Select
                isRequired
                label={translate("CT.warranty_calculation_time")}
                placeHolder={translate("CT.warranty_calculation_time")}
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

        <Col span={24}>
          <TextArea
            label={translate("CT.note")}
            placeHolder={translate("CT.input_note")}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            maxLength={500}
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

export default WarrantyModel;
