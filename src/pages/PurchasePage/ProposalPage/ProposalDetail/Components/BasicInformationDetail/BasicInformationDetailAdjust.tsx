import { Col, Row, Tooltip } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { addNumbers, formatNumber } from "core/helpers/number";
import { ProposalCreateModel, PurposeShoppingEnum } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "./BasicInformationDetail.scss";
import OutlinedInfoIcon from "assets/icons/Common/OutlinedInfoIcon";

const BasicInformationDetailAdjust = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const { model, handleClickOriginalCode } = useContext<ProposalCreateModel>(
    ProposalCreateHookContext
  );

  const originalProposalValue = addNumbers(
    model.originalTotalContingencyAmount,
    model.originalTotalEstimateAmount
  );
  const adjustedProposalValue = addNumbers(
    model.totalEstimateAmount,
    model.totalContingencyAmount
  );
  const difference = addNumbers(adjustedProposalValue, -originalProposalValue);

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
          <Col lg={16} className="table-cell bg-gray">
            <span className="title">{translate("PP.note")}</span>
            <span className="value">{model?.note || "---"}</span>
          </Col>
        );

      case PurposeShoppingEnum.RepairAndMaintenance:
        return (
          <>
            <Col lg={8} className="table-cell">
              <span className="title">{translate("PP.asset_code")}</span>
              <span className="value">{model?.assetCode}</span>
            </Col>
            <Col lg={8} className="table-cell">
              <span className="title">{translate("PP.asset_name")}</span>
              <span className="value">{model?.assetName}</span>
            </Col>
          </>
        );
      case PurposeShoppingEnum.ProjectBased:
        return (
          <>
            <Col lg={8} className="table-cell">
              <span className="title">{translate("PP.project_code")}</span>
              <span className="value">{model?.projectId?.code}</span>
            </Col>
            <Col lg={8} className="table-cell">
              <span className="title">{translate("PP.project_name")}</span>
              <span className="value">{model?.projectId?.name}</span>
            </Col>
          </>
        );
      case PurposeShoppingEnum.PromotionalPurchasing:
        return (
          <>
            <Col lg={8} className="table-cell">
              <span className="title">{translate("PP.promotion_code")}</span>
              <span className="value">{model?.promotionId?.code}</span>
            </Col>
            <Col lg={8} className="table-cell">
              <span className="title">{translate("PP.promotion_name")}</span>
              <span className="value">{model?.promotionId?.name}</span>
            </Col>
          </>
        );
      default:
        return <></>;
    }
  };

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
            <Row className="table-row bg-gray">
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.original_code")}</span>
                <span
                  className="value text-blue cursor-pointer"
                  onClick={() =>
                    handleClickOriginalCode(model?.originalPurchaseProposalId)
                  }
                >
                  {model?.originalCode}
                </span>
              </Col>
              <Col lg={16} className="table-cell">
                <span className="title">
                  {translate("PP.adjust_description_proposal")}
                </span>
                <span className="value">{model?.description}</span>
              </Col>
            </Row>
            <Row className="table-row bg-gray">
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.proposal_type")}</span>
                <span className="value">{model?.type?.name}</span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.proposal_name")}</span>
                <span className="value">{model?.name}</span>
              </Col>
              <Col lg={8} className="table-cell">
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
              </Col>
            </Row>
            <Row className="table-row">
              <Col lg={8} className="table-cell">
                <span className="title">
                  {translate("PP.proposal_description")}
                </span>
                <span className="value">
                  {(model?.isAdjust
                    ? model?.originalDescription
                    : model?.description) || "---"}
                </span>
              </Col>
              <Col lg={8} className="table-cell">
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
                  {model?.positionApprove?.name || "---"}
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">
                  {translate("PP.expected_receipt_date")}
                </span>
                <span className="value">
                  {formatDate(
                    model?.receivedDate,
                    STANDARD_DATE_FORMAT_SLASH
                  ) || "---"}
                </span>
              </Col>
            </Row>
            <Row className="table-row">
              <Col lg={8} className="table-cell">
                <span className="title">
                  {translate("PP.original_proposalValue")}
                </span>
                <span className="value">
                  {formatNumber(originalProposalValue)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">
                  {translate("PP.adjusted_proposalValue")}
                </span>
                <span className="value">
                  {formatNumber(adjustedProposalValue)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.difference")}</span>
                <span
                  className={classNames("value", {
                    text__green: difference >= 0,
                    text__red: difference < 0,
                  })}
                >
                  {difference < 0 ? "-" : "+"}{" "}
                  {formatNumber(Math.abs(difference))}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </Col>
            </Row>
          </div>

          <div className="basic-information-item">
            <Row className="table-row bg-gray">
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.total_reserve")}</span>
                <span className="value">
                  {formatNumber(model?.totalContingencyAmount)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.total_estimate")}</span>
                <span className="value">
                  {formatNumber(model?.totalEstimateAmount)}
                  <span className="title"> {model?.currency?.code}</span>
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.creation_date")}</span>
                <span className="value">
                  {model?.createdDate
                    ? formatDate(model?.createdDate, STANDARD_DATE_FORMAT_SLASH)
                    : "---"}
                </span>
              </Col>
            </Row>
            <Row className="table-row">
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.user_create")}</span>
                <span className="value">
                  {model?.user?.email} - {model?.user?.name}
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.creating_unit")}</span>
                <span className="value">
                  {model?.organization?.name || "---"}
                </span>
              </Col>
              <Col lg={8} className="table-cell">
                <span className="title">{translate("PP.position")}</span>
                <span className="value">
                  <span className="value">
                    {model?.position?.name || "---"}
                  </span>
                </span>
              </Col>
            </Row>
          </div>

          <div className="basic-information-item">
            <Row className="table-row">
              <Col lg={8} className="table-cell bg-gray">
                <span className="title">
                  {translate("PP.procurement_purpose")}
                </span>
                <span className="value">{model?.procurementPurpose?.name}</span>
              </Col>
              {renderProcurementPurpose()}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInformationDetailAdjust;
