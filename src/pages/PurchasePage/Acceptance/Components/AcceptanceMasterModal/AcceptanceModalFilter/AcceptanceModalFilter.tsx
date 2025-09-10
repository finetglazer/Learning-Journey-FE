import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { organizationRepository } from "core/repositories/OrganizationRepository";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { useContext } from "react";
import { InputText, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./AcceptanceModalFilter.module.scss";
import { AcceptanceSelectHooksContext } from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceSelect/context";
import { Model } from "ckeditor5";
import { ModelFilter } from "react-3layer-common";

const AcceptanceModalFilter = () => {
  const [translate] = useTranslation();
  const { modelFilter, dispatchFilter, handleLoadList } = useContext(
    AcceptanceSelectHooksContext
  );
  const { handleChangeMultipleSelectFilter } = filterService.useFilter(
    modelFilter,
    dispatchFilter
  );

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = trimText(search);
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: numberConstants.ONE });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className={styles["acceptance-filter"]}>
      <InputText
        value={modelFilter.search}
        prefix={
          <img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE_SMALL} />
        }
        placeHolder={translate("AC.txt_search_tester")}
        className={styles["search"]}
        onChange={run}
      />
      <MultipleSelect
        values={modelFilter?.organizationValue || []}
        placeHolder={translate("AC.txt_unit_select")}
        getList={organizationRepository.getListOrganization}
        className={styles["multiple-select"]}
        classFilter={CommonFilter}
        onChange={handleChangeMultipleSelectFilter({
          fieldName: "organization",
        })}
        valueFilter={{
          name: "",
        }}
        searchType=""
        render={(item) => `${item.code} - ${item?.name}`}
        searchProperty="name"
        isEnumerable={false}
      />
    </div>
  );
};

export default AcceptanceModalFilter;
