import { CheckIconT } from "assets/icons";
import { listPurposeShoppingEnum } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import {
  CostAllocation,
  ProposalCreateModel,
  PurposeShoppingEnum,
} from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { Fragment, useContext } from "react";
import { FormItem, InputText, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import "../BasicInformation.scss";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { SHOPPING_PURPOSES } from "models/Payment";
import { GeneralActionEnum } from "core/services/service-types";
import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";

const ProcurementPurpose = () => {
  const [translate] = useTranslation();

  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleCheckAsset,
    dispatchModel,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const renderContent = () => {
    const newMapContentById = new Map([
      [
        PurposeShoppingEnum.RepairAndMaintenance,
        <>
          <Col lg={8}>
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
                readOnly={model.isAdjust}
                action={
                  !model.isAdjust &&
                  ({
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
                  } as unknown)
                }
              />
            </FormItem>
          </Col>
          <Col lg={8}>
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
              readOnly={model.isAdjust}
            />
          </Col>
        </>,
      ],
      [
        PurposeShoppingEnum.ProjectBased,
        <>
          <Col lg={8}>
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
                getList={(filter) =>
                  paymentRepository.getProjectList({
                    ...filter,
                    isProposalSelection: true,
                  })
                }
                onChange={(id, value) => {
                  const arrayCostAllocation =
                    model?.costAllocation &&
                    model.costAllocation?.map((item: CostAllocation) => {
                      return {
                        ...item,
                        projectId: "",
                        costLineId: "",
                      };
                    });
                  dispatchModel({
                    type: GeneralActionEnum.SET,
                    payload: {
                      ...model,
                      costAllocation: arrayCostAllocation,
                      projectName: value,
                      costLineName: value?.costLines?.[0],
                    },
                  });
                  handleChangeSelectField({
                    fieldName: "projectId",
                  })(id, value);
                }}
                value={model.projectId}
                render={(t) => (t?.code ? `${t?.code} - ${t?.name}` : null)}
                readOnly={model.isAdjust}
              />
            </FormItem>
          </Col>
          <Col lg={8}>
            <InputText
              label={translate("PP.project_name")}
              isSmall={false}
              value={model.projectId?.name || "---"}
              readOnly
            />
          </Col>
        </>,
      ],
      [
        PurposeShoppingEnum.PromotionalPurchasing,
        <>
          <Col lg={8}>
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
                readOnly={model.isAdjust}
              />
            </FormItem>
          </Col>
          <Col lg={8}>
            <InputText
              label={translate("PP.promotion_name")}
              isSmall={false}
              value={model.promotionId?.name || "---"}
              readOnly
            />
          </Col>
        </>,
      ],
    ]);

    if (newMapContentById.has(model?.procurementPurpose?.id)) {
      return newMapContentById.get(model.procurementPurpose.id);
    }

    return (
      <Col lg={16}>
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
      </Col>
    );
  };

  const renderInvestmentLocation = () => {
    if (model.procurementPurpose?.id === PurposeShoppingEnum.ProjectBased) {
      return (
        <Row gutter={16}>
          <Col lg={24}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "investmentLocation"
              )}
            >
              <InputText
                label={translate("PP.investment_location")}
                isSmall={false}
                value={model?.investmentLocation}
                readOnly={model.isAdjust}
                maxLength={255}
                regexInput={NOT_TAB_ENTER_REGEX}
                translate={translate}
                onChange={handleChangeSingleField({
                  fieldName: "investmentLocation",
                })}
              />
            </FormItem>
          </Col>
        </Row>
      );
    }
  };

  return (
    <Fragment>
      <Row gutter={16}>
        <Col lg={8}>
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
            onChange={(id, value) => {
              const resetData = {
                ...model,
                projectId: "",
                promotionId: "",
                assetCode: "",
                assetName: "",
                note: "",
              };

              dispatchModel({
                type: GeneralActionEnum.SET,
                payload: resetData,
              });

              handleChangeSelectField({
                fieldName: "procurementPurpose",
              })(id, value);
            }}
            value={model.procurementPurpose}
            allowClear={false}
            readOnly={model.isAdjust}
            disabled={!isEmpty(model?.costAllocation)}
          />
        </Col>
        {renderContent()}
      </Row>
      {renderInvestmentLocation()}
    </Fragment>
  );
};

export default ProcurementPurpose;
