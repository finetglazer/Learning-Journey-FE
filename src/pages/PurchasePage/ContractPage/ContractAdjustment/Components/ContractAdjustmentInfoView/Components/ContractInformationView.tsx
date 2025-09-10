import { Avatar, Badge, Col, Row, Tooltip } from "antd";
import { UserIcon, WarningRound } from "assets/icons";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { formatDate } from "core/helpers/date-time";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { gt } from "lodash";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { ContractAdjustmentContext } from "../../../ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import classNames from "classnames";

export const ContractInformationView = () => {
  const [translate] = useTranslation();
  const { model } = useContext(ContractAdjustmentContext);

  const contract = model?.contract;

  const {
    totalAmount,
    currency,
    name,
    contractNo,
    contractId,
    user,
    effectiveDate,
    endDate,
    rate,
    contractType,
    organization,
    orgBusinessUnitName,
    orgBusinessBranchName,
    contractForm,
    contractCode,
    costType,
    costGroup,
    managerObj,
  } = contract || {};

  const type = useMemo(() => {
    let key = "CA.txt_contract";
    if (model?.contractInfo?.contractRequestType === numberConstants.ONE) {
      key = "CA.txt_order";
    }

    return translate(key);
  }, [model?.contractInfo?.contractRequestType, translate]);

  const roundedSpacing = () => {
    return <span className={styles["rounded-spacing"]} />;
  };

  const goToContractPage = () => {
    const url = `${window.location.origin}${CONTRACT_ROUTE_VIEW}/${contractId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const makeRowText = (
    title: string,
    value: string,
    hasSemicolon?: boolean
  ) => {
    const suffix = hasSemicolon ? ": " : "";
    return (
      <div className={styles["text-row"]}>
        <div className={styles["text-label"]}>{`${title}${suffix}`}</div>
        <div className={styles["text-value"]}>{value}</div>
      </div>
    );
  };

  const makeColumnText = (title: string, value: string) => {
    return (
      <div className={styles["text-column"]}>
        <div className={styles["text-label"]}>{`${translate(title, {
          type,
        })}`}</div>
        <div className={styles["text-value"]}>{value}</div>
      </div>
    );
  };

  const makeNormalInformation = () => {
    return (
      <div className={styles["normal-information__wrapper"]}>
        <div className={styles["title-section"]}>
          <div className={styles["title-custom"]}>
            <div
              className={classNames(
                styles["title"],
                styles["title-link"],
                "d-flex"
              )}
              onClick={goToContractPage}
            >
              <Tooltip placement="top" title={contractCode}>
                {contractCode}
              </Tooltip>
            </div>
            {model?.contract?.isChangeGeneral && (
              <Tooltip placement="topLeft" title={translate("CA.txt_adjusted")}>
                <span className="d-flex align-items-start">
                  <img src={WarningRound} alt="" />
                </span>
              </Tooltip>
            )}
            <div className={classNames(styles["title"], styles["title-name"])}>
              <Tooltip placement="top" title={name}>
                {name}
              </Tooltip>
            </div>
          </div>
          <div className={styles["total"]}>
            {`${translate("CA.txt_total_value")}:`}
            <div>{`${formatCurrency({
              value: totalAmount,
              shouldRoundTwoNumber: true,
              code: currency,
            })} ${currency}`}</div>
          </div>
        </div>
        {/* Include: Person, contract no, effective/end date, rate */}
        <div className={styles["content-section"]}>
          {/* Avatar */}
          <div className={styles["avatar"]}>
            <Badge dot offset={[-numberConstants.FOUR, numberConstants.FOUR]}>
              <Avatar size={ICON_SIZE_LARGE} shape="circle">
                <img src={UserIcon} alt="" />
              </Avatar>
            </Badge>
            <span className={styles["text-information"]}>
              {combineText(managerObj?.email, managerObj?.name)}
            </span>
          </div>
          {/* Contract No */}
          {roundedSpacing()}
          {makeRowText(
            translate("CA.txt_contract_number", { type }),
            contractNo
          )}
          {roundedSpacing()}
          {/* Effective date */}
          {makeRowText(
            translate("CA.txt_effective_date"),
            formatDate(effectiveDate, STANDARD_DATE_FORMAT_SLASH),
            true
          )}
          {roundedSpacing()}
          {/* End date */}
          {makeRowText(
            translate("CA.txt_end_date"),
            formatDate(endDate, STANDARD_DATE_FORMAT_SLASH),
            true
          )}
          {roundedSpacing()}
          <div className={styles["text-row"]}>
            <div className={styles["text-label"]}>{`${translate(
              "CA.txt_exchange_rate"
            )}:`}</div>
            <div className={styles["text-value"]}>{formatNumber(rate)}</div>
          </div>
        </div>
      </div>
    );
  };

  const makeContractInformation = () => {
    return (
      <div className={styles["contract-information"]}>
        <Row gutter={[32, 32]}>
          {/* Type */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText("CA.txt_contract_type", contractType?.name || "")}
          </Col>
          {/* Expense */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText("CA.txt_expense_item", costGroup || "")}
          </Col>
          {/* Expense type */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText("CA.txt_expense_type", costType || "")}
          </Col>
          {/* Organization Name */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_management_unit",
              organization?.name || ""
            )}
          </Col>
          {/* Manager unit  */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_department",
              orgBusinessUnitName || ""
            )}
          </Col>
          {/* Branch */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_branch_contract_management",
              orgBusinessBranchName || ""
            )}
          </Col>
          {/* Allowed payment exceed */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_allowed_payment_exceed",
              combineText(
                `${contractType?.maxOverpaymentPercentage}%`,
                `${formatCurrency({
                  value: contractType?.maxOverpaymentAmount,
                  code: currency,
                })} ${
                  gt(contractType?.maxOverpaymentAmount, numberConstants.ZERO)
                    ? currency
                    : ""
                }`
              )
            )}
          </Col>
          {/* Contract form  */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText("CA.txt_contract_form", contractForm?.name || "")}
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div className={styles["annex-information__wrapper"]}>
      {makeNormalInformation()}
      {makeContractInformation()}
    </div>
  );
};
