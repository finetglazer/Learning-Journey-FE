import { ColumnProps } from "antd/lib/table";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { t } from "i18next";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";
import { Tooltip } from "antd";

const ColumnsAssets = (): ColumnProps<SelectAsset>[] => {
  return [
    {
      title: () => <div>{t("TIA.txt_goods_service")}</div>,
      dataIndex: "name",
      key: "name",
      width: 350,
      ellipsis: true,
      render: (_, data: SelectAsset) => {
        return (
          <LayoutCell className="cell-box">
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.name
              }
            />
            <div className="line-height-22 column-code">
              {
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.contractGoodsItem?.code
              }
            </div>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div>{t("TIA.txt_brand_type")}</div>,
      width: 140,
      ellipsis: true,
      render: (_, data: SelectAsset) => {
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
      title: () => <div className="text-nowrap">{t("TIA.txt_asset_code")}</div>,
      width: 120,
      ellipsis: true,
      render: (_, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.goodsReceiptRequestAsset?.asset?.code}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div>{t("TIA.txt_receiver_and_in_charge")}</div>,
      width: 200,
      ellipsis: true,
      render: (_, data: SelectAsset) => {
        return (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.goodsReceiptRequest?.receiptPersonEmail} - ${data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.goodsReceiptRequest?.receiptPerson}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {
                  data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                    ?.goodsReceiptRequest?.receiptPersonEmail
                }
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div>{t("TIA.txt_receiving_unit_and_in_charge")}</div>,
      width: 200,
      ellipsis: true,
      render: (_, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
                  ?.goodsReceiptRequest?.recipientUnitName
              }
            />
          </LayoutCell>
        );
      },
    },
  ];
};

export default ColumnsAssets;
