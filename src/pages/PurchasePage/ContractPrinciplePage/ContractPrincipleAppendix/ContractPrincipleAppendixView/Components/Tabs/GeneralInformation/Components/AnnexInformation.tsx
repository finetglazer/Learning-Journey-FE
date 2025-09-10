import { Avatar, Badge, Col, Row, Tooltip } from "antd";
import { UserIcon } from "assets/icons";
import { CONTRACT_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { WarningCircleIcon } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/WarningCircle.Icon";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useContractPrincipleAppendixViewContext } from "../../../../context";
import styles from "./styles.module.scss";

export const AnnexInformation = () => {
  const [translate] = useTranslation();
  const { model } = useContractPrincipleAppendixViewContext();

  const type = useMemo(() => {
    const key = "CA.txt_contract";
    // if (model?.contractInfo?.contractRequestType === numberConstants.ONE) {
    //   key = "CA.txt_order";
    // }

    return translate(key);
  }, [translate]);

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
        )}:`}</div>
        <div className={styles["text-contract-no-value"]}>
          {model?.contractInfo?.contractNo}{" "}
        </div>
      </div>
    );
  };

  const getLinkFollowTicketType = () => {
    return `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${model?.contractInfo?.id}`;
  };

  const makeNormalInformation = () => {
    return (
      <div className={styles["normal-information__wrapper"]}>
        <div className={styles["title-section"]}>
          <Link
            to={getLinkFollowTicketType()}
            target="__blank"
            className={styles["title"]}
          >
            {model?.contractInfo?.code}
          </Link>
          <div className={styles["value"]}>
            {`${translate("CPA.txt_contract_principle")} ${
              model?.contractInfo?.name
            }`}

            {model?.isAdjustedContractInfo ? (
              <Tooltip
                placement="topLeft"
                title={translate("CPA.txt_adjusted")}
              >
                <div className={styles["size-24"]}>
                  <WarningCircleIcon />
                </div>
              </Tooltip>
            ) : null}
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
            <div className={styles["text-label"]}>
              {translate("CA.table_grounds_created_by")}:
            </div>{" "}
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
              "CA.txt_currency_type"
            )}:`}</div>
            <div className={styles["text-value"]}>
              {` ${model?.contractInfo?.currency}`}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const makeContractInformation = () => {
    return (
      <div className={styles["contract-information"]}>
        <Row gutter={[32, 16]}>
          {/* Type */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_type_1",
              model?.contractInfo?.contractType?.name || ""
            )}
          </Col>
          {/* Expense */}
          {/* <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_expense_item",
              model?.contractInfo?.costGroup || ""
            )}
          </Col> */}
          {/* Expense type */}
          {/* <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_expense_type",
              model?.contractInfo?.costType || ""
            )}
          </Col> */}
          {/* Organization Name */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.list.filter.management_unit",
              model?.userCreatedInfo?.createOrganization
            )}
          </Col>
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.list.title.manager",
              model?.contractInfo?.managerEmail
            )}
          </Col>
          {/* Branch */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_branch_contract_management",
              model?.contractInfo?.managerOrganizationBranch || ""
            )}
          </Col>
          {/* Manager unit  */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_department",
              model?.contractInfo?.managerOrganizationUnit || ""
            )}
          </Col>

          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_applicable_organization",
              model?.contractInfo?.applicableOrganizationName || ""
            )}
          </Col>

          {/* Divider */}
          <Col span={24}>
            <div className={styles["divider"]} />
          </Col>
          {/* Allowed payment exceed */}
          {/* <Col span={numberConstants.FOUR}>
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
          </Col> */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_applicable_branch",
              model?.contractInfo?.applicableBranchName || ""
            )}
          </Col>
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_applicable_unit",
              model?.contractInfo?.applicableUnitName || ""
            )}
          </Col>
          {/* Contract form  */}
          {/* <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_contract_form",
              model?.contractInfo?.contractMethod?.name || ""
            )}
          </Col> */}
          {/* management unit */}
          <Col span={numberConstants.FOUR}>
            {makeColumnText(
              "CA.txt_annex_create",
              `${model?.userCreatedInfo?.createUser} - ${model?.userCreatedInfo?.createFullname}` ||
                ""
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
