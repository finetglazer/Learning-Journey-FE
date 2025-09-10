import { Row } from "antd";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DeActiveSvg from "assets/icons/CostLine/ic_deactive.svg";
import {
  JPY_CURRENCY_UNIT,
  STANDARD_DATE_FORMAT_SLASH,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import {
  formatDate,
  formatDateTimeToVietnamTimezone,
} from "core/helpers/date-time";
import { calculateSumArray, formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { ContractDetailModel, TicketTypeNumber } from "models/Contract";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import BasicInformationDetail from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleView/Components/BasicInformationDetail";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import { useContext, useMemo } from "react";
import CardGrid from "../../CardGrid/CardGrid";
import "./BasicInformation.scss";

const ContractViewBasicInformation = () => {
  const [translate] = useTranslationContract();
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const currencyCode = model?.currency || VND_CURRENCY_UNIT;
  const roundNumber =
    isEqual(currencyCode, VND_CURRENCY_UNIT) ||
    isEqual(currencyCode, JPY_CURRENCY_UNIT)
      ? 0
      : 2;

  const isContractTermination = (isActive: boolean) => {
    return <img src={isActive ? ActiveSvg : DeActiveSvg} alt="" />;
  };

  const contractTotalValue = useMemo(() => {
    if (model?.contractGoodsItems?.length <= 0) return 0;
    return formatNumberToCurrency(
      calculateSumArray(
        model?.contractGoodsItems?.map((item) => item.totalAmount)
      ),
      4
    );
  }, [model?.contractGoodsItems]);

  // Use Ticket Type Number to avoid is not equal
  const expenseType = useMemo(() => {
    return model?.ticketRelated?.purchasePlanRelateds?.find(
      (el: { ticketTypeNumber: TicketTypeNumber }) =>
        el.ticketTypeNumber === TicketTypeNumber.Policy
    );
  }, [model?.ticketRelated?.purchasePlanRelateds]);

  if (model?.isPrinciple) return <BasicInformationDetail />;

  return (
    <div className="contract_view_basic_information">
      <CollapseCard title={translate("PP.tab_general_information")}>
        <div className="contract_view_basic_information-body">
          <Row>
            <CardGrid
              title={translate("CT.create_contract.title.contract_number")}
              className="w-percentage-4 card-bg-gray card-rounded-top-left"
            >
              {model?.contractNo ? model.contractNo : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.contract_name")}
              className="w-percentage-8 card-bg-gray card-rounded-top-right card-right"
            >
              {model?.name ? model.name : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.contract_total_value")}
              className="w-percentage-4"
            >
              {model?.contractGoodsItems?.length > 0 ? contractTotalValue : "0"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.currency_type")}
              className="w-percentage-4"
            >
              {model?.currency ? model.currency : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.exchange_rate")}
              className="w-percentage-4 card-right"
            >
              {model?.rate ? formatNumber(model.rate) : "0"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.contract_type")}
              className="w-percentage-4"
            >
              {model?.contractType?.name ? model.contractType.name : "--"}
            </CardGrid>
            <CardGrid
              title={translate(
                "CT.create_contract.title.percentage_overpayment"
              )}
              className="w-percentage-4"
            >
              {model?.contractType
                ? formatNumber(model.contractType.maxOverpaymentPercentage)
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.value_overpayment")}
              className="w-percentage-4 card-right"
            >
              {model?.contractType
                ? formatNumberToCurrency(
                    model.contractType.maxOverpaymentAmount,
                    roundNumber
                  )
                : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.txt_valid_date")}
              className="w-percentage-4"
            >
              {model?.effectiveDate
                ? formatDateTimeToVietnamTimezone(
                    model.effectiveDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.txt_end_date")}
              className="w-percentage-4"
            >
              {model?.endDate
                ? formatDateTimeToVietnamTimezone(
                    model.endDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.contract_form")}
              className="w-percentage-4 card-right"
            >
              {model?.contractForm?.name ? model.contractForm.name : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.label_management_units")}
              className="w-percentage-4"
            >
              {model?.organization?.name ? model.organization.name : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.expense_type")}
              className="w-percentage-4"
            >
              {expenseType ? expenseType?.costType : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.expense_item")}
              className="w-percentage-4 card-right"
            >
              {expenseType ? expenseType?.costGroup : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.contract_manager")}
              className="w-percentage-4"
            >
              {model?.managerObj &&
              model.managerObj.name &&
              model.managerObj.email
                ? `${model.managerObj.email} - ${model.managerObj.name}`
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.management_branch")}
              className="w-percentage-4"
            >
              {model?.orgBusinessBranch?.name
                ? `${model.orgBusinessBranch.name}`
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.management_block")}
              className="w-percentage-4 card-right"
            >
              {model?.orgBusinessDepartment?.businessUnitName
                ? model.orgBusinessDepartment.businessUnitName
                : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.label_create_user")}
              className="w-percentage-4"
            >
              {model?.user?.name
                ? `${model.user.email} - ${model.user.name}`
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.label_create_unit")}
              className="w-percentage-4"
            >
              {model?.createdOrganization?.name
                ? `${model.createdOrganization.name}`
                : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.position_title")}
              className="w-percentage-4 card-right"
            >
              {model?.position?.name}
            </CardGrid>

            <CardGrid
              title={translate(
                "CT.create_contract.contract_must_be_terminated"
              )}
              className="w-percentage-4 card-rounded-bottom-left card-bottom"
            >
              {isContractTermination(!!model?.isContractTermination)}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.contract_create_date")}
              className="w-percentage-4 card-bottom"
            >
              {formatDate(model?.createdDate, STANDARD_DATE_FORMAT_SLASH)}
            </CardGrid>
            <CardGrid className="w-percentage-4 card-rounded-bottom-right card-bottom card-right" />
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractViewBasicInformation;
