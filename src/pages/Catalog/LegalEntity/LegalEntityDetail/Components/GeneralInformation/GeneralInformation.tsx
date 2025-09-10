/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-unresolved */
import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import {
  Checkbox,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import legalEntityRepository from "../../../LegalEntityRepository";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../../LegalEntityDetailHooks";
import "./GeneralInformation.scss";

const GeneralInformation = () => {
  const {
    model,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    disableDefault,
  } = useContext<LegalEntityDetail>(LegalEntityDetailContext);

  const [translate] = useTranslation();
  return (
    <div className="legal-entity_wrapper">
      <Row gutter={16}>
        <Col span={12}>
          <FormItem validateObject={utilService.getValidateObj(model, "code")}>
            <InputText
              isRequired
              maxLength={255}
              label={translate("LE.txt_legal_entity_code")}
              placeHolder={translate("LE.plh_legal_entity_input_code")}
              value={model.code}
              onChange={handleChangeSingleField({
                fieldName: "code",
              })}
              isSmall={false}
            />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "representativeId"
            )}
          >
            <Select
              isRequired
              value={model?.representative}
              label={translate("LE.txt_legal_entity_representative")}
              placeHolder={translate(
                "LE.plh_legal_entity_input_representative"
              )}
              getList={legalEntityRepository.listMasterUser}
              isSmall={false}
              onChange={(value, option) => {
                handleChangeAllField({
                  ...model,
                  representativePosition: option?.position?.name,
                });
                handleChangeSelectField({
                  fieldName: "representative",
                  errorName: "representativeId",
                })(value, option);
              }}
              classFilter={undefined}
              valueFilter={{
                fullName: "",
              }}
              render={(item) =>
                item?.id
                  ? `${item?.code} - ${item?.email} - ${
                      item?.fullName || item?.name
                    }`
                  : null
              }
              isSearch
              searchType=""
              isEnumerable={false}
            />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={16} className="item_row">
        <Col span={12}>
          <Row gutter={8}>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  isRequired
                  maxLength={255}
                  label={translate("LE.txt_legal_entity_name")}
                  placeHolder={translate("LE.plh_legal_entity_input_name")}
                  value={model.name}
                  onChange={handleChangeSingleField({
                    fieldName: "name",
                  })}
                  isSmall={false}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "taxCode")}
              >
                <InputText
                  isRequired
                  maxLength={255}
                  label={translate("LE.txt_legal_entity_tax_code")}
                  placeHolder={translate("LE.plh_legal_entity_input_tax_code")}
                  value={model.taxCode}
                  onChange={handleChangeSingleField({
                    fieldName: "taxCode",
                  })}
                  isSmall={false}
                />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "representativePosition"
            )}
          >
            <InputText
              isRequired
              maxLength={255}
              label={translate("LE.txt_legal_entity_representative_position")}
              placeHolder={translate(
                "LE.plh_legal_entity_input_representativePosition"
              )}
              value={model.representativePosition}
              onChange={handleChangeSingleField({
                fieldName: "representativePosition",
              })}
              isSmall={false}
            />
          </FormItem>
        </Col>
      </Row>

      <Row gutter={16} className="item_row">
        <Col span={24}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "address")}
              >
                <InputText
                  isRequired
                  maxLength={500}
                  label={translate("LE.txt_legal_entity_address")}
                  placeHolder={translate("LE.plh_legal_entity_input_address")}
                  value={model.address}
                  onChange={handleChangeSingleField({
                    fieldName: "address",
                  })}
                  isSmall={false}
                />
              </FormItem>
            </Col>
            <Col span={12} className="m-t--md">
              <div className="item_checkbox d-flex">
                <Checkbox
                  checked={model.isDefaultLegalEntity}
                  onChange={(value: boolean) => {
                    handleChangeSingleField({
                      fieldName: "isDefaultLegalEntity",
                    })(value);
                  }}
                  disabled={disableDefault}
                />
                <span className="m-l--xs">
                  {translate("LE.txt_default_legal_entity")}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralInformation;
