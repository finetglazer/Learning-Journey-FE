import { NUMBER_MAX_13 } from "config/const";
import {
  STANDARD_DATE_FORMAT_SLASH,
  VIETNAMESE_TIME_ZONE_OFFSET,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isEqual } from "lodash";
import {
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import styles from "../AcceptanceDetail.module.scss";
import { useAcceptanceInformationContext } from "../Tabs/contexts/AcceptanceInformationContext";

export const DescriptionDetails = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField, handleChangeDateField } =
    useAcceptanceInformationContext();
  const profile = useAppSelector((state) => state.profile);

  const formItems = [
    {
      label: translate("AC.txt_creator"),
      value: `${profile?.account?.email} - ${profile?.account?.name}`,
    },
    {
      label: translate("AC.txt_title"),
      value: profile?.position?.name,
    },
    {
      label: translate("AC.txt_creator_unit"),
      value: profile?.organization?.name,
    },
    {
      label: translate("AC.txt_branch_creator"),
      value: `${profile?.businessBranch?.code} - ${profile?.businessBranch?.name}`,
    },
    {
      label: translate("AC.txt_headquarters_creator"),
      value: `${profile?.businessUnit?.code} - ${profile?.businessUnit?.name}`,
    },
  ];

  return (
    <div className={styles["form-container"]}>
      <FormItem
        validateObject={utilService.getValidateObj(model, "description")}
      >
        <TextArea
          label={translate("AC.txt_acceptance_description")}
          placeHolder={translate("AC.placeholder_acceptance_description")}
          maxLength={4000}
          resize="none"
          value={model?.description}
          onChange={handleChangeSingleField({ fieldName: "description" })}
          translate={translate}
          isRequired
          showCount
        />
      </FormItem>
      <div className={styles["form-item"]}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "applyDate")}
        >
          <DatePicker
            label={translate("AC.txt_commissioning_date")}
            placeholder={STANDARD_DATE_FORMAT_SLASH.toLocaleLowerCase()}
            dateFormat={[STANDARD_DATE_FORMAT_SLASH]}
            value={
              model?.applyDate
                ? dayjs(model?.applyDate).add(
                    VIETNAMESE_TIME_ZONE_OFFSET,
                    "hour"
                  )
                : undefined
            }
            onChange={handleChangeDateField({ fieldName: "applyDate" })}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      {isEqual(VND_CURRENCY_UNIT, model?.currency) ? null : (
        <div className={styles["form-item"]}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "exchangeRate")}
          >
            <InputNumber
              label={translate("RG.txt_exchange_rate")}
              numberType="DECIMAL"
              max={NUMBER_MAX_13}
              isSmall={false}
              onChange={handleChangeSingleField({ fieldName: "exchangeRate" })}
              value={model?.exchangeRate}
              isRequired
            />
          </FormItem>
        </div>
      )}
      {formItems.map((formItem, index) => (
        <div key={index} className={styles["form-item"]}>
          <FormItem validateObject={utilService.getValidateObj(model, "")}>
            <InputText
              label={formItem.label}
              value={formItem?.value}
              isSmall={false}
              readOnly
            />
          </FormItem>
        </div>
      ))}
    </div>
  );
};
