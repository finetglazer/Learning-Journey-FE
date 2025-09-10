import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";
import { useContext } from "react";
import { ModelFilter } from "react-3layer-common";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./AddressInformation.module.scss";

import { SupplierViewContext } from "../../SupplierViewHook";

const NATION_CODE = "VN";

export const AddressInformation = () => {
  const [translate] = useTranslation();
  const { model } = useContext(SupplierViewContext);

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
            readOnly
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
            readOnly
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
            readOnly
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
            readOnly
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
            readOnly
          />
        </FormItem>
      </div>
    </div>
  );
};
