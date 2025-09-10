import { useMemo } from "react";
import classNames from "classnames";
import { Drawer, ModalConfirm } from "react-components-design-system";

import CollapseView from "components/Collapse/CollapseView";
import SupplierInformationTableDrawer from "../SupplierInformationTableDrawer/SupplierInformationTableDrawer";
import { useSupplierDetailsDrawerHook } from "./SupplierDetailsDrawerHook";
import SupplierDetailsForm from "../SupplierDetailsForm/SupplierDetailsForm";
import SupplierDetailsFormView from "../SupplierDetailsFormView/SupplierDetailsFormView";
import { SupplierTabProps } from "../../SupplierTab";

import { DeleteRoundIcon } from "assets/icons";
import styles from "./SupplierDetailsDrawer.module.scss";

const SupplierDetailsDrawer = ({
  isDetailPage,
}: Pick<SupplierTabProps, "isDetailPage">) => {
  const {
    translate,
    selectedDetailSupplierId,
    modelDetailSupplier,
    isOpenModalConfirmDelete,
    getAmountBeforeTax,
    getTaxAmount,
    getTotalAmount,
    setIsOpenModalConfirmDelete,
    handleChangeItemTable,
    handleChangeSingleField,
    handleChangeAllField,
    handleCloseSupplierDetailsDrawer,
    handleSaveSupplierDetailsDrawer,
    handleDeleteSupplierPrincipleContract,
  } = useSupplierDetailsDrawerHook();

  const hasBorder = false;

  const items = useMemo(
    () => [
      {
        key: "1",
        label: translate("PL.goods_services_info"),
        children: (
          <SupplierInformationTableDrawer
            isDetailPage={isDetailPage}
            modelDetailSupplier={modelDetailSupplier}
            handleChangeSingleField={handleChangeSingleField}
            handleChangeAllField={handleChangeAllField}
            handleChangeItemTable={handleChangeItemTable}
            getAmountBeforeTax={getAmountBeforeTax}
            getTaxAmount={getTaxAmount}
            getTotalAmount={getTotalAmount}
          />
        ),
      },
    ],
    [
      isDetailPage,
      modelDetailSupplier,
      translate,
      getAmountBeforeTax,
      getTaxAmount,
      getTotalAmount,
      handleChangeAllField,
      handleChangeItemTable,
      handleChangeSingleField,
    ]
  );

  return (
    <Drawer
      visible={!!selectedDetailSupplierId}
      loading={false}
      isHaveCloseIcon={true}
      hasOverlay={true}
      title={
        <div className="fw-bold">
          <span>{translate("PL.detail_info_supplier_principle_contract")}</span>
        </div>
      }
      size={"2xl"}
      className={styles["supplier-drawer-detail__container"]}
      titleButtonCancel={translate("PL.delete_supplier")}
      titleButtonApply={translate("CM.txt_save")}
      visibleFooter={!!isDetailPage}
      handleClose={handleCloseSupplierDetailsDrawer}
      handleCancel={() => setIsOpenModalConfirmDelete(true)}
      handleSave={handleSaveSupplierDetailsDrawer}
    >
      {isDetailPage ? (
        <SupplierDetailsForm
          modelDetailSupplier={modelDetailSupplier}
          handleChangeSingleField={handleChangeSingleField}
        />
      ) : (
        <SupplierDetailsFormView modelDetailSupplier={modelDetailSupplier} />
      )}
      <div className={styles["drawer-border-top"]}></div>
      <CollapseView
        items={items}
        defaultActiveKey={["1"]}
        className={classNames(
          hasBorder
            ? "collapse__container__overflow"
            : "collapse__container--not-border"
        )}
      />

      <ModalConfirm
        open={isOpenModalConfirmDelete}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PL.confirm_delete_principle_contract")}
        content={translate("PL.warning_delete_principle_contract")}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.btn_confirm")}
        handleSave={() => handleDeleteSupplierPrincipleContract()}
        handleCancel={() => setIsOpenModalConfirmDelete(false)}
      />
    </Drawer>
  );
};

export default SupplierDetailsDrawer;
