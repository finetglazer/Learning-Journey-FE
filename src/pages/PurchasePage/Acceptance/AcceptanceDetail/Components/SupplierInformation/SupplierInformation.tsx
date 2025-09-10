import classNames from "classnames";
import { ItemTableView } from "components/ItemTableView/ItemTableView";
import { utilService } from "core/services/common-services/util-service";
import { uniqueId } from "lodash";
import {
  FormItem,
  InputText,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import tableStyles from "../../../Components/Acceptance.module.scss";
import styles from "../AcceptanceDetail.module.scss";
import { useAcceptanceInformationContext } from "../Tabs/contexts/AcceptanceInformationContext";
import { MAX_LENGTH_255 } from "core/config/consts";
export const SupplierInformation = () => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } = useAcceptanceInformationContext();

  const columnsTop = [
    {
      title: translate("AC.txt_supplier"),
      content: model?.supplierName,
    },
    {
      title: translate("AC.txt_tax_id"),
      content: model?.supplierTaxCode,
    },
    {
      title: translate("AC.txt_address"),
      content: <OneLineText value={model?.supplierAddress} />,
    },
  ];
  return (
    <>
      <table className={tableStyles["table"]}>
        <tbody>
          <tr className={tableStyles["bg-grey"]}>
            {columnsTop.map((props) => (
              <ItemTableView key={uniqueId()} {...props} />
            ))}
          </tr>
        </tbody>
      </table>
      <div className={classNames(styles["form-container"], "pt-3")}>
        <div className={styles["form-item"]}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "supplierAgent")}
          >
            <InputText
              label={translate("AC.txt_representative")}
              placeHolder={translate("AC.placeholder_representative")}
              value={model?.supplierAgent}
              translate={translate}
              maxLength={MAX_LENGTH_255}
              onChange={handleChangeSingleField({ fieldName: "supplierAgent" })}
              isSmall={false}
              isRequired
            />
          </FormItem>
        </div>
        <div className={styles["form-item"]}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "supplierPosition"
            )}
          >
            <InputText
              label={translate("AC.txt_position")}
              placeHolder={translate("AC.placeholder_position")}
              value={model?.supplierPosition}
              onChange={handleChangeSingleField({
                fieldName: "supplierPosition",
              })}
              translate={translate}
              maxLength={MAX_LENGTH_255}
              isSmall={false}
              isRequired
            />
          </FormItem>
        </div>
      </div>
    </>
  );
};
