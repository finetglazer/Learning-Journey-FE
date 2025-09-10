import { useContext, useMemo } from "react";
import "./BuyerInformation.scss";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { ContractDetailModel, ContractStatus } from "models/Contract";
import { FormItem, InputText, Select } from "react-components-design-system";
import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { isEqual } from "lodash";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const ContractDetailBuyerInformation = () => {
  const { translate, model, handleChangeSelectField, handleChangeSingleField } =
    useContext<ContractDetailModel>(ContractDetailHookContext);

  const checkStatusIsApproved = useMemo(() => {
    const status = model?.status;
    return ContractStatus.APPROVED === status;
  }, [model?.status]);

  return (
    <div className="contract_buyer_info_wrapper">
      <CollapseCard title={translate("CT.create_contract.buyer_information")}>
        <div className="body">
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "legalEntityId"
                )}
              >
                <Select
                  label={translate(
                    "CT.create_contract.title.purchase_unit_name"
                  )}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.purchase_unit_name"
                  )}
                  isRequired
                  isSmall={false}
                  isSearch
                  isEnumerable={false}
                  render={(item) => {
                    if (!item) return "";
                    return isEqual(item?.id, model?.legalEntity?.id)
                      ? item?.name
                      : combineText(item?.code, item?.name);
                  }}
                  onChange={handleChangeSelectField({
                    fieldName: "legalEntity",
                    errorName: "legalEntityId",
                  })}
                  getList={contractRepository.getLegalEntity}
                  classFilter={DemoFilter}
                  value={model?.legalEntity}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "taxCode")}
              >
                <InputText
                  label={translate("PP.tax_code_title")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.string"
                  )}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "taxCode",
                  })}
                  value={model?.legalEntity?.taxCode}
                />
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "address")}
              >
                <InputText
                  label={translate("PR.address")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.string"
                  )}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "address",
                  })}
                  value={model?.legalEntity?.address}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "parentName")}
              >
                <InputText
                  label={translate("CT.create_contract.title.legal_person")}
                  isSmall={false}
                  readOnly
                  value={
                    (checkStatusIsApproved &&
                      model?.legalEntity?.personAgent) ||
                    "--"
                  }
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "parentName")}
              >
                <InputText
                  label={translate("CT.create_contract.title.company_position")}
                  isSmall={false}
                  readOnly
                  value={
                    (checkStatusIsApproved && model?.legalEntity?.position) ||
                    "--"
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractDetailBuyerInformation;
