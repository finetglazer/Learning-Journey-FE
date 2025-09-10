import { Col, Row } from "antd";
import appMessageService from "core/services/common-services/app-message-service";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import dayjs from "dayjs";
import { isEmpty, isNil } from "lodash";
import { ContractDetailModel, Guarantee } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useContext, useEffect } from "react";
import {
  DateRangePicker,
  FormItem,
  InputNumber,
  Modal,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./GuaranteeModel.scss";

type Props = {
  open: boolean;
  handleCancel: () => void;
  recordEdit?: Guarantee;
};

const GuaranteeModel = ({ open, handleCancel, recordEdit }: Props) => {
  const [translate] = useTranslation();

  const {
    model: modelDetail,
    inputNumberType,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const { model, dispatch } = detailService.useModel<Guarantee>(Guarantee, {
    ...new Guarantee(),
  });
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
          (field === "guaranteeDuration" && isEmpty(model.guaranteeDuration[0]))
        ) {
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

  const handleAddNew = () => {
    if (!validate()) {
      return;
    }

    const newModel = {
      id: Date.now(),
      ...model,
      toDate: model?.guaranteeDuration?.[1],
      fromDate: model?.guaranteeDuration?.[0],
    };

    const updatedGuarantees = recordEdit
      ? modelDetail?.guarantees?.map((guarantees) =>
          guarantees?.id === recordEdit?.id ? newModel : guarantees
        )
      : [...(modelDetail?.guarantees || []), newModel];

    handleChangeSingleFieldMaster({
      fieldName: "guarantees",
    })(updatedGuarantees);
    notifyToast({
      message: translate("CT.add_new_guarantee_record"),
      type: "success",
    });
    handleCancel();
  };

  return (
    <Modal
      open={open}
      title={translate("CT.add_guarantee_info")}
      size={600}
      closeIcon={true}
      handleSave={handleAddNew}
      handleCancel={handleCancel}
      isShowIconBack={false}
      titleButtonCancel={translate("CT.btn_cancel")}
      titleButtonApply={translate("CT.btn_add")}
    >
      <div className="guarantee_modal">
        <Row gutter={12}>
          <Col span={12}>
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
                placeHolder={translate("CT.select_guarantee_type")}
                value={model?.guaranteeType}
                label={translate("CT.guarantee_type")}
              />
            </FormItem>
          </Col>
          <Col span={12}>
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
                label={translate("CT.guarantee_duration")}
                isSmall={false}
                isRequired={true}
                placeholder={["dd/mm/yyyy", "dd/mm/yyyy"]}
              />
            </FormItem>
          </Col>
        </Row>
        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "amount")}
          >
            <InputNumber
              isSmall={false}
              isRequired
              label={translate("CT.guarantee_amount")}
              placeHolder={"0"}
              onChange={handleChangeSingleField({
                fieldName: "amount",
              })}
              value={model?.amount}
              min={0}
              max={
                !modelDetail?.isPrinciple
                  ? modelDetail?.totalAmountContractGoodsServicesList || 0
                  : undefined
              }
              translate={translate}
              suffix={modelDetail?.currency}
              numberType={inputNumberType}
            />
          </FormItem>
        </Col>

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

export default GuaranteeModel;
