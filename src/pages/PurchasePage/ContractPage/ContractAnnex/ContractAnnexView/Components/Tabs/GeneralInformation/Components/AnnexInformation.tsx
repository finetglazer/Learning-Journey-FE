import { Avatar, Badge, Col, Row, Tooltip } from "antd";
import { UserIcon } from "assets/icons";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { gt } from "lodash";
import { useCalculatorContract } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useCaculatorContract";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { WarningCircleIcon } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/GeneralInformation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useContractAnnexViewContext } from "../../../../context";
import styles from "./styles.module.scss";

export const AnnexInformation = () => {
  const [translate] = useTranslation();
  const { model } = useContractAnnexViewContext();

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

  const { contractValue } = useCalculatorContract({
    contractValueOrigin: model?.contractInfo?.contractValue,
    goodServices: model?.contractAppendixGoodsItems,
    status: model?.status,
  });

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

  const makeContractNoView = () => {
    return (
      <div className={styles["text-contract-no-row"]}>
        <div className={styles["text-contract-no-label"]}>{`${translate(
          "CA.txt_contract_number",
          { type }
        )}`}</div>
        <div className={styles["text-contract-no-value"]}>
          {model?.contractInfo?.contractNo}
        </div>
      </div>
    );
  };

  const makeNormalInformation = () => {
    return (
      <div className={styles["normal-information__wrapper"]}>
        <div className={styles["title-section"]}>
          <div className={styles["title"]}>
            {model?.contractInfo?.name}
            {model?.isAdjustedContractInfo ? (
              <Tooltip title={translate("CA.txt_adjusted")} placement="topLeft">
                <div className={styles["size-24"]}>
                  <WarningCircleIcon />
                </div>
              </Tooltip>
            ) : null}
          </div>
          <div className={styles["total"]}>
            {`${translate("CA.txt_total_value")}:`}
            <div>{`${formatCurrency({
              value: contractValue,
              shouldRoundTwoNumber: true,
              code: model?.contractInfo?.currency,
            })} ${model?.contractInfo?.currency}`}</div>
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
              {combineText(
                model?.contractInfo?.managerEmail,
                model?.contractInfo?.managerName
              )}
            </span>
          </div>
          {/* Contract No */}
          {roundedSpacing()}
          {makeContractNoView()}
          {roundedSpacing()}
          {/* Effective date */}
          {makeRowText(
            translate("CA.txt_effective_date"),
            formatDateTimeToVietnamTimezone(
              model?.contractInfo?.effectiveDate,
              STANDARD_DATE_FORMAT_SLASH
            ),
            true
          )}
          {roundedSpacing()}
          {/* End date */}
          {makeRowText(
            translate("CA.txt_end_date"),
            formatDateTimeToVietnamTimezone(
              model?.contractInfo?.endDate,
              STANDARD_DATE_FORMAT_SLASH
            ),
            true
          )}
          {roundedSpacing()}
          <div className={styles["text-row"]}>
            <div className={styles["text-label"]}>{`${translate(
              "CA.txt_exchange_rate"
            )}:`}</div>
            <div className={styles["text-value"]}>
              {formatNumber(model?.contractInfo?.rate)}
            </div>
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
            {makeColumnText(
              "CA.txt_contract_type",
              model?.contractInfo?.contractType?.name || ""
            )}
          </Col>
          {/* Expense */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_expense_item",
              model?.contractInfo?.costGroup || ""
            )}
          </Col>
          {/* Expense type */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_expense_type",
              model?.contractInfo?.costType || ""
            )}
          </Col>
          {/* Organization Name */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.list.filter.management_unit",
              model?.userCreatedInfo?.createOrganization
            )}
          </Col>
          {/* Manager unit  */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_department",
              model?.contractInfo?.managerOrganizationUnit || ""
            )}
          </Col>
          {/* Branch */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_branch_contract_management",
              model?.contractInfo?.managerOrganizationBranch || ""
            )}
          </Col>
          {/* Allowed payment exceed */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_allowed_payment_exceed",
              combineText(
                `${model?.contractInfo?.contractType?.maxOverpaymentPercentage}%`,
                `${formatCurrency({
                  value:
                    model?.contractInfo?.contractType?.maxOverpaymentAmount,
                  code: model?.contractInfo?.currency,
                })} ${
                  gt(
                    model?.contractInfo?.contractType?.maxOverpaymentAmount,
                    numberConstants.ZERO
                  )
                    ? model?.contractInfo?.currency
                    : ""
                }`
              )
            )}
          </Col>
          {/* Contract form  */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_form",
              model?.contractInfo?.contractMethod?.name || ""
            )}
          </Col>
          {/* management unit */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_management_unit",
              model?.contractInfo?.managerOrganizationName || ""
            )}
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
