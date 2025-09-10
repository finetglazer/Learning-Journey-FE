import { ContractDetailModel, ReceivedType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext, useEffect } from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row } from "antd";
import { listReceivedType } from "config/const";
import { PHONE_NUMBER_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import CommonFilter from "models/CommonFilter";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { of } from "rxjs";

const ReceiveTypeSelect = () => {
  const [translate] = useTranslation();

  const { model, handleChangeSingleField, handleChangeSelectField } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  useEffect(() => {
    if (model?.receivedTypeOption) {
      handleChangeSingleField({
        fieldName: "receivedType",
      })(model?.receivedTypeOption?.code);
    }
  }, [handleChangeSingleField, model?.receivedTypeOption]);

  return (
    <Row gutter={16} className="receiving_row_select">
      <Col span={6}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "receivedType")}
        >
          <Select
            label={translate("CT.create_contract.title.receiving_type")}
            placeHolder={translate("CT.create_contract.placeholder.string")}
            isSmall={false}
            isRequired
            onChange={handleChangeSelectField({
              fieldName: "receivedTypeOption",
            })}
            getList={() => of(listReceivedType)}
            value={model?.receivedTypeOption}
            classFilter={CommonFilter}
            appendToBody
          />
        </FormItem>
      </Col>
      {model?.receivedType === ReceivedType.SingleReceiver ? (
        <>
          <Col span={6}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "receiverInfos.organizationId"
              )}
            >
              <Select
                label={translate("PR.receiving_unit")}
                placeHolder={translate("CT.placeholder_received_organization")}
                isSmall={false}
                isRequired
                onChange={(value, record) => {
                  handleChangeSelectField({
                    fieldName: "receivedOrganization",
                    errorName: "receiverInfos.organizationId",
                  })(value, record);
                  handleChangeSingleField({ fieldName: "receivedPerson" })(
                    null
                  );
                }}
                getList={contractRepository.getListOrganization}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isSearch
                isEnumerable={false}
                value={model?.receivedOrganization}
                classFilter={CommonFilter}
                appendToBody
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "receiverInfos.person"
              )}
            >
              <Select
                label={translate("PR.receiver")}
                placeHolder={translate(
                  "CT.create_contract.placeholder.receiving_person"
                )}
                isSmall={false}
                isRequired
                isSearch
                valueFilter={{
                  name: "",
                  isActive: true,
                  organizationId: model?.receivedOrganization?.id,
                }}
                searchType=""
                searchProperty="name"
                render={(item) =>
                  item ? `${item.email} - ${item.fullName || item.name}` : ""
                }
                isEnumerable={false}
                getList={contractRepository.getListUser}
                value={model?.receivedPerson}
                classFilter={CommonFilter}
                onChange={handleChangeSelectField({
                  fieldName: "receivedPerson",
                  errorName: "receiverInfos.person",
                })}
                disabled={!model?.receivedOrganization}
                appendToBody
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "receiverInfos.phone"
              )}
            >
              <InputText
                label={translate("PR.telephone_number")}
                placeHolder={translate("PR.plh_telephone_number")}
                isRequired
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: "receivedPhone",
                  errorName: "receiverInfos.phone",
                })}
                regexInput={PHONE_NUMBER_REGEX}
                translate={translate}
                maxLength={20}
                value={model?.receivedPhone}
              />
            </FormItem>
          </Col>
        </>
      ) : (
        ""
      )}
    </Row>
  );
};

export default ReceiveTypeSelect;
