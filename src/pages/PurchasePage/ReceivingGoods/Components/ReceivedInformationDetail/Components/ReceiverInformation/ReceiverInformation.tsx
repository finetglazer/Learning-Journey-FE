import { Col, Row } from "antd";
import { NUMBER_MAX_13 } from "config/const";
import {
  NUMBER_TYPE_INPUT,
  STANDARD_DATE_FORMAT_SLASH,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import {
  convertUTCTimeToVietnamTimezone,
  disableFutureDates,
  formatDateTimeToVietnamTimezone,
} from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { isEqual, uniqueId } from "lodash";
import { combineNameAndCode } from "pages/PurchasePage/constants";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useMemo } from "react";
import {
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ItemTable } from "../../../ItemTable/ItemTable";
import styles from "../../ReceivedInformationDetail.module.scss";

export const ReceiverInformation = () => {
  const { model, isEditable, handleChangeSingleField } =
    useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const columnsTop = useMemo(
    () => [
      {
        title: translate("RG.txt_receiver_name"),
        content: <OneLineText value={model?.contractInfo?.legalEntity?.name} />,
      },
      {
        title: translate("RG.txt_receiver_tax_id"),
        content: model?.contractInfo?.legalEntity?.taxCode,
      },
      {
        title: translate("RG.txt_receiver_address"),
        content: (
          <OneLineText value={model?.contractInfo?.legalEntity?.address} />
        ),
      },
    ],
    [
      model?.contractInfo?.legalEntity?.address,
      model?.contractInfo?.legalEntity?.name,
      model?.contractInfo?.legalEntity?.taxCode,
      translate,
    ]
  );

  const columnsCenterUpper = useMemo(
    () => [
      {
        title: translate("RG.txt_receiver_unit"),
        content: model?.contractInfo?.receiverUnitName,
      },
      {
        title: translate("RG.txt_receiver_branch"),
        content: combineNameAndCode(
          model?.contractInfo?.receiverOrganizationDetail?.businessBranch?.code,
          model?.contractInfo?.receiverOrganizationDetail?.businessBranch?.name
        ),
      },
      {
        title: translate("RG.txt_receiver_bank_unit"),
        content: combineNameAndCode(
          model?.contractInfo?.receiverOrganizationDetail?.businessUnit?.code,
          model?.contractInfo?.receiverOrganizationDetail?.businessUnit?.name
        ),
      },
    ],
    [
      model?.contractInfo?.receiverOrganizationDetail?.businessUnit?.code,
      model?.contractInfo?.receiverOrganizationDetail?.businessUnit?.name,
      model?.contractInfo?.receiverOrganizationDetail?.businessBranch?.code,
      model?.contractInfo?.receiverOrganizationDetail?.businessBranch?.name,
      model?.contractInfo?.receiverUnitName,
      translate,
    ]
  );

  const columnsCenterLower = useMemo(
    () => [
      {
        title: translate("RG.txt_receiver_full_name"),
        content: isEditable ? (
          <FormItem>
            <InputText
              label={translate("RG.txt_receiver_full_name")}
              isSmall={false}
              value={combineNameAndCode(
                model?.contractInfo?.receiverEmail,
                model?.contractInfo?.receiverName
              )}
              readOnly
            />
          </FormItem>
        ) : (
          combineNameAndCode(
            model?.contractInfo?.receiverEmail,
            model?.contractInfo?.receiverName
          )
        ),
      },
      {
        title: translate("RG.txt_receiver_phone_full"),
        content: isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "receiptPersonPhone"
            )}
          >
            <InputText
              isRequired
              label={translate("RG.txt_receiver_phone_full")}
              isSmall={false}
              value={model?.receiptPersonPhone}
              onChange={handleChangeSingleField({
                fieldName: "receiptPersonPhone",
              })}
            />
          </FormItem>
        ) : (
          model?.receiptPersonPhone
        ),
      },
      {
        title: translate("RG.txt_receiver_position"),
        content: isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "receiptPersonPosition"
            )}
          >
            <InputText
              isSmall={false}
              label={translate("RG.txt_receiver_position")}
              value={model?.receiptPersonPosition}
              onChange={handleChangeSingleField({
                fieldName: "receiptPersonPosition",
              })}
            />
          </FormItem>
        ) : (
          model?.receiptPersonPosition
        ),
      },
    ],
    [handleChangeSingleField, isEditable, model, translate]
  );
  const columnsBottom = useMemo(
    () => [
      {
        title: translate("RG.txt_actual_receipt_date"),
        content: isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(model, "receiptDate")}
          >
            <DatePicker
              isSmall={false}
              isRequired
              placeholder={STANDARD_DATE_FORMAT_SLASH.toLowerCase()}
              label={translate("RG.txt_actual_receipt_date")}
              value={
                model?.receiptDate
                  ? convertUTCTimeToVietnamTimezone(model?.receiptDate)
                  : undefined
              }
              onChange={handleChangeSingleField({
                fieldName: "receiptDate",
              })}
              disabledDate={disableFutureDates}
            />
          </FormItem>
        ) : (
          formatDateTimeToVietnamTimezone(
            model?.receiptDate,
            STANDARD_DATE_FORMAT_SLASH
          )
        ),
      },
      {
        title: translate("RG.txt_exchange_rate"),
        content: isEqual(
          model?.currency,
          VND_CURRENCY_UNIT
        ) ? null : isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(model, "exchangeRate")}
          >
            <InputNumber
              isRequired
              isSmall={false}
              label={translate("RG.txt_exchange_rate")}
              value={model?.exchangeRate}
              onChange={handleChangeSingleField({
                fieldName: "exchangeRate",
              })}
              max={NUMBER_MAX_13}
              min={-NUMBER_MAX_13}
              numberType={NUMBER_TYPE_INPUT}
              readOnly
            />
          </FormItem>
        ) : (
          formatNumber(model?.exchangeRate)
        ),
      },
    ],
    [handleChangeSingleField, isEditable, model, translate]
  );

  return (
    <>
      <table className={styles["table"]}>
        <tbody>
          <tr className={styles["bg-grey"]}>
            {columnsTop.map((props) => (
              <ItemTable key={uniqueId()} {...props} />
            ))}
          </tr>
          <tr>
            {columnsCenterUpper.map((props) => (
              <ItemTable key={uniqueId()} {...props} />
            ))}
          </tr>
          {isEditable ? null : (
            <>
              <tr>
                {columnsCenterLower.map((props) => (
                  <ItemTable key={uniqueId()} {...props} />
                ))}
              </tr>
              <tr>
                {columnsBottom.map((props) => (
                  <ItemTable key={uniqueId()} {...props} />
                ))}
                <td />
              </tr>
            </>
          )}
        </tbody>
      </table>

      {isEditable ? (
        <Row gutter={[12, 16]} className="mt-3 mb-4">
          {columnsCenterLower.map((props, index) => (
            <Col span={8} key={index}>
              {props.content}
            </Col>
          ))}
          {columnsBottom.map((props, index) => (
            <Col span={8} key={index}>
              {props.content}
            </Col>
          ))}
        </Row>
      ) : null}
    </>
  );
};
