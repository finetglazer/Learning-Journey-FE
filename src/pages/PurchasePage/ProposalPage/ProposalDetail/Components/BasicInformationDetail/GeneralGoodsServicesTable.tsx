import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbers, formatNumber } from "core/helpers/number";
import { ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React, { useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./BasicInformationDetail.scss";
import { convertSummaryDataInfo, SummaryDataInfo } from "./helper";

const GeneralGoodsServicesTable = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const roundNum = detectIntegerCurrency(model?.currency?.code) ? 0 : 2;

  const convertDataByCategory = convertSummaryDataInfo(
    model?.purchaseItems || []
  );

  const columns: ColumnProps<SummaryDataInfo>[] = React.useMemo(
    () => [
      {
        title: (
          <div className="p-l--2xs">{translate("PP.text_goods_services")}</div>
        ),
        ellipsis: true,
        key: "id",
        render: (_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="m-l--3xs">
                <OneLineText
                  useTooltip
                  value={translate("PP.total")}
                  className="fw-semibold"
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse m-l--3xs">
              <OneLineText useTooltip value={record?.categoryName} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PP.text_become_price")}
            unit={model?.currency?.code}
          />
        ),
        ellipsis: true,
        align: "right",
        width: 155,
        render: (_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    convertDataByCategory?.reduce((prev: number, curr) => {
                      return addNumbers(prev, curr?.totalPrice || 0);
                    }, 0),
                    roundNum
                  )}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.totalPrice || 0,
                  roundNum
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PP.text_tax")}
            unit={model?.currency?.code}
          />
        ),
        ellipsis: true,
        align: "right",
        width: 155,
        render: (_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(
                    convertDataByCategory?.reduce((prev: number, curr) => {
                      return addNumbers(prev, curr?.taxAmount || 0);
                    }, 0)
                  )}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumber(record?.taxAmount || 0)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PP.text_total")}
            unit={model?.currency?.code}
          />
        ),
        ellipsis: true,
        align: "right",
        width: 155,
        render: (_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(
                    convertDataByCategory?.reduce((prev: number, curr) => {
                      return addNumbers(prev, curr?.totalAmount || 0);
                    }, 0)
                  )}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumber(record?.totalAmount || 0)}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, model, convertDataByCategory, roundNum]
  );

  return (
    <div>
      <StandardTable
        dataSource={[{ isTotal: true }, ...convertDataByCategory]}
        scroll={{ y: "calc(100vh -320px)" }}
        columns={columns}
        rowClassName={(record) => {
          return record.isTotal ? "total-row" : "";
        }}
      />
    </div>
  );
};

export default GeneralGoodsServicesTable;
