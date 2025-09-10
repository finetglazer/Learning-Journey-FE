import React, { useState } from "react";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyCloudIcon, warningIcon } from "assets/icons";
import PurchaseInformationData from "../PurchaseInfoData/PurchaseInformationData";
import { isEmpty, isNil } from "lodash";
import { Button, FormItem, ModalConfirm } from "react-components-design-system";
import {
  PurchaseProposalModel,
  PurchasingPlanModel,
} from "models/PurchasingPlan/PurchasingPlan";
import { ModalSelectPurchaseRequest } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/GenerationInfoTab/Components/ModalSelectPurchaseRequest/ModalSelectPurchaseRequest";
import { utilService } from "core/services/common-services/util-service";

const ProcurementRequestBase = ({
  isView = false,
  contextValue,
}: {
  isView?: boolean;
  contextValue: PurchasingPlanModel;
}) => {
  const { translate, model, handleChangeAllField } = contextValue;
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
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "originalPurchaseRequestId"
            )}
          >
            <EmptyInitializeTable
              isSolid={false}
              textButton={translate(
                "PL.purchasing_plan_select_procurement_request"
              )}
              content={
                <div className="text-break-line">
                  {translate("PL.bidding.title.add_new_data")}
                </div>
              }
              icon={<img src={emptyCloudIcon} alt="" />}
              onHandleClickAdd={() => {
                setIsOpenModalSelectPurse(true);
              }}
            />
          </FormItem>
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
          <PurchaseInformationData contextValue={contextValue} />
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
