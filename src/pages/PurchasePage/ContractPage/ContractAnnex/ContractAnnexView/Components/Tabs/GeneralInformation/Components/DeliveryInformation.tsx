import { Col, Row } from "antd";
import { TableProps } from "antd/lib";
import { Gutter } from "antd/lib/grid/row";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import dayjs from "dayjs";
import { isEmpty, isEqual } from "lodash";
import { ReceiverInfo } from "models/ContractAnnex";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractAnnexViewContext } from "../../../../context";
import styles from "./styles.module.scss";

const SPACING = {
  gutter: [32, 24] as [Gutter, Gutter],
  span_6: 6,
  span_24: 24,
};

enum DeliveryLineTableColumns {
  Date = "shippingDate",
  Address = "address",
  Note = "note",
  DeleteAction = "deleteAction",
}

enum DeliveryLineTableWidths {
  Date = 140,
  Address = 500,
  Delete = 40,
}

const DeliveryLineTable = () => {
  const { model } = useContractAnnexViewContext();
  const [translate] = useTranslation();
  const [data, setData] = useState<ReceiverInfo[]>([]);

  useEffect(() => {
    setData([...(model?.receiverInfos || [])]);
  }, [model?.receiverInfos]);

  const makeRequireTitle = useCallback(
    (titleKey: string) => {
      return (
        <div className={styles["required-title__wrapper"]}>
          <span>{translate(titleKey)}</span>
        </div>
      );
    },
    [translate]
  );

  const columns: TableProps["columns"] = useMemo(
    () => [
      // Delivery date
      {
        title: makeRequireTitle("CA.table_delivery_date"),
        key: DeliveryLineTableColumns.Date,
        dataIndex: DeliveryLineTableColumns.Date,
        width: DeliveryLineTableWidths.Date,
        render: (date: string) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  date,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      // Delivery address
      {
        title: makeRequireTitle("CA.table_delivery_address"),
        key: DeliveryLineTableColumns.Address,
        dataIndex: DeliveryLineTableColumns.Address,
        width: DeliveryLineTableWidths.Address,
        render: (address: string) => {
          return (
            <LayoutCell>
              <OneLineText value={address} />
            </LayoutCell>
          );
        },
      },
      // Delivery note
      {
        title: translate("CA.table_delivery_note"),
        key: DeliveryLineTableColumns.Note,
        dataIndex: DeliveryLineTableColumns.Note,
        render: (note: string) => {
          return (
            <LayoutCell>
              <OneLineText value={note || "--"} />
            </LayoutCell>
          );
        },
      },
    ],
    [makeRequireTitle, translate]
  );

  return (
    <div className={styles["delivery-table__wrapper"]}>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={data}
        rowClassName={(record) => {
          const now = dayjs().utc();
          if (dayjs(record?.shippingDate).isBefore(now)) {
            return styles["disabled-row"];
          }

          return "";
        }}
      />
    </div>
  );
};

export const DeliveryInformation = () => {
  const { model } = useContractAnnexViewContext();
  const [translate] = useTranslation();

  const makeDeliveryLine = () => {
    if (!isEqual(model?.received?.id, numberConstants.ONE)) {
      if (isEmpty(model?.receiverInfos)) {
        return null;
      }

      return <DeliveryLineTable />;
    }

    return null;
  };

  const makeText = (title: string, value: string) => {
    return (
      <div className={styles["delivery-row"]}>
        <div className={styles["text-label"]}>{translate(title)}</div>
        <div className={styles["text-value"]}>{value}</div>
      </div>
    );
  };

  return (
    <Row gutter={SPACING.gutter}>
      {/* Type */}
      <Col span={SPACING.span_6}>
        {makeText(
          "CA.txt_delivery_type",
          isEqual(model?.receivedType, numberConstants.ZERO)
            ? translate("CA.txt_received_type_0")
            : translate("CA.txt_received_type_1")
        )}
      </Col>
      {/* Department */}
      <Col span={SPACING.span_6}>
        {makeText(
          "CA.txt_delivery_department",
          isEmpty(model?.receiverInfos)
            ? ""
            : model?.receiverInfos[numberConstants.ZERO]?.organizationName
        )}
      </Col>
      {/* Receiver */}
      <Col span={SPACING.span_6}>
        {makeText(
          "CA.txt_delivery_receiver",
          isEmpty(model?.receiverInfos)
            ? ""
            : model?.receiverInfos[numberConstants.ZERO]?.person
        )}
      </Col>
      {/* Phone number */}
      <Col span={SPACING.span_6}>
        {makeText(
          "CA.txt_delivery_phone_number",
          isEmpty(model?.receiverInfos)
            ? ""
            : model?.receiverInfos[numberConstants.ZERO]?.phone
        )}
      </Col>
      {/* Add View */}
      <Col span={SPACING.span_24}>{makeDeliveryLine()}</Col>
    </Row>
  );
};
