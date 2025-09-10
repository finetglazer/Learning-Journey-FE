import { useDebounceFn } from "ahooks";
import type { ColumnProps } from "antd/es/table";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";
import { formatNumber } from "core/helpers/number";
import { trimText } from "core/helpers/text";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { Debts } from "models/ProjectSettlement";
import { useMemo } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ProjectSettlementDetailType } from "../../ProjectSettlementDetail/context";

interface DebtPaymentInformationProps
  extends Pick<ProjectSettlementDetailType, "handleChangeSingleField"> {
  list: Debts[];
  errors?: Model.Errors<Model>;
  isView?: boolean;
}

function DebtPaymentInformation({
  list,
  errors,
  isView,
  handleChangeSingleField,
}: DebtPaymentInformationProps) {
  const [translate] = useTranslation();

  const { run: handleChangeNote } = useDebounceFn(
    ({ note, contractId }: { note: string | null; contractId: string }) => {
      const trimmedText = trimText(note);
      const debts = list?.map((debt) => {
        if (isEqual(debt?.contractId, contractId)) {
          return {
            ...debt,
            note: trimmedText,
          };
        }
        return debt;
      });
      handleChangeSingleField({ fieldName: "debts" })(debts);
    },
    {
      wait: 300,
    }
  );

  const columns: ColumnProps<Debts>[] = useMemo(
    () => [
      {
        title: translate("AC.txt_table_contract_code"),
        key: "contractCode",
        dataIndex: "contractCode",
        width: 130,
        render(value: string, record) {
          return (
            <LayoutCell>
              <Link
                to={`${CONTRACT_ROUTE_VIEW}/${record?.contractId}`}
                target="_blank"
                className="hyperlink"
              >
                {value}
              </Link>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_contract_number"),
        key: "contractNo",
        dataIndex: "contractNo",
        width: 180,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_contract_name"),
        key: "contractName",
        dataIndex: "contractName",
        width: 240,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_supplier"),
        key: "supplier",
        dataIndex: "supplier",
        width: 180,
        render(value: OptionBaseModel) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PM.label_type_money"),
        key: "currency",
        dataIndex: "currency",
        width: 92,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_contract_total_value"),
        key: "contractValue",
        dataIndex: "contractValue",
        width: 160,
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
        title: translate("PS.txt_table_settlement_value"),
        key: "settlementValue",
        dataIndex: "settlementValue",
        width: 152,
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
        title: translate("PS.txt_table_paid_advance_amount"),
        key: "amountPaid",
        dataIndex: "amountPaid",
        width: 220,
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
        title: translate("PS.txt_table_amount_remaining_to_pay"),
        key: "remainingAmount",
        dataIndex: "remainingAmount",
        width: 152,
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
        title: translate("AC.txt_notes"),
        key: "note",
        dataIndex: "note",
        width: 200,
        render(value: string, record, index) {
          if (isView) {
            return (
              <LayoutCell>
                <OneLineText value={value} />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  { errors },
                  `debts[${index}].note`
                )}
                isTableCell
              >
                <InputText
                  placeHolder={translate("CT.input_note")}
                  translate={translate}
                  onChange={(value) =>
                    handleChangeNote({
                      note: value,
                      contractId: record?.contractId,
                    })
                  }
                  value={value}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
    ],
    [errors, handleChangeNote, isView, translate]
  );

  return <TableWithEmpty list={list} columns={columns} />;
}

export default DebtPaymentInformation;
