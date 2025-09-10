import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import styles from "./GeneralInformation.module.scss";
import { SupplierTypeFilter } from "models/SupplierType";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";
import { yearList } from "pages/Catalog/Supplier/constant";
import CommonFilter from "models/CommonFilter";
import { SupplierViewContext } from "../../SupplierViewHook";
export const GeneralInformation = () => {
  const [translate] = useTranslation();
  const { model } = useContext(SupplierViewContext);

  return (
    <>
      <Row gutter={[18, 16]}>
        <Col span={8}>
          <FormItem validateObject={utilService.getValidateObj(model, "code")}>
            <InputText
              label={translate("SL.txt_code")}
              placeHolder={translate("SL.placeholder_code_input")}
              value={model?.code}
              isSmall={false}
              readOnly
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem validateObject={utilService.getValidateObj(model, "name")}>
            <InputText
              label={translate("SL.txt_name")}
              placeHolder={translate("SL.placeholder_name_input")}
              value={model?.name}
              isSmall={false}
              readOnly
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "shortName")}
          >
            <InputText
              label={translate("SL.txt_short_name")}
              placeHolder={translate("SL.placeholder_short_name_input")}
              value={model?.shortName}
              isSmall={false}
              readOnly
            />
          </FormItem>
        </Col>
        {/* Tax code */}
        <Col span={8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "taxCode")}
          >
            <InputText
              label={translate("SL.txt_tax_code")}
              placeHolder={translate("SL.placeholder_tax_code_input")}
              value={model?.taxCode}
              readOnly
            />
          </FormItem>
        </Col>
        {/* ERP */}

        {/* Year of establishment */}
        <Col span={8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "yearOfEstablishment"
            )}
          >
            <Select
              label={translate("SL.txt_year_of_establishment")}
              placeHolder={translate(
                "SL.placeholder_year_of_establishment_input"
              )}
              getList={yearList}
              classFilter={CommonFilter}
              value={
                model?.yearOfEstablishmentObject
                  ? model?.yearOfEstablishmentObject
                  : model?.yearOfEstablishment
                  ? {
                      id: model?.yearOfEstablishment,
                      name: model?.yearOfEstablishment?.toString(),
                    }
                  : null
              }
              readOnly
              render={(item) => item?.name}
              isEnumerable={false}
              isSmall={false}
              searchProperty="year"
              searchType={null}
              appendToBody
              isSearch={true}
            />
          </FormItem>
        </Col>
        {/* Supplier Phone */}
        {/* <Col span={8}>
          <FormItem validateObject={utilService.getValidateObj(model, "phone")}>
            <InputText
              label={translate("SL.txt_phone")}
              placeHolder={translate("SL.placeholder_phone_input")}
              value={model?.phone}
              onChange={handleChangeSingleField({ fieldName: "phone" })}
              isSmall={false}
            />
          </FormItem>
        </Col> */}

        {/* Supplier Type */}
        <Col span={8}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierTypeId")}
          >
            <Select
              label={translate("SL.txt_supplier_type")}
              placeHolder={translate("SL.placeholder_supplier_type_input")}
              value={model?.supplierType}
              readOnly
              getList={supplierRepository.getDropdownSupplierType}
              classFilter={SupplierTypeFilter}
              isSmall={false}
              isSearch
              valueFilter={{ ...new SupplierTypeFilter(), isActive: true }}
              isEnumerable={false}
              searchProperty="search"
              searchType={null}
            />
          </FormItem>
        </Col>

        <Col span={8} className={styles["status-container"]}>
          <div className={styles["item"]}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "isActive")}
            >
              <div className={"label-title m-r--xs"}>
                {translate("supplierEvaluationConfigs.status")}
              </div>
              <Switch
                checked={model.isActive}
                disabled
                className={"switch_status"}
              />
              <span className="m-l--xs">
                {translate("supplierEvaluationConfigs.active")}
              </span>
            </FormItem>
          </div>
        </Col>
      </Row>
    </>
  );
};
