import { utilService } from "core/services/common-services/util-service";
import { FormItem, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "pages/PurchasePage/ProjectSettlement/Components/SettlementInformationComponents.module.scss";
import { MAX_LENGTH_500 } from "core/config/consts";
import { useProjectSettlementDetailContext } from "../../../context";
import { Tooltip } from "antd";

function GeneralInformation() {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } =
    useProjectSettlementDetailContext();
  const createUserInfo = model?.createUserInfo;

  const formItems = [
    {
      label: translate("PS.txt_table_person_create"),
      value: createUserInfo?.createUser,
      tooltip: `${createUserInfo?.createUser} - ${createUserInfo?.createFullname}`,
    },
    {
      label: translate("PS.txt_unit_create"),
      value: createUserInfo?.createOrganization,
    },
    {
      label: translate("AC.txt_title"),
      value: createUserInfo?.createPosition,
    },
  ];

  return (
    <div className={styles["form-container"]}>
      <FormItem
        validateObject={utilService.getValidateObj(
          model,
          "settlementDescription"
        )}
      >
        <InputText
          label={translate("PS.txt_description_settlement")}
          placeHolder={translate("settlement.enter_settlement_description")}
          value={model?.settlementDescription}
          maxLength={MAX_LENGTH_500}
          onChange={handleChangeSingleField({
            fieldName: "settlementDescription",
          })}
          isSmall={false}
          isRequired
        />
      </FormItem>
      {formItems.map((formItem, index) => (
        <div key={index} className={styles["form-item"]}>
          <InputText
            label={formItem.label}
            prefix={
              <Tooltip title={formItem?.tooltip || formItem?.value}>
                {formItem?.value}
              </Tooltip>
            }
            isSmall={false}
            readOnly
          />
        </div>
      ))}
    </div>
  );
}

export default GeneralInformation;
