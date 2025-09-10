import { utilService } from "core/services/common-services/util-service";
import {
  LIST_TYPE_COST,
  ProposalCreateModel,
  SHOPPING_PURPOSES,
  TypeFilterModel,
} from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  FormItem,
  InputNumber,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
// import "./AccordingToArea.scss";
import { Key } from "antd/lib/table/interface";
import { IcPlay } from "assets/icons";
import { NUMBER_MAX_13 } from "config/const";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import dayjs, { Dayjs } from "dayjs";
import { isEmpty } from "lodash";
import { CostLine } from "models/CostLine";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { map, of } from "rxjs";
import AdditionalChargeableUnits from "./AdditionalChargeableUnits/AdditionalChargeableUnits";
import "./ContentModalCostAllocationProposal.scss";
interface Props {
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

const ContentModalCostAllocationProposal = ({
  selectedRowKeys,
  setSelectedRowKeys,
}: Props) => {
  const {
    model,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeSelectField,
    handleGetListCostCenterByAllocationMonth,
    handleChangeAllField,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const [translate] = useTranslation();

  const getDisabledDate = (current: Dayjs | null) => {
    return current && current > dayjs().endOf("month");
  };

  useEffect(() => {
    handleChangeAllField({
      ...model,
      businessDepartmentId: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.businessUnitId]);

  const getListCostLines = (filter: TypeFilterModel) => {
    return of(model.projectId?.costLines).pipe(
      map((costLines: CostLine[]) => {
        if (!Array.isArray(costLines)) {
          return [];
        }

        const trimmedName = filter?.name?.trim();
        if (!trimmedName) {
          return costLines;
        }

        return costLines.filter((period) =>
          period?.code?.includes(trimmedName as string)
        );
      })
    );
  };

  return (
    <div className="according_to_area">
      {model.costDriver?.code === LIST_TYPE_COST.COST__QUANTITY ? (
        <div className="according_to_area_row">
          <div className="according_to_area_row__first">
            <Select
              isSmall={false}
              label={translate("PP.proposal_cost_allocation_label")}
              value={model.costDriver}
              classFilter={undefined}
              render={(t) => t?.name}
              readOnly
            />
          </div>
          <div className="according_to_area_row__first">
            <div className="according_to_area_row__first--checkbox">
              <Checkbox
                label={translate("PP.proposal_just_one_unit_price_label")}
                checked={model.isPriceExcludingTax}
                onChange={(value: boolean) => {
                  handleChangeSingleField({
                    fieldName: "isPriceExcludingTax",
                  })(value);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="according_to_area_row">
          <div className="according_to_area_row__first">
            <Select
              isSmall={false}
              label={translate("PP.proposal_cost_allocation_label")}
              value={model.costDriver}
              classFilter={undefined}
              render={(t) => t?.name}
              readOnly
            />
          </div>
          <div className="according_to_area_row__first">
            {(model.costDriver?.code === LIST_TYPE_COST.COST__AREA ||
              model.costDriver?.code ===
                LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY) && (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "allocationMonth"
                )}
              >
                <DatePicker
                  className="payment-custom_datepicker"
                  label={translate("PP.proposal_month_of_allocation_label")}
                  placeholder={"MM-YYYY"}
                  isRequired
                  isSmall={false}
                  picker="month"
                  dateFormat={["MM-YYYY"]}
                  value={model.allocationMonth}
                  onChange={handleChangeDateField({
                    fieldName: "allocationMonth",
                  })}
                  disabledDate={getDisabledDate}
                />
              </FormItem>
            )}
          </div>
        </div>
      )}
      {/* Đơn giá dự toán và dự phòng đã gồm thuế */}
      {model.isPriceExcludingTax &&
        model.costDriver?.code === LIST_TYPE_COST.COST__QUANTITY && (
          <div className="according_to_area_row__second">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "estimateIncludesTax"
              )}
            >
              <InputNumber
                label={translate(
                  "PP.proposal_estimated_unit_price_includes_tax"
                )}
                isSmall={false}
                isRequired
                placeHolder={translate("PP.proposal_enter_unit_price")}
                value={model?.estimateIncludesTax}
                onChange={handleChangeSingleField({
                  fieldName: "estimateIncludesTax",
                })}
                isReverseSymb
                numberType={getNumberTypeByCurrency(model.currency?.code)}
                max={NUMBER_MAX_13}
                allowNegative
              />
            </FormItem>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "contingencyIncludesTax"
              )}
            >
              <InputNumber
                label={translate(
                  "PP.proposal_the_reserve_unit_price_includes_tax"
                )}
                isSmall={false}
                isRequired
                placeHolder={translate("PP.proposal_enter_unit_price")}
                value={model?.contingencyIncludesTax}
                onChange={handleChangeSingleField({
                  fieldName: "contingencyIncludesTax",
                })}
                isReverseSymb
                numberType={getNumberTypeByCurrency(model.currency?.code)}
                max={NUMBER_MAX_13}
                allowNegative
              />
            </FormItem>
          </div>
        )}

      <div className="according_to_area_row">
        {/* Dự án/ hạng mục ngân sách */}
        <div className="according_to_area_row__third">
          <Select
            isSearch
            searchType=""
            isEnumerable={false}
            isSmall={false}
            onChange={(value, objectValue) => {
              const updatedCostLines = Array.isArray(objectValue?.costLines)
                ? objectValue.costLines
                : [];
              const firstCostLine = updatedCostLines[0] || null;

              handleChangeAllField({
                ...model,
                projectName: objectValue,
                costLineName: firstCostLine,
              });
            }}
            valueFilter={{
              name: "",
              isProject:
                model?.procurementPurpose?.id ==
                SHOPPING_PURPOSES.ACCORDING_PROJECT,

              projectId:
                model?.procurementPurpose?.id ==
                SHOPPING_PURPOSES.ACCORDING_PROJECT
                  ? model?.projectIdId
                  : "",
            }}
            label={translate("PP.proposal_estimated_budget_items")}
            placeHolder={translate("PP.proposal_choose_estimated_budget_items")}
            value={model?.projectName}
            classFilter={undefined}
            render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
            getList={
              model?.procurementPurpose?.id ===
              SHOPPING_PURPOSES.ACCORDING_PROJECT
                ? () => of([model?.projectId])
                : proposalRepository.getProjectList
            }
          />
        </div>
        {/* Cost line */}
        <div className="according_to_area_row__third">
          <Select
            disabled={isEmpty(model.projectName)}
            isSmall={false}
            label={translate("PP.proposal_cost_line")}
            placeHolder={translate("PP.proposal_choose_cost_line")}
            searchType=""
            searchProperty="name"
            valueFilter={{
              name: "",
              budgetId: model?.projectId?.id || "",
            }}
            classFilter={undefined}
            isSearch
            onChange={handleChangeSelectField({
              fieldName: "costLineName",
            })}
            getList={(search) => getListCostLines(search)}
            render={(t) => (t ? t?.code : "")}
            isEnumerable={false}
            value={
              model?.costLineName ??
              (model?.projectName?.costLines?.length > 0
                ? model?.projectName?.costLines[0]
                : null)
            }
            appendToBody
          />
        </div>
      </div>

      <div>
        <div className="fs-8 fw-semibold m-t--lg m-b--2xs">
          {translate("PP.proposal_list_of_units_subject_to_charges")}
        </div>
        {(model.costDriver.code &&
          model.costDriver.code === LIST_TYPE_COST.COST__AREA) ||
        model.costDriver.code === LIST_TYPE_COST.COST__EMPLOYEE_QUANTITY ? (
          <div className="payment-custom_grid_12 payment-custom_grid_12-align-end">
            {/* Btn Lấy đơn vị chịu phí từ cấu hình */}
            <div className="payment-custom_grid_12-col_3">
              <Button
                icon={<img src={IcPlay} alt="icon" width={11} height={13} />}
                size="lg"
                iconPlace="left"
                type="secondary"
                disabled={!model.allocationMonth}
                onClick={handleGetListCostCenterByAllocationMonth}
              >
                {translate(
                  "PP.proposal_get_chargeable_unit_from_the_config_btn"
                )}
              </Button>
            </div>
            {/* CN/PGD */}
            <div className="payment-custom_grid_12-col_3">
              <Select
                placeHolder={translate("PP.branch_office")}
                classFilter={undefined}
                searchProperty="name"
                searchType=""
                isSearch={true}
                valueFilter={{
                  name: "",
                }}
                getList={proposalRepository.listBusinessBranchId}
                onChange={handleChangeSelectField({
                  fieldName: "businessBranchId",
                })}
                isEnumerable={false}
                render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                value={model.businessBranchId}
                readOnly={model.isDetail}
              />
            </div>
            {/* NHCD/Khối */}
            <div className="payment-custom_grid_12-col_3">
              <Select
                placeHolder={translate("PP.department_block")}
                classFilter={undefined}
                searchProperty="name"
                searchType=""
                isSearch={true}
                valueFilter={{
                  name: "",
                }}
                onChange={handleChangeSelectField({
                  fieldName: "businessUnitId",
                })}
                getList={proposalRepository.listBusinessUnitId}
                isEnumerable={false}
                render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                value={model.businessUnitId}
                readOnly={model.isDetail}
              />
            </div>
            {/* TT/PB */}
            <div className="payment-custom_grid_12-col_3">
              <Select
                disabled={!model.businessUnitId}
                placeHolder={translate("PP.sub_department")}
                classFilter={undefined}
                searchProperty="name"
                searchType=""
                isSearch={true}
                valueFilter={{
                  name: "",
                  businessUnitId: model.businessUnitId?.id || "",
                }}
                getList={proposalRepository.listBusinessDepartmentId}
                onChange={handleChangeSelectField({
                  fieldName: "businessDepartmentId",
                })}
                isEnumerable={false}
                render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
                value={model.businessDepartmentId}
                readOnly={model.isDetail}
              />
            </div>
          </div>
        ) : null}

        <div>
          <AdditionalChargeableUnits
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentModalCostAllocationProposal;
