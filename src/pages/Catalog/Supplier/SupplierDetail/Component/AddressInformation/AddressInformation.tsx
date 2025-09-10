import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./AddressInformation.module.scss";
import { useCallback, useContext } from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";

import _ from "lodash";
import { Province } from "models/Supplier/Supplier";

const NATION_CODE = "VN";

export const AddressInformation = () => {
  const [translate] = useTranslation();
  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
  } = useContext(SupplierDetailContext);

  const handleChangeProvince = useCallback(
    (id: number, T?: Model) => {
      const cloneModel = _.cloneDeep(model);
      if (!cloneModel?.provinceId || cloneModel?.provinceId !== id) {
        cloneModel.provinceId = id;
        cloneModel.province = T as Province;
        cloneModel.district = undefined;
        cloneModel.commune = undefined;
        cloneModel.districtId = undefined;
        cloneModel.communeId = undefined;
      }
      handleChangeAllField(cloneModel);
    },
    [handleChangeAllField, model]
  );

  const handleChangeDistrict = useCallback(
    (id: number, T?: Model) => {
      const cloneModel = _.cloneDeep(model);
      if (!cloneModel?.districtId || cloneModel?.districtId !== id) {
        cloneModel.districtId = id;
        cloneModel.district = T as Province;
        cloneModel.commune = undefined;
        cloneModel.communeId = undefined;
      }
      handleChangeAllField(cloneModel);
    },
    [handleChangeAllField, model]
  );

  return (
    <div className={styles["address_information"]}>
      <div className={styles["form-item"]}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "nationId")}
        >
          <Select
            label={translate("SL.txt_country")}
            placeHolder={translate("SL.placeholder_country_input")}
            isSmall={false}
            getList={supplierRepository.getDropdownNation}
            classFilter={ModelFilter}
            onChange={handleChangeSelectField({ fieldName: "nation" })}
            value={model?.nation}
            searchProperty="search"
            searchType={null}
            isEnumerable={false}
            isSearch
            isRequired
          />
        </FormItem>
      </div>
      <div className={styles["form-item"]}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "province")}
        >
          <Select
            label={translate("SL.txt_province")}
            placeHolder={translate("SL.placeholder_province_input")}
            isSmall={false}
            classFilter={ModelFilter}
            value={model?.province}
            onChange={handleChangeProvince}
            getList={supplierRepository.getDropdownProvince}
            searchProperty="search"
            searchType={null}
            isEnumerable={false}
            isSearch
            disabled={model?.nation?.code !== NATION_CODE}
          />
        </FormItem>
      </div>
      <div className={styles["form-item"]}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "district")}
        >
          <Select
            label={translate("SL.txt_district")}
            placeHolder={translate("SL.placeholder_district_input")}
            isSmall={false}
            classFilter={ModelFilter}
            valueFilter={{ ...ModelFilter, provinceId: model?.provinceId }}
            value={model?.district}
            onChange={handleChangeDistrict}
            getList={supplierRepository.getDropdownDistrict}
            searchProperty="search"
            searchType={null}
            isEnumerable={false}
            isSearch
            disabled={model?.nation?.code !== NATION_CODE || !model?.provinceId}
          />
        </FormItem>
      </div>
      <div className={styles["form-item"]}>
        <FormItem validateObject={utilService.getValidateObj(model, "commune")}>
          <Select
            label={translate("SL.txt_ward")}
            placeHolder={translate("SL.placeholder_ward_input")}
            isSmall={false}
            classFilter={ModelFilter}
            valueFilter={{ ...ModelFilter, districtId: model?.districtId }}
            value={model?.commune}
            onChange={handleChangeSelectField({ fieldName: "commune" })}
            getList={supplierRepository.getDropdownWard}
            searchProperty="search"
            searchType={null}
            isEnumerable={false}
            isSearch
            disabled={
              model?.nation?.code !== NATION_CODE ||
              !model?.provinceId ||
              !model?.districtId
            }
          />
        </FormItem>
      </div>
      <div
        className={classNames(styles["form-item"], styles["form-item--full"])}
      >
        <FormItem validateObject={utilService.getValidateObj(model, "address")}>
          <InputText
            label={translate("SL.tab_address_information")}
            placeHolder={translate("SL.placeholder_address_input")}
            isSmall={false}
            value={model?.address}
            onChange={handleChangeSingleField({ fieldName: "address" })}
          />
        </FormItem>
      </div>
    </div>
  );
};
