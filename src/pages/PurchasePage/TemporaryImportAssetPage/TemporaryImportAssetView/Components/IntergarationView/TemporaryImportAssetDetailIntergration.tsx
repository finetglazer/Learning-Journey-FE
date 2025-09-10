import { ColumnProps } from "antd/lib/table";
import { TABLE_ROW_KEY } from "core/config/consts";
import { useCallback, useMemo } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./TemporaryImportAssetDetailIntergration.module.scss";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { Model } from "react-3layer-common";
import appMessageService from "core/services/common-services/app-message-service";
import { AxiosError } from "axios";
import { useTemporaryImportAssetDetailHook } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetDetail/TemporaryImportAssetDetailHook";
import { temporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";

const TABLE_ID_CONTAINER = "intergration-id";

enum ColumnKey {
  BATCH_DOC_ID = "batchDocId",
  STATUS = "status",
  COMMENT = "comment",
  REQUEST_ID = "requestId",
}

const columnsWidth = {
  id: 100,
  nameAsset: 220,
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

const TemporaryImportAssetDetailIntergration = () => {
  const [translate] = useTranslation();

  const STATUS_INTERGRATION = useMemo(
    () => [
      "",
      translate("TIA.waitingForApprove"),
      translate("TIA.approved"),
      translate("TIA.reject"),
      translate("TIA.error"),
    ],
    [translate]
  );

  const { model, handleChangeAllField } = useTemporaryImportAssetDetailHook();

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleIntergration = useCallback(() => {
    temporaryImportAssetRepository
      .intergrationTempReceiptSettlement({
        id: model?.id,
        proposalType: 1,
      })
      .subscribe(
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

  const intergrationColumns: ColumnProps<Model>[] = useMemo(
    () => [
      {
        title: () => (
          <div className="p-b--xs">
            {translate("TIA.txt_intergration_batch_id")}
          </div>
        ),
        key: ColumnKey.BATCH_DOC_ID,
        dataIndex: ColumnKey.BATCH_DOC_ID,
        ellipsis: true,
        width: columnsWidth.id,
        render(batchDocId: string) {
          return (
            <LayoutCell>
              <OneLineText value={batchDocId} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="p-b--xs">{translate("TIA.txt_intergration_id")}</div>
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
            {translate("TIA.txt_intergration_status")}
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
            {translate("TIA.txt_intergration_comment")}
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
      label: translate("TIA.txt_integration_log"),
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
          {translate("TIA.intergration")}
        </Button>
      ) : null,
    },
  ];

  return (
    <>
      <div className={styles["temporary_import_asset__container"]}>
        <div className={styles["temporary_import_asset__main"]}>
          <AdvancedCollapseView
            items={items}
            defaultActiveKey={[KeyTabIntergration.INTERGRATION_LOG]}
          />
        </div>
      </div>
    </>
  );
};

export default TemporaryImportAssetDetailIntergration;
