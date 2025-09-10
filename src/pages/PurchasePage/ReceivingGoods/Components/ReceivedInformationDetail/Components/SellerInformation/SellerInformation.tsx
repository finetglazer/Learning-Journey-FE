import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { uniqueId } from "lodash";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useMemo, useRef } from "react";
import {
  FormItem,
  InputText,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ItemTable } from "../../../ItemTable/ItemTable";
import styles from "../../ReceivedInformationDetail.module.scss";
import {
  MAX_LENGTH_20,
  MAX_LENGTH_255,
  NOT_TAB_ENTER_REGEX,
  PHONE_NUMBER_REGEX,
} from "core/config/consts";
import { Model } from "react-3layer-common";

export const SellerInformation = () => {
  const { model, isEditable, handleChangeSingleField } =
    useReceivingGoodsDetailContext();
  const [translate] = useTranslation();
  const refDisableTranslate = useRef([]);
  const columnsTop = useMemo(
    () => [
      {
        title: translate("RG.txt_supplier"),
        content: (
          <OneLineText
            value={model?.contractInfo?.contractSupplier?.supplier?.name}
          />
        ),
      },
      {
        title: translate("RG.txt_receiver_tax_id"),
        content: model?.contractInfo?.contractSupplier?.supplier?.taxCode,
      },
      {
        title: translate("RG.txt_address"),
        content: (
          <OneLineText value={model?.contractInfo?.contractSupplier?.address} />
        ),
      },
    ],
    [
      model?.contractInfo?.contractSupplier?.address,
      model?.contractInfo?.contractSupplier?.supplier?.name,
      model?.contractInfo?.contractSupplier?.supplier?.taxCode,
      translate,
    ]
  );

  const handleUpdateRefTranslate = (property = "deliveryPersonName") => {
    if (!refDisableTranslate.current.includes(property)) {
      refDisableTranslate.current = [...refDisableTranslate.current, property];
    }
  };

  const getTranslate = (value: string) => {
    return !refDisableTranslate?.current?.includes(value)
      ? undefined
      : translate;
  };

  const columnsBottom = useMemo(
    () => [
      {
        title: translate("RG.txt_sender_full_name"),
        content: isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "deliveryPersonName"
            )}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("RG.txt_sender_full_name")}
              onChange={(val) => {
                handleUpdateRefTranslate("deliveryPersonName");
                handleChangeSingleField({
                  fieldName: "deliveryPersonName",
                })(val);
              }}
              translate={getTranslate("deliveryPersonName")}
              maxLength={MAX_LENGTH_255}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={model?.deliveryPersonName}
            />
          </FormItem>
        ) : (
          model?.deliveryPersonName
        ),
      },
      {
        title: translate("RG.txt_sender_phone"),
        content: isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "deliveryPersonPhone"
            )}
          >
            <InputText
              isRequired
              isSmall={false}
              label={translate("RG.txt_sender_phone")}
              onChange={(val) => {
                handleUpdateRefTranslate("deliveryPersonPhone");
                handleChangeSingleField({
                  fieldName: "deliveryPersonPhone",
                })(val);
              }}
              translate={getTranslate("deliveryPersonPhone")}
              maxLength={MAX_LENGTH_20}
              regexInput={PHONE_NUMBER_REGEX}
              value={model?.deliveryPersonPhone}
            />
          </FormItem>
        ) : (
          model?.deliveryPersonPhone
        ),
      },
      {
        title: translate("RG.txt_sender_position"),
        content: isEditable ? (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "deliveryPersonPosition"
            )}
          >
            <InputText
              isSmall={false}
              label={translate("RG.txt_sender_position")}
              onChange={handleChangeSingleField({
                fieldName: "deliveryPersonPosition",
              })}
              translate={translate}
              maxLength={MAX_LENGTH_255}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={model?.deliveryPersonPosition}
            />
          </FormItem>
        ) : (
          model?.deliveryPersonPosition
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
          {isEditable ? null : (
            <tr>
              {columnsBottom.map((props) => (
                <ItemTable key={uniqueId()} {...props} />
              ))}
            </tr>
          )}
        </tbody>
      </table>
      {isEditable ? (
        <Row gutter={12} className="mt-3 mb-4">
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
