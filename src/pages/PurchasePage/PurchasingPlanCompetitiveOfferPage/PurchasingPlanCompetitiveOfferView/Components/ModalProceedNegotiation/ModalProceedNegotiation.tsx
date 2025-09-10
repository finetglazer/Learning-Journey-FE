/* eslint-disable import/no-unresolved */
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
// Constants & Services
import { WIDTH_1000 } from "core/config/consts";
// UI Components
import { Modal } from "react-components-design-system";
// Context & Repo
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
// Styles
import styles from "../ModalAddSupplierQuote/ModalAddSupplierQuote.module.scss";
import {
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan/PurchasingPlan";
import { isEqual } from "lodash";
import SupplierInformationTable from "../ModalAddSupplierQuote/SupplierInformationTable/SupplierInformationTable";

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressConfirm?: (
    model: PurchasingPlanTypeModel,
    idsSupplierSave?: string[]
  ) => void;
  titleModel?: string;
  titleList?: string;
  idContainer?: string;
  isNotConfirmDelete?: boolean;
  actionQuote?: SupplierQuotationAction;
};

const ModalProceedNegotiation = ({
  open,
  handleCancel,
  onPressConfirm,
  titleModel,
  titleList,
  idContainer,
  isNotConfirmDelete,
  actionQuote,
}: Props) => {
  const context = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);
  const [translate] = useTranslation();

  //actionQuote
  const isNegotiationRound = isEqual(
    actionQuote,
    SupplierQuotationAction.AddNegotiationRound
  );
  //data change

  const handleSaveModal = () =>
    onPressConfirm?.(context.model, idsSupplierSave);

  const [idsSupplierSave, setIdsSupplierSave] = useState([] as string[]);
  const handleChangeSelectSupplier = (list: string[]) => {
    setIdsSupplierSave(list);
  };

  return (
    <Modal
      open={open}
      title={translate(titleModel)}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.confirm")}
      handleCancel={handleCancel}
      handleSave={handleSaveModal}
      disableButtonApply={idsSupplierSave?.length === 0}
      key={"modal-add-supplier-quote"}
      className={styles["modal-list-suppliers"]}
    >
      <div>
        <div className={styles["title-list"]}>{translate(titleList)}</div>
      </div>

      <SupplierInformationTable
        isDetail={false}
        contextValue={context}
        isView={false}
        idContainer={idContainer}
        isNotConfirmDelete={isNotConfirmDelete}
        isNegotiationRound={isNegotiationRound}
        actionQuote={actionQuote}
        handleChangeSelectSupplier={handleChangeSelectSupplier}
      />
    </Modal>
  );
};

export default ModalProceedNegotiation;
