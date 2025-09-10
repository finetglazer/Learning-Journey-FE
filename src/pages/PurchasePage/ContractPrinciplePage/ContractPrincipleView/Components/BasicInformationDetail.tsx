import { Row } from "antd";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { ContractDetailModel } from "models/Contract";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import CardGrid from "pages/PurchasePage/ContractPage/ContractView/Components/CardGrid/CardGrid";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { useContext } from "react";

const BasicInformationDetail = () => {
  const [translate] = useTranslationContract();
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  return (
    <div className="contract_view_basic_information">
      <CollapseCard title={translate("PP.tab_general_information")}>
        <div className="contract_view_basic_information-body">
          <Row>
            <CardGrid
              title={translate("CT.create_contract.title.contract_number")}
              className="w-percentage-4 card-bg-gray card-rounded-top-left"
            >
              {model.contractNo || "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.contract_name")}
              className="w-percentage-8 card-bg-gray card-rounded-top-right card-right"
            >
              {model.name || "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.currency_type")}
              className="w-percentage-4"
            >
              {model.currency || "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.exchange_rate")}
              className="w-percentage-8 card-right"
            >
              {model?.rate ? formatNumber(model.rate) : "0"}
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
              title={translate("CT.create_contract.title.contract_manager")}
              className="w-percentage-4 card-right"
            >
              {model?.managerObj
                ? `${model.managerObj.email} - ${model.managerObj.name}`
                : "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.label_management_units")}
              className="w-percentage-4"
            >
              {model?.organization?.name || "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.create_contract.title.management_branch")}
              className="w-percentage-4"
            >
              {model?.orgBusinessBranch?.name || "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.management_block")}
              className="w-percentage-4 card-right"
            >
              {model?.orgBusinessUnit?.name || "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.applicable_unit")}
              className="w-percentage-4"
            >
              {model?.applicableOrganization?.name || "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.applicable_branch")}
              className="w-percentage-4"
            >
              {model?.applicableBranch?.name || "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.applicable_division")}
              className="w-percentage-4 card-right"
            >
              {model?.applicableUnit?.name || "--"}
            </CardGrid>

            <CardGrid
              title={translate("CT.label_create_user")}
              className="w-percentage-4 card-rounded-bottom-left card-bottom"
            >
              {model?.user ? `${model.user.email} - ${model.user.name}` : "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.label_create_unit")}
              className="w-percentage-4 card-bottom"
            >
              {model?.createdOrganization?.name || "--"}
            </CardGrid>
            <CardGrid
              title={translate("CT.create_contract.title.position_title")}
              className="w-percentage-4 card-right card-rounded-bottom-right card-bottom card-right"
            >
              {model?.position?.name || "--"}
            </CardGrid>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default BasicInformationDetail;
