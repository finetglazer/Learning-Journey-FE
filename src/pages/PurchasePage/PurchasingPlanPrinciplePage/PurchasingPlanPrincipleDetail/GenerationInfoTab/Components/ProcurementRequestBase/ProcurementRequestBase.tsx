import React, { useContext, useState } from "react";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyIcon, warningIcon } from "assets/icons";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { ModalSelectPurchaseRequest } from "../ModalSelectPurchaseRequest/ModalSelectPurchaseRequest";
import PurchaseInformationData from "../PurchaseInfoData/PurchaseInformationData";
import { isEmpty, isNil } from "lodash";
import { Button, ModalConfirm } from "react-components-design-system";
import { PurchaseProposalModel } from "models/PurchasingPlan/PurchasingPlan";

const ProcurementRequestBase = ({ isView = false }: { isView?: boolean }) => {
  const { translate, model, handleChangeAllField } = useContext(
    PurchasingPlanPrincipleDetailHookContext
  );
  const [isOpenModalSelectPurse, setIsOpenModalSelectPurse] = useState(false);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [valuePurchaseProposal, setValuePurchaseProposal] =
    useState<PurchaseProposalModel>();

  const handleConfirm = (value: PurchaseProposalModel) => {
    if (isNil(value)) {
      setIsOpenModalSelectPurse(false);
      return;
    }
    if (isEmpty(model?.purchaseProposalId)) {
      handleChangeAllField({
        ...model,
        purchaseProposalId: value,
        listSupplier: value?.supplierPurchasePlans,
        isSelectPurchaseProposalId: true,
      });
      return;
    } else {
      handleChangeAllField({
        ...model,
        listSupplier: value?.supplierPurchasePlans,
        isSelectPurchaseProposalId: true,
      });
      setIsOpenModalConfirm(true);
      setValuePurchaseProposal(value);
    }
  };

  const handleSaveData = (value: PurchaseProposalModel) => {
    handleChangeAllField({
      ...model,
      purchaseProposalId: value,
      purchaseItems: [],
    });
    setIsOpenModalConfirm(false);
  };

  return (
    <div>
      {isEmpty(model?.purchaseProposalId) && !isView ? (
        <div>
          <EmptyInitializeTable
            isSolid={false}
            textButton={translate(
              "PL.purchasing_plan_select_procurement_request"
            )}
            content={
              <div>{translate("PL.purchasing_plan_select_from_system")}</div>
            }
            icon={<img src={emptyIcon} alt="" />}
            onHandleClickAdd={() => {
              setIsOpenModalSelectPurse(true);
            }}
          />
        </div>
      ) : (
        <div>
          {!isView && (
            <Button
              icon={<img src={AddIcon} alt="img" width={14} height={14} />}
              iconPlace="left"
              type="secondary"
              className="m-b--sm"
              onClick={() => setIsOpenModalSelectPurse(true)}
            >
              {translate("PL.purchasing_plan_select_procurement_request")}
            </Button>
          )}
          <PurchaseInformationData />
        </div>
      )}
      {isOpenModalSelectPurse && (
        <ModalSelectPurchaseRequest
          selectedKey={model?.purchaseProposalId?.id}
          setModal={setIsOpenModalSelectPurse}
          isShowModel={isOpenModalSelectPurse}
          callback={(value) => {
            handleConfirm(value);
          }}
          purchasePlanId={model?.idDetail}
        />
      )}

      <ModalConfirm
        open={isOpenModalConfirm}
        icon={<img src={warningIcon} alt="img" width={72} height={72} />}
        title={translate(
          "PL.purchasing_plan_confirm_select_procurement_request"
        )}
        content={translate(
          "PL.purchasing_plan_confirm_update_procurement_request_warning"
        )}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm")}
        handleSave={() => handleSaveData(valuePurchaseProposal)}
        handleCancel={() => setIsOpenModalConfirm(false)}
      />
    </div>
  );
};

export default ProcurementRequestBase;
