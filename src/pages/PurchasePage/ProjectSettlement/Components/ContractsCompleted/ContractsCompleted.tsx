import type { ColumnProps } from "antd/es/table";
import classNames from "classnames";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import ValueComparison from "components/ValueComparison/ValueComparison";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { ContractSettlements } from "models/ProjectSettlement";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "../SettlementInformationComponents.module.scss";

interface ContractsCompletedProps {
  list: ContractSettlements[];
}

function ContractsCompleted({ list }: ContractsCompletedProps) {
  const [translate] = useTranslation();

  const columns: ColumnProps<ContractSettlements>[] = useMemo(
    () => [
      {
        title: (
          <UnitTitle
            title={translate("PM.numerical_order")}
            className={styles["unit--hidden"]}
          />
        ),
        width: 60,
        render(_, __, index) {
          return <LayoutCell>{index + 1}</LayoutCell>;
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_name_contract")}
            unit={translate("RG.txt_contract_po_code")}
          />
        ),
        key: "contractName",
        dataIndex: "contractName",
        render(value: string, record) {
          return (
            <LayoutCell>
              <TwoLineText
                valueLine1={value}
                valueLine2={record?.contractCode}
                classNameSecondLine="text-neutral-7"
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("RG.txt_contract_po_number")}
            className={styles["unit--hidden"]}
          />
        ),
        key: "contractNo",
        dataIndex: "contractNo",
        width: 150,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Link
                to={`${CONTRACT_ROUTE_VIEW}/${record?.contractId}`}
                target="_blank"
                className="hyperlink w-100"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <OneLineText value={value} className="hyperlink" />
              </Link>
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PM.label_type_money")}
            className={styles["unit--hidden"]}
          />
        ),
        key: "currency",
        dataIndex: "currency",
        width: 100,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PS.txt_table_contract_value")}
            className={classNames(styles["unit--hidden"], "text-nowrap")}
          />
        ),
        key: "contractValue",
        dataIndex: "contractValue",
        width: 145,
        align: "right",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(value)} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PS.txt_table_settlement_value")}
            className={styles["unit--hidden"]}
          />
        ),
        key: "settlementValue",
        dataIndex: "settlementValue",
        width: 145,
        align: "right",
        render(value: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(value)} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PP.difference")}
            className={styles["unit--hidden"]}
          />
        ),
        key: "differenceValue",
        dataIndex: "differenceValue",
        width: 165,
        align: "right",
        render(value: number) {
          return (
            <LayoutCell position="right">
              <ValueComparison value={value} isShowSigns />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("AC.txt_table_effective_date")}
            className={styles["unit--hidden"]}
          />
        ),
        key: "effectiveDate",
        dataIndex: "effectiveDate",
        width: 120,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("AC.txt_commissioning_date")}
            className={styles["unit--hidden"]}
          />
        ),
        key: "operationalDate",
        dataIndex: "operationalDate",
        width: 170,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return <TableWithEmpty list={list} columns={columns} />;
}

export default ContractsCompleted;
