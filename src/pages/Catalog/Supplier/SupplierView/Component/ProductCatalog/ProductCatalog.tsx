import { utilService } from "core/services/common-services/util-service";
import { useContext, useState } from "react";
import { FormItem, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { SupplierViewContext } from "../../SupplierViewHook";
import styles from "./ProductCatalog.module.scss";

export default function ProductCatalog() {
  const [translate] = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { model } = useContext(SupplierViewContext);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <div onClick={handleShowModal}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "goodsServicesCategoryIds"
          )}
        >
          <MultipleSelect
            label={translate("SL.txt_product_catalog")}
            placeHolder={translate("SL.txt_select_catalog")}
            values={model?.goodsServicesCategorys || []}
            // onChange={handleSelectGoodServices}
            className={styles["form-input"]}
            isSmall={false}
            classFilter={undefined}
            disabled
          />
        </FormItem>
      </div>
    </>
  );
}
