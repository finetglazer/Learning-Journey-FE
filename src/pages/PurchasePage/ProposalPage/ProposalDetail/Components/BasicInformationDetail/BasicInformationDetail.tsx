import { ProposalCreateModel, PurposeShoppingEnum } from "models/Proposal";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { IcArrowDown } from "assets/icons";
import "./BasicInformationDetail.scss";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { addNumbers, formatNumber } from "core/helpers/number";
import BasicInformationDetailAdjust from "./BasicInformationDetailAdjust";
import GeneralGoodsServicesTable from "./GeneralGoodsServicesTable";
import { ProposalStatus } from "config/const";
import { Tooltip } from "antd";
import OutlinedInfoIcon from "assets/icons/Common/OutlinedInfoIcon";

const BasicInformationDetail = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const adjustedProposalValue = addNumbers(
    model.totalEstimateAmount,
    model.totalContingencyAmount
  );

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  const renderProcurementPurpose = () => {
    switch (model?.procurementPurpose?.id) {
      case PurposeShoppingEnum.RegularPurchasing:
      case PurposeShoppingEnum.Other:
      case PurposeShoppingEnum.StoragePurchasing:
      case PurposeShoppingEnum.FinancialLease:
        return (
          <div className="flex-2 table-cell p-r-48">
            <span className="title">{translate("PP.note")}</span>
            <span className="value">{model?.note || "---"}</span>
          </div>
        );

      case PurposeShoppingEnum.RepairAndMaintenance:
        return (
          <>
            <div className="table-cell flex-1">
              <span className="title">{translate("PP.asset_code")}</span>
              <span className="value">{model?.assetCode}</span>
            </div>
            <div className="table-cell flex-1">
              <span className="title">{translate("PP.asset_name")}</span>
              <span className="value">{model?.assetName}</span>
            </div>
          </>
        );
      case PurposeShoppingEnum.ProjectBased:
        return (
          <>
            <div className="table-cell flex-1">
              <span className="title">{translate("PP.project_code")}</span>
              <span className="value">{model?.projectId?.code}</span>
            </div>
            <div className="table-cell flex-1">
              <span className="title">{translate("PP.project_name")}</span>
              <span className="value">{model?.projectId?.name}</span>
            </div>
          </>
        );
      case PurposeShoppingEnum.PromotionalPurchasing:
        return (
          <>
            <div className="table-cell flex-1">
              <span className="title">{translate("PP.promotion_code")}</span>
              <span className="value">{model?.promotionId?.code}</span>
            </div>
            <div className="table-cell flex-1">
              <span className="title">{translate("PP.promotion_name")}</span>
              <span className="value">{model?.promotionId?.name}</span>
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  if (model.isAdjust) return <BasicInformationDetailAdjust />;

  return (
    <div className="proposal_basic_info_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PP.general_information")}</div>
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
        <div className="basic-information-detail">
          <div className="basic-information-item">
            <div className="table-row bg-gray">
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.proposalValue")}</span>
                <span className="value">
                  {formatNumber(adjustedProposalValue)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.proposal_name")}</span>
                <span className="value">{model?.name}</span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.proposal_type")}</span>
                <span className="value">{model?.type?.name}</span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.total_estimate")}</span>
                <span className="value">
                  {formatNumber(model?.totalEstimateAmount)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">
                  {translate("PP.implementation_time")}
                </span>
                <span className="value">
                  {formatDate(
                    model?.startDate?.[0],
                    STANDARD_DATE_FORMAT_SLASH
                  )}
                  {" - "}
                  {formatDate(
                    model?.startDate?.[1],
                    STANDARD_DATE_FORMAT_SLASH
                  )}
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">
                  {translate("PP.expected_receipt_date")}
                </span>
                <span className="value">
                  {formatDate(
                    model?.receivedDate,
                    STANDARD_DATE_FORMAT_SLASH
                  ) || "---"}
                </span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell flex-1">
                <span className="title">
                  {translate("PP.proposal_description")}
                </span>
                <span className="value">
                  {(model?.isAdjust
                    ? model?.originalDescription
                    : model?.description) || "---"}
                </span>
              </div>
            </div>
          </div>

          <div className="basic-information-item">
            <div className="table-row bg-gray">
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.total_reserve")}</span>
                <span className="value">
                  {formatNumber(model?.totalContingencyAmount)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">
                  {translate("PP.backup_use_approver")}&nbsp;
                  <Tooltip
                    title={translate("PP.information_position_approved")}
                  >
                    <div>
                      <OutlinedInfoIcon />
                    </div>
                  </Tooltip>
                </span>
                <span className="value">
                  {model?.positionApproves
                    ?.map((item) => item.name)
                    .join(", ") || "---"}
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.creation_date")}</span>
                <span className="value">
                  {model?.createdDate
                    ? formatDate(model?.createdDate, STANDARD_DATE_FORMAT_SLASH)
                    : "---"}
                </span>
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.user_create")}</span>
                <span className="value">
                  {model?.user?.email} - {model?.user?.name}
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.creating_unit")}</span>
                <span className="value">
                  {model?.organization?.name || "---"}
                </span>
              </div>
              <div className="table-cell flex-1">
                <span className="title">{translate("PP.position")}</span>
                <span className="value">
                  <span className="value">
                    {model?.position?.name || "---"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="basic-information-item">
            <div className="table-row">
              <div className="table-cell flex-1 bg-gray">
                <span className="title">
                  {translate("PP.procurement_purpose")}
                </span>
                <span className="value">{model?.procurementPurpose?.name}</span>
              </div>
              {renderProcurementPurpose()}
            </div>
          </div>
          {model?.status === ProposalStatus.IN_PROGRESS && (
            <GeneralGoodsServicesTable />
          )}
        </div>
      )}
    </div>
  );
};

export default BasicInformationDetail;
