import { CheckIconT } from "assets/icons";
import { listPurposeShoppingEnum } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { ProposalCreateModel, PurposeShoppingEnum } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext } from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { SHOPPING_PURPOSES } from "models/Payment";

const ProcurementPurpose = () => {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleCheckAsset,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const renderContent = () => {
    switch (model.procurementPurpose?.id) {
      case PurposeShoppingEnum.RegularPurchasing:
      case PurposeShoppingEnum.Other:
        return (
          <div className="flex-1">
            <InputText
              label={translate("PP.note")}
              isSmall={false}
              onChange={handleChangeSingleField({
                fieldName: "note",
              })}
              placeHolder={translate("PP.enter_note")}
              value={model.note}
              maxLength={500}
              translate={translate}
            />
          </div>
        );
      case PurposeShoppingEnum.RepairAndMaintenance:
        return (
          <>
            <div className="flex-1">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "purchasePurpose.assetCode"
                )}
              >
                <InputText
                  label={translate("PP.asset_code")}
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "assetCode",
                    errorName: "purchasePurpose.assetCode",
                  })}
                  placeHolder={translate("PP.enter_asset_code")}
                  value={model.assetCode}
                  maxLength={500}
                  translate={translate}
                  isRequired
                  action={
                    {
                      action: handleCheckAsset,
                      name: (
                        <button
                          className="p-0 m-0 check_asset"
                          disabled={!model?.assetCode}
                        >
                          <span>
                            <CheckIconT />
                          </span>
                          <span>{translate("PP.check_asset")}</span>
                        </button>
                      ),
                    } as unknown
                  }
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <InputText
                label={translate("PP.asset_name")}
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: "assetName",
                })}
                placeHolder={translate("PP.enter_asset_name")}
                value={model.assetName}
                maxLength={255}
                translate={translate}
              />
            </div>
          </>
        );
      case PurposeShoppingEnum.ProjectBased:
        return (
          <>
            <div className="flex-1">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "purchasePurpose.projectId"
                )}
              >
                <Select
                  isRequired
                  label={translate("PP.project_code")}
                  placeHolder={translate("PP.select_project")}
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                    isProject:
                      SHOPPING_PURPOSES.ACCORDING_PROJECT ===
                      Number(model.procurementPurpose?.id),
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch
                  isEnumerable={false}
                  getList={paymentRepository.getProjectList}
                  onChange={handleChangeSelectField({
                    fieldName: "projectId",
                  })}
                  value={model.projectId}
                  render={(t) => t?.code}
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <InputText
                label={translate("PP.project_name")}
                isSmall={false}
                disabled
                value={model.projectId?.name || "---"}
              />
            </div>
          </>
        );
      case PurposeShoppingEnum.PromotionalPurchasing:
        return (
          <>
            <div className="flex-1">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "purchasePurpose.promotionId"
                )}
              >
                <Select
                  isRequired
                  label={translate("PP.promotion_code")}
                  placeHolder={translate("PP.select_promotion_code")}
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch
                  isEnumerable={false}
                  getList={paymentRepository.getPromotionList}
                  onChange={handleChangeSelectField({
                    fieldName: "promotionId",
                    errorName: "purchasePurpose.promotionId",
                  })}
                  value={model.promotionId}
                  render={(t) => t?.code}
                />
              </FormItem>
            </div>
            <div className="flex-1">
              <InputText
                label={translate("PP.promotion_name")}
                isSmall={false}
                disabled
                value={model.promotionId?.name || "---"}
              />
            </div>
          </>
        );
      default:
        break;
    }
  };
  return (
    <div className="item_row">
      <div className="flex-1">
        <Select
          isRequired
          label={translate("PP.procurement_purpose")}
          valueFilter={{
            name: "",
          }}
          isSmall={false}
          classFilter={undefined}
          isSearch={false}
          getList={() => of(listPurposeShoppingEnum)}
          onChange={handleChangeSelectField({
            fieldName: "procurementPurpose",
          })}
          value={model.procurementPurpose}
          allowClear={false}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default ProcurementPurpose;
