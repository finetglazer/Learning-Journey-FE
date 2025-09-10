import { ColumnProps } from "antd/lib/table";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { TABLE_ROW_KEY } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { ReceivedGoodIntergration } from "models/ReceivingGood";
import { useCallback, useMemo } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ReceivedGoodsDetailIntergration.module.scss";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { Model } from "react-3layer-common";
import { useReceivingGoodsDetailContext } from "../../ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { receivedGoodsRepository } from "../../ReceivedGoodRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { AxiosError } from "axios";

const TABLE_ID_CONTAINER = "intergration-id";

enum ColumnKey {
  ORIGIN_NO = "originNo",
  ASSET_CODE = "assetCode",
  ASSET_NAME = "assetName",
  ASSET_QUANTITY = "assetQuantity",
  ASSET_ORIGINAL_PRICE = "assetOriginalPrice",
  ASSET_SERIAL_NUMBER = "assetSerialNumber",
  ASSET_OWNER = "assetOwner",
  ASSET_CLASSIFY = "assetClassify",
  ASSET_DESC = "assetDesc",
  ORIGINAL_PRICE = "originalPrice",
  STATUS = "status",
  COMMENT = "comment",
  REQUEST_ID = "requestId",
}

const columnsWidth = {
  id: 100,
  nameAsset: 220,
  quantity: 80,
  codeGoodServiceCode: 100,
  nameGoodServiceCode: 200,
  brandName: 140,
  personCharge: 150,
  serialNumber: 140,
  receivedDate: 100,
};

export enum KeyTabIntergration {
  INTERGRATION_LOG = "intergration-log",
  GOODS_SERVISES_TABLE = "goods-service-table",
}

const ReceivedGoodsDetailIntergration = () => {
  const [translate] = useTranslation();

  const STATUS_INTERGRATION = useMemo(
    () => [
      "",
      translate("RG.waitingForApprove"),
      translate("RG.approved"),
      translate("RG.reject"),
      translate("RG.error"),
    ],
    [translate]
  );

  const { model, handleChangeAllField } = useReceivingGoodsDetailContext();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleIntergration = useCallback(() => {
    receivedGoodsRepository.intergrationGoodsReceipt(model?.id).subscribe(
      (res) => {
        if (
          res?.data?.statusIntergrationAssetInfos &&
          res?.data?.statusIntergrationAssetInfos?.length > 0
        ) {
          handleChangeAllField({
            ...model,
            statusIntergrationAssetInfos:
              res?.data?.statusIntergrationAssetInfos,
          });
        }
        if (res?.data?.message && res?.data?.status === "01") {
          notifyToast({
            type: "error",
            message: res?.data?.message,
          });
        }
      },
      (error: AxiosError) => {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
      }
    );
  }, [handleChangeAllField, model, notifyToast]);

  const goodsServicescolumns: ColumnProps<ReceivedGoodIntergration>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_origin_no")}</div>
        ),
        key: ColumnKey.ORIGIN_NO,
        dataIndex: ColumnKey.ORIGIN_NO,
        ellipsis: true,
        width: columnsWidth.nameAsset,
        render(originNo: string) {
          return (
            <LayoutCell>
              <OneLineText value={originNo} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs"> {translate("RG.txt_asset_code")}</div>
        ),
        key: ColumnKey.ASSET_CODE,
        dataIndex: ColumnKey.ASSET_CODE,
        ellipsis: true,
        width: columnsWidth.nameAsset,
        render(assetCode: string) {
          return (
            <LayoutCell>
              <OneLineText value={assetCode} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="p-b--xs"> {translate("RG.txt_asset_name")}</div>
        ),
        key: ColumnKey.ASSET_NAME,
        dataIndex: ColumnKey.ASSET_NAME,
        width: columnsWidth.nameAsset,
        ellipsis: true,
        render(assetName: string) {
          return (
            <LayoutCell>
              <OneLineText value={assetName} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_asset_quantity")}</div>
        ),
        key: ColumnKey.ASSET_QUANTITY,
        dataIndex: ColumnKey.ASSET_QUANTITY,
        width: columnsWidth.codeGoodServiceCode,
        ellipsis: true,
        render(assetQuantity: number) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText value={formatNumber(assetQuantity)} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <UnitTitle
            className="align-items-end"
            title={translate("RG.txt_original_price")}
          />
        ),
        key: ColumnKey.ASSET_ORIGINAL_PRICE,
        dataIndex: ColumnKey.ASSET_ORIGINAL_PRICE,
        ellipsis: true,
        width: columnsWidth.codeGoodServiceCode,
        render(originalPrice: number) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText value={formatNumber(originalPrice)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_serial_numbers")}</div>
        ),
        key: ColumnKey.ASSET_SERIAL_NUMBER,
        dataIndex: ColumnKey.ASSET_SERIAL_NUMBER,
        ellipsis: true,
        width: columnsWidth.serialNumber,
        render(serialNumber: string) {
          return (
            <LayoutCell>
              <OneLineText value={serialNumber} />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_person_charge")}</div>
        ),
        key: ColumnKey.ASSET_OWNER,
        dataIndex: ColumnKey.ASSET_OWNER,
        ellipsis: true,
        width: columnsWidth.personCharge,
        render(assetOwner: string) {
          return (
            <LayoutCell>
              <OneLineText value={assetOwner} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_asset_classify")}</div>
        ),
        key: ColumnKey.ASSET_CLASSIFY,
        dataIndex: ColumnKey.ASSET_CLASSIFY,
        width: columnsWidth.id,
        ellipsis: true,
        render(assetClassify: string) {
          return (
            <LayoutCell>
              <OneLineText value={assetClassify} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_asset_description")}</div>
        ),
        key: ColumnKey.ASSET_DESC,
        dataIndex: ColumnKey.ASSET_DESC,
        width: columnsWidth.nameAsset,
        ellipsis: true,
        render(assetClassify: string) {
          return (
            <LayoutCell>
              <OneLineText value={assetClassify} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const intergrationColumns: ColumnProps<Model>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="p-b--xs">{translate("RG.txt_intergration_id")}</div>
        ),
        key: ColumnKey.REQUEST_ID,
        dataIndex: ColumnKey.REQUEST_ID,
        ellipsis: true,
        width: 350,
        render(id: string) {
          return (
            <LayoutCell>
              <OneLineText value={id} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">
            {translate("RG.txt_intergration_status")}
          </div>
        ),
        key: ColumnKey.STATUS,
        dataIndex: ColumnKey.STATUS,
        ellipsis: true,
        width: 250,
        render(status: number) {
          return (
            <LayoutCell>
              <OneLineText value={STATUS_INTERGRATION[status]} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">
            {translate("RG.txt_intergration_comment")}
          </div>
        ),
        key: ColumnKey.COMMENT,
        dataIndex: ColumnKey.COMMENT,
        ellipsis: true,
        render(comment: string) {
          return (
            <LayoutCell>
              <OneLineText value={comment} />
            </LayoutCell>
          );
        },
      },
    ],
    [STATUS_INTERGRATION, translate]
  );

  const items = [
    {
      key: KeyTabIntergration.INTERGRATION_LOG,
      label: translate("RG.txt_integration_log"),
      children: (
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={intergrationColumns}
          dataSource={model?.statusIntergrationAssetInfos}
          isDragable={true}
          scroll={{ y: "calc(100vh - 360px)" }}
          idContainer={TABLE_ID_CONTAINER}
        />
      ),
      extra: model?.canIntergrationAsset ? (
        <Button
          iconPlace="right"
          type="primary"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            handleIntergration();
          }}
        >
          {translate("RG.intergration")}
        </Button>
      ) : null,
    },
    {
      key: KeyTabIntergration.GOODS_SERVISES_TABLE,
      label: translate("RG.txt_integrate_qlts"),
      children: (
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={goodsServicescolumns}
          dataSource={model?.assetInfos}
          isDragable={true}
          scroll={{ y: "calc(100vh - 360px)" }}
          idContainer={TABLE_ID_CONTAINER}
        />
      ),
    },
  ];

  return (
    <>
      <div className={styles["received-good__container"]}>
        <div className={styles["received-good__main"]}>
          <AdvancedCollapseView
            items={items}
            defaultActiveKey={[
              KeyTabIntergration.GOODS_SERVISES_TABLE,
              KeyTabIntergration.INTERGRATION_LOG,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default ReceivedGoodsDetailIntergration;
