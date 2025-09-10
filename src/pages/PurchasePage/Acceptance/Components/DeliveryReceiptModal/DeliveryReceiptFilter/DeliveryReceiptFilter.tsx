import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { organizationRepository } from "core/repositories/OrganizationRepository";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./DeliveryReceiptFilter.module.scss";
import { businessBranchRepository } from "core/repositories/BusinessBranchRepository";

const DeliveryReceiptFilter = ({
  modelFilter,
  dispatchFilter,
  handleLoadList,
}: any) => {
  const [translate] = useTranslation();
  const { handleChangeSelectFilter } = filterService.useFilter(
    modelFilter,
    dispatchFilter
  );
  const { run } = useDebounceFn(
    (code: string) => {
      const trimmedText = trimText(code);
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          code: trimmedText,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadList({ code: trimmedText, pageIndex: numberConstants.ONE });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className={styles["acceptance-filter"]}>
      <InputText
        value={modelFilter.code}
        prefix={<img src={IcSearchSVG} alt="" width={ICON_SIZE_SMALL} />}
        placeHolder={translate("AC.txt_search_code_receipt")}
        className={styles["search"]}
        onChange={run}
      />
      <Select
        value={modelFilter?.receiptOrganizationValue}
        placeHolder={translate("CT.received_organization")}
        getList={organizationRepository.getListOrganization}
        className={styles["multiple-select"]}
        classFilter={CommonFilter}
        onChange={handleChangeSelectFilter({
          fieldName: "receiptOrganization",
        })}
        render={(item) => item && `${item?.code} - ${item?.name}`}
        searchProperty="name"
        isEnumerable={false}
        isSearch
        appendToBody
      />
      <Select
        placeHolder={translate("AC.txt_branch_box_receipt")}
        value={modelFilter?.receiptDepartmentValue}
        getList={businessBranchRepository.getListApplicableBranch}
        className={styles["multiple-select"]}
        classFilter={CommonFilter}
        onChange={handleChangeSelectFilter({
          fieldName: "receiptDepartment",
        })}
        render={(item) => item && `${item?.code} - ${item?.name}`}
        isEnumerable={false}
        isSearch
        appendToBody
      />
      <Select
        value={modelFilter?.receiptPersonValue}
        placeHolder={translate("AC.txt_receiver_and_in_charge")}
        getList={contractRepository.getListUser}
        className={styles["multiple-select"]}
        classFilter={CommonFilter}
        onChange={handleChangeSelectFilter({
          fieldName: "receiptPerson",
        })}
        render={(item) => item && `${item?.code} - ${item?.name}`}
        searchProperty="name"
        isEnumerable={false}
        isSearch
        appendToBody
      />
    </div>
  );
};

export default DeliveryReceiptFilter;
