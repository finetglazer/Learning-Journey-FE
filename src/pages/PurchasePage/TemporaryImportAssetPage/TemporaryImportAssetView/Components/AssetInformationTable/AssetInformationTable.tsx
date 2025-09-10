import {
  FormItem,
  LayoutCell,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";

import { Table, Tooltip } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
} from "config/route-const";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";
import { TemporaryImportAssetViewModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { countTotal } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetDetail/Components/AssetInformationTable/helper";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { TemporaryImportAssetViewHookContext } from "../../TemporaryImportAssetViewHook";
import "./AssetInformationTableStyled.scss";
import { COLUMNS } from "./helper";

const AssetInformationTable = () => {
  const { model, translate } = useContext<TemporaryImportAssetViewModel>(
    TemporaryImportAssetViewHookContext
  );

  const columns = [
    {
      title: () => (
        <div className="title uni mt">
          <div> {translate("TIA.txt_asset_name")}</div>
          <span>{translate("TIA.txt_asset_code")}</span>
        </div>
      ),
      width: 280,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <TwoLineText
              valueLine1={data?.goodsReceiptRequestAsset?.asset?.name}
              valueLine2={data?.goodsReceiptRequestAsset?.asset?.code}
              classNameSecondLine="text-neutral-7"
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_asset_origin_no")}</div>
      ),
      width: 140,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.goodsReceiptRequestAsset?.originNo}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_asset_quantity")}</div>
      ),
      width: 100,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={formatNumber(
                data?.goodsReceiptRequestAsset?.quantity || 0
              )}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="title currency mt">
          <div>{translate("TIA.txt_input_value_term")}</div>
          <span>VND</span>
        </div>
      ),
      width: 180,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        if (data?.children) {
          return (
            <OneLineText
              className="line-height-22 right-content pr-16"
              value={formatNumber(countTotal(data?.children || 0))}
            />
          );
        }

        return (
          <LayoutCell position="right" className="term-value-input">
            <FormItem isTableCell={true}>
              <span>{formatNumber(data?.amount)}</span>
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div className="mt">{translate("TIA.txt_type")}</div>,
      width: 140,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText className="line-height-22" value={data?.classify} />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_depreciation_month")}</div>
      ),
      width: 140,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.depreciationMonths}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_serial_number")}</div>
      ),
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.goodsReceiptRequestAsset?.serialNumber}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_receipt_date")}</div>
      ),
      width: 168,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.usageStartDate
                  ? formatDateTimeToVietnamTimezone(
                      data?.goodsReceiptRequestAsset?.usageStartDate,
                      STANDARD_DATE_FORMAT_SLASH
                    )
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_good_code_receipt")}</div>
      ),
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <Link
              to={`${ACCEPTANCE_DETAIL_ROUTE}/${data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.goodsReceiptRequest?.acceptance?.id}`}
              target="_blank"
              className={"text-decoration-none"}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <OneLineText
                className="text-table-content-primary text-first__style "
                value={
                  data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                    ?.goodsReceiptRequest?.acceptance?.code
                }
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_asset_code_receipt")}</div>
      ),
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <Link
              to={`${RECEIVING_GOODS_DETAIL_ROUTE}/${data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.goodsReceiptRequest?.id}`}
              target="_blank"
              className={"text-decoration-none"}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <OneLineText
                className="text-table-content-primary text-first__style "
                value={
                  data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                    ?.goodsReceiptRequest?.code
                }
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="title uni mt">
          <div> {translate("TIA.txt_receiving_unit_and_in_charge")}</div>
          <span>{translate("TIA.txt_receiver_and_in_charge")}</span>
        </div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        const goodsReceiptRequest =
          data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
            ?.goodsReceiptRequest;
        return (
          <LayoutCell className="column start">
            <OneLineText
              className="unit-name"
              value={goodsReceiptRequest?.recipientUnitName}
            />
            <Tooltip
              title={`${goodsReceiptRequest?.receiptPersonEmail} - ${goodsReceiptRequest?.receiptPerson}`}
              overlayStyle={{ maxWidth: "500px" }}
            >
              <div className="d-inline-block text-in-table-cell text-truncate w-100 line-text second-line text-second__style">
                {goodsReceiptRequest?.receiptPersonEmail}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div className="mt">{translate("TIA.txt_brand_type")}</div>,
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.branch?.name
              }
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_receipt_note")}</div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.note
              }
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_goods_service")}</div>
      ),
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <TwoLineText
              classNameSecondLine="text-second__style"
              valueLine1={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.name
              }
              valueLine2={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.code
              }
              useTooltip
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">
          {translate("TIA.txt_goods_service_description")}
        </div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.description
              }
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_goods_service_note")}</div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.note
              }
            />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div className="asset-infor-table-wrapper-view">
      <StandardTable
        className="asset-custom_table"
        idContainer="asset-status"
        rowKey="id"
        dataSource={model?.tempReceiptItems}
        scroll={{ y: "calc(100vh - 470px)" }}
        columns={columns}
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) => {
            return (
              <div
                className="collslap-td"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(record, e);
                }}
              >
                <img
                  className={classNames("cursor-pointer m-x--3xs", {
                    "rotate-180": expanded,
                    "rotate-0": !expanded,
                  })}
                  src={IcArrowDown}
                  alt="img"
                  width={10}
                  height={10}
                />
              </div>
            );
          },
        }}
        summary={() => {
          const summaryCells = Array.from({ length: 15 }, (_, index) => {
            if (index === COLUMNS.SHOW_LABEL_TOTAL) {
              return (
                <Table.Summary.Cell key={index} index={index}>
                  {translate("TIA.txt_sum")}
                </Table.Summary.Cell>
              );
            }
            if (index === COLUMNS.SHOW_VALUE_TOTAL) {
              return (
                <Table.Summary.Cell
                  key={index}
                  index={index}
                  className="right-content"
                >
                  {formatNumber(model?.totalAmount || 0)}
                </Table.Summary.Cell>
              );
            }
            return (
              <Table.Summary.Cell
                key={index}
                index={index}
              ></Table.Summary.Cell>
            );
          });

          return (
            <Table.Summary fixed="top">
              {model?.tempReceiptItems?.length > 0 && (
                <Table.Summary.Row>{summaryCells}</Table.Summary.Row>
              )}
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default AssetInformationTable;
