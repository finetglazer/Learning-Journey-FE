import { useMemo } from "react";
import { ColumnProps } from "antd/lib/table";

import {
  LayoutCell,
  Modal,
  OneLineText,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { isEqual } from "lodash";

import { useCentralPurchaseUnitViewHook } from "./CentralPurchaseUnitViewHook";
import { EmptyData } from "components";
import { CentralPurchaseUnit } from "models/CentralPurchaseUnit";
import { TABLE_ROW_KEY, WIDTH_800 } from "core/config/consts";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import styles from "./CentralPurchaseUnitView.module.scss";

enum ColumnKey {
  NAME = "name",
  PHONE_NUMBER = "phoneNumber",
  EMAIL = "email",
}

const columnsWidth = {
  name: 200,
  phoneNumber: 140,
};

export interface CentralPurchaseUnitViewProps {
  centralPurchaseUnitId: string;
  dismiss: () => void;
}

const CentralPurchaseUnitView = ({
  centralPurchaseUnitId,
  dismiss,
}: CentralPurchaseUnitViewProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useCentralPurchaseUnitViewHook(centralPurchaseUnitId);

  const columns: ColumnProps<CentralPurchaseUnit["contacts"]>[] = useMemo(
    () => [
      {
        title: translate("CPU.txt_central_purchase_unit_contact_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(name: string) {
          return (
            <LayoutCell>
              <div className={styles["name-cell"]}>
                <OneLineText value={name} />
                {name && (
                  <OneLineText
                    className={styles["name-cell-account-text"]}
                    value={name}
                  />
                )}
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPU.txt_central_purchase_unit_phone_number"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        ellipsis: true,
        width: columnsWidth.phoneNumber,
        render(phoneNumber: string) {
          return (
            <LayoutCell>
              <OneLineText value={phoneNumber} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CPU.txt_central_purchase_unit_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        ellipsis: true,
        render(email: string) {
          return (
            <LayoutCell>
              <OneLineText className={styles["email-cell"]} value={email} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";

    return (
      <div className={styles["main-section"]}>
        {/* Status */}
        <Tag
          size="md"
          value={value}
          status={statusValue}
          isShowDot={false}
          isShowBorder
          className={styles["status-tag"]}
        />

        {/* Name */}
        <span className={styles["text-name"]}>{model?.organization?.name}</span>

        {/* Code */}
        <div className={styles["code-container"]} onClick={copyToClipboard}>
          <span className={styles["text-code"]}>
            {model?.organization?.code}
          </span>
          <img src={CopySvg} alt="copy" />
        </div>
      </div>
    );
  };

  return (
    <Modal
      open
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("CPU.txt_view_detail_central_purchase_unit")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={WIDTH_800}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className={styles["wrapper"]}>
        <MainSection />

        <div className={styles["text-title"]}>
          {translate("CPU.informationReceiversHD")}
        </div>
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={isLoading}
          columns={columns}
          dataSource={model?.informationReceiverHDs}
          scroll={{ y: "calc(100vh - 300px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={700}
              />
            ),
          }}
        />

        <div className={styles["text-title"]}>
          {translate("CPU.informationReceiversPAMS")}
        </div>
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={isLoading}
          columns={columns}
          dataSource={model?.informationReceiverPAMSs}
          scroll={{ y: "calc(100vh - 300px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={700}
              />
            ),
          }}
        />
      </div>
    </Modal>
  );
};

export default CentralPurchaseUnitView;
