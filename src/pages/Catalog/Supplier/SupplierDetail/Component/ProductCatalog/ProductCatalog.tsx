import { utilService } from "core/services/common-services/util-service";
import { useContext, useState } from "react";
import { FormItem, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ProductCatalog.module.scss";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";
import GoodServicesSelectModal from "./Components/GoodServicesSelectModal";

export default function ProductCatalog() {
  const [translate] = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { model, handleChangeAllField } = useContext(SupplierDetailContext);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleSelectGoodServices = (selected: GoodsServicesCategory[]) => {
    setShowModal(false);
    const goodsServicesCategoryIds = selected?.map((item) => item?.id);
    handleChangeAllField({
      ...model,
      goodsServicesCategoryIds: goodsServicesCategoryIds,
      goodsServicesCategorys: selected,
    });
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
            onChange={handleSelectGoodServices}
            className={styles["form-input"]}
            isSmall={false}
            classFilter={undefined}
          />
        </FormItem>
      </div>
      {showModal && (
        <GoodServicesSelectModal
          onClose={handleShowModal}
          onSelect={handleSelectGoodServices}
          selected={model?.goodsServicesCategoryIds}
        />
      )}
    </>
  );
}
