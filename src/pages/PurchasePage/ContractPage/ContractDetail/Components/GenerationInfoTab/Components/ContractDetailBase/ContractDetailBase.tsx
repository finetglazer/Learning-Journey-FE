import "./ContractDetailBase.scss";
import { useTranslation } from "react-i18next";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { Button, FormItem } from "react-components-design-system";
import ShoppingPlanTable from "./ShoppingPlanTable/ShoppingPlanTable";
import React, { useContext, useEffect, useState } from "react";

import BaseModal from "./ContractDetailBaseModal/ContractDetailBaseModal";
import { ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { utilService } from "core/services/common-services/util-service";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { getDataContractSupplier } from "../SellerInformation/helper";
import { useHistory } from "react-router";

const ContractDetailBase = () => {
  const [translate] = useTranslation();
  const history = useHistory();
  const [openListShoppingPlan, setOpenListShoppingPlan] = useState(false);

  const {
    model,
    handleChangeAllField,
    setCanChangeExchangeRateByCurrency,
    handleInitDataCreate,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const cancelModal = () => {
    setOpenListShoppingPlan(false);
  };

  const applyShoppingPlan = React.useCallback(
    async (id: string, applyFromLink = false) => {
      if (!id) return;
      setCanChangeExchangeRateByCurrency(true);
      setOpenListShoppingPlan(false);

      const response = await getSupplierByOriginalById(id);

      const contractSupplier = getDataContractSupplier(
        response?.supplierPurchasePlans?.[0]
      );

      if (applyFromLink) {
        Object.assign(model, handleInitDataCreate());
      }

      const legalEntity = response?.legalEntities?.filter(
        (item: { isDefaultLegalEntity: boolean }) =>
          item.isDefaultLegalEntity === true
      )[0];

      handleChangeAllField({
        ...model,
        originalPurchasePlanId: id,
        contractSupplier,
        currency: contractSupplier?.currency,
        warranties: response?.warranties || [],
        guarantees: response?.guarantees || [],
        paymentSchedules: [],
        contractGoodsServicesList: contractSupplier?.goodsItems || [],
        contractGoodsItems: contractSupplier?.goodsItems || [],
        legalEntity: legalEntity,
        legalEntityId: legalEntity?.id,
        isWithoutAssessment: response?.isWithoutAssessment,
        errors: {
          ...model?.errors,
          "contractSupplier.supplierId": null,
          "contractSupplier.address": null,
          "contractSupplier.agentPerson": null,
          "contractSupplier.agentPersonPosition": null,
          "contractSupplier.contactPerson": null,
          "contractSupplier.email": null,
        },
      });
    },
    [
      handleChangeAllField,
      handleInitDataCreate,
      model,
      setCanChangeExchangeRateByCurrency,
    ]
  );

  const getSupplierByOriginalById = async (id: string) => {
    try {
      const res = await contractRepository
        .getListSupplierByOriginalId({ id })
        .toPromise();
      return res;
    } catch (error) {
      return null;
    }
  };

  const onPressChooseMethod = () => {
    setOpenListShoppingPlan(true);
  };

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const originalPurchasePlanId = query.get("originalPurchasePlanId");
    if (
      originalPurchasePlanId &&
      originalPurchasePlanId !== model?.originalPurchasePlanId
    ) {
      applyShoppingPlan(originalPurchasePlanId, true);
    }
  }, [
    applyShoppingPlan,
    history.location.search,
    model?.originalPurchasePlanId,
  ]);

  return (
    <div className="create_contract_base_wrapper">
      <CollapseCard>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "originalPurchasePlanId"
          )}
        >
          <Button
            className="create_contract_btn"
            type="secondary"
            size="lg"
            onClick={onPressChooseMethod}
          >
            {translate("CT.create_contract.btn_shopping_plan")}
          </Button>
        </FormItem>
        <ShoppingPlanTable />

        {openListShoppingPlan && (
          <BaseModal
            handleApply={applyShoppingPlan}
            handleCancel={cancelModal}
            open={openListShoppingPlan}
            isPrinciple={model.isPrinciple}
          />
        )}
      </CollapseCard>
    </div>
  );
};

export default ContractDetailBase;
