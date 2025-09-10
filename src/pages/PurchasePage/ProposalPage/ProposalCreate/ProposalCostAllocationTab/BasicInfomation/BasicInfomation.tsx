import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { LIST_TYPE_COST, SHOPPING_PURPOSES } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import ProposalCostAllocationDetail from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/ProposalCostAllocationDetail/ProposalCostAllocationDetail";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { useContext, useEffect, useState } from "react";
import { FormItem, InputNumber, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./BasicInformation.scss";

const BasicInformation = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);
  const [disabledBackupUseApprover, setDisabledBackupUseApprover] =
    useState(true);
  const [costAllocationMethodDisabled, setCostAllocationMethodDisabled] =
    useState(false);
  const {
    model,
    exchangeRateNumberType,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
  } = useContext(ProposalCreateHookContext);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  useEffect(() => {
    if (model && model.totalContingencyAmount === undefined) {
      handleChangeSingleField({
        fieldName: "totalContingencyAmount",
      })(0);
    }
  }, [model, handleChangeSingleField]);

  useEffect(() => {
    setDisabledBackupUseApprover(
      model.totalContingencyAmount === 0 ||
        model.totalContingencyAmount === "" ||
        model.totalContingencyAmount === null ||
        model.totalContingencyAmount === undefined
    );
    const hasCostAllocations =
      model.costAllocation && model?.costAllocation?.length > 0;
    setCostAllocationMethodDisabled(hasCostAllocations);
  }, [model.totalContingencyAmount, model.costAllocation]);

  useEffect(() => {
    const costDriverDefault = model.costGroup?.costLines?.[0]?.costDriver;
    if (costDriverDefault) {
      handleChangeSingleField({
        fieldName: "costDriver",
      })(costDriverDefault);
    } else {
      getCostDriver();
    }
  }, [model.costGroup]);

  const getCostDriver = () => {
    proposalRepository.costDriver({}).subscribe({
      next: (response) => {
        const defaultCostDriver = response.find(
          (item) => item.code === LIST_TYPE_COST.COST__ABSOLUTE_AMOUNT
        );
        if (!model.costDriver) {
          handleChangeSingleField({
            fieldName: "costDriver",
          })(defaultCostDriver);
        }
      },
    });
  };

  if (model.isDetail) return <ProposalCostAllocationDetail />;

  return (
    <>
      <div className="basic-information">
        <div className="header" onClick={handleChangeCollapse}>
          <div className="title">{translate("PP.basic_information")}</div>
          <div>
            <img
              className={classNames("cursor-pointer", {
                "rotate-180": collapse,
                "rotate-0": !collapse,
              })}
              src={IcArrowDown}
              alt="img"
              width={16}
              height={16}
            />
          </div>
        </div>
        {collapse && (
          <div className="body">
            <div className="item_row">
              <FormItem
                validateObject={utilService.getValidateObj(model, "costDriver")}
              >
                <Select
                  label={translate("PP.cost_allocation_method")}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch={false}
                  getList={proposalRepository.costDriver}
                  onChange={(id, value) => {
                    handleChangeAllField({
                      ...model,
                      allocationMonth: null,
                      businessBranchId: null,
                      businessUnitId: null,
                      businessDepartmentId: null,
                      isPriceExcludingTax: null,
                      projectName:
                        model?.procurementPurpose?.id ===
                        SHOPPING_PURPOSES.ACCORDING_PROJECT
                          ? model.projectName
                          : null,
                      costLineName:
                        model?.procurementPurpose?.id ===
                        SHOPPING_PURPOSES.ACCORDING_PROJECT
                          ? model.costLineName
                          : null,
                      autoCostAllocationDocumentsAttach: null,
                      estimateIncludesTax: null,
                      contingencyIncludesTax: null,
                      errors: null,
                    });
                    handleChangeSelectField({
                      fieldName: "costDriver",
                    })(id, value);
                  }}
                  value={model?.costDriver}
                  isEnumerable={false}
                  disabled={costAllocationMethodDisabled}
                />
              </FormItem>

              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "totalEstimateAmount"
                )}
              >
                <InputNumber
                  label={translate("PP.total_estimate")}
                  placeHolder={translate(
                    "PP.proposal_enter_the_total_estimated_amount"
                  )}
                  isRequired
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "totalEstimateAmount",
                  })}
                  numberType={exchangeRateNumberType}
                  suffix={model?.currency?.code}
                  value={model?.totalEstimateAmount}
                  max={NUMBER_MAX_13}
                  isReverseSymb
                />
              </FormItem>

              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "totalContingencyAmount"
                )}
              >
                <InputNumber
                  label={translate("PP.reserve_amount")}
                  isRequired
                  isSmall={false}
                  onChange={(value) => {
                    handleChangeSingleField({
                      fieldName: "totalContingencyAmount",
                    })(value || value === 0 ? value : null);
                  }}
                  numberType={exchangeRateNumberType}
                  suffix={model?.currency?.code}
                  value={model?.totalContingencyAmount}
                  max={NUMBER_MAX_13}
                  isReverseSymb
                />
              </FormItem>
            </div>
          </div>
        )}
      </div>
      <div className="basic-information-border"></div>
    </>
  );
};

export default BasicInformation;
