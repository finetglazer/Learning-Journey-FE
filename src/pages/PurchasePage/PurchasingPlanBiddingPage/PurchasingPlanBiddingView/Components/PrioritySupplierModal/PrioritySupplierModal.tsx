/* eslint-disable import/no-unresolved */
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
// Constants & Services
import { WIDTH_1000 } from "core/config/consts";
// UI Components
import { Modal } from "react-components-design-system";
// Context & Repo
// Styles
import styles from "../ModalAddSupplierQuote/ModalAddSupplierQuote/ModalAddSupplierQuote.module.scss";
import {
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan/PurchasingPlan";
import { isEqual, size } from "lodash";
import PrioritySupplierTable from "./Components/PrioritySupplierModal/PrioritySupplierTable";
import classNames from "classnames";
import { PurchasingPlanBiddingDetailHookContext } from "../../../PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { usePrioritySupplierTableHook } from "./Components/PrioritySupplierModal/usePrioritySupplierTableHook";

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressConfirm?: (model: PurchasingPlanTypeModel) => void;
  titleModel?: string;
  titleList?: string;
  idContainer?: string;
  isNotConfirmDelete?: boolean;
  actionQuote?: SupplierQuotationAction;
};

const PrioritySupplierModal = ({
  open,
  handleCancel,
  onPressConfirm,
  titleModel,
  titleList,
  idContainer,
  isNotConfirmDelete,
  actionQuote,
}: Props) => {
  const context = useContext(PurchasingPlanBiddingDetailHookContext);
  const [translate] = useTranslation();

  //actionQuote
  const isNegotiationRound = isEqual(
    actionQuote,
    SupplierQuotationAction.AddNegotiationRound
  );
  //data change

  const handleSaveModal = () => onPressConfirm?.(context.model);
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
      key={"modal-add-supplier-quote"}
      className={styles["modal-list-suppliers"]}
      disableButtonApply={
        size(context?.model?.masterPrioritySupplierSelectedKey) === 0
      }
      loading={context?.loading}
    >
      <div className={classNames(styles["title-list"], "mt-0")}>
        {translate(titleList)}
      </div>

      <PrioritySupplierTable
        isDetail={false}
        contextValue={context}
        isView={false}
        idContainer={idContainer}
        isNotConfirmDelete={isNotConfirmDelete}
        isNegotiationRound={isNegotiationRound}
        actionQuote={actionQuote}
      />
    </Modal>
  );
};

export default PrioritySupplierModal;
