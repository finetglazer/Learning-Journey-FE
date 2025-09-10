import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { MAX_LENGTH_255, MAX_LENGTH_500 } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual } from "lodash";
import { ContractAnnexStatus } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { useMemo } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractPrincipleAppendixDetailContext } from "../../../context";

const SPACING = {
  gutter: [16, 12] as [Gutter, Gutter],
  span_4: 4,
  span_8: 8,
  span_16: 16,
  span_24: 24,
};

const DEFAULT_VALUE = "---";
export const BuyerInformation = () => {
  const { model, dispatch } = useContractPrincipleAppendixDetailContext();
  const [translate] = useTranslation();

  const agentPerson = useMemo(() => {
    const isCreateState = isEqual(model?.status, ContractAnnexStatus.APPROVED);

    return {
      agentPerson: isCreateState
        ? DEFAULT_VALUE
        : model?.legalInfo?.approverName,
      agentPersonPosition: isCreateState
        ? DEFAULT_VALUE
        : model?.legalInfo?.approverPosition,
    };
  }, [
    model?.legalInfo?.approverName,
    model?.legalInfo?.approverPosition,
    model?.status,
  ]);

  return (
    <Row gutter={SPACING.gutter}>
      {/* Name */}
      <Col span={SPACING.span_8}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "legalName")}
        >
          <InputText
            isRequired
            isSmall={false}
            label={translate("CA.txt_buyer_name")}
            placeHolder={translate("CA.placeholder_buyer_name")}
            value={model?.legalInfo?.name || ""}
            onChange={(value) => {
              dispatch({
                type: GeneralActionEnum.UPDATE,
                payload: {
                  ...model,
                  legalInfo: {
                    ...model?.legalInfo,
                    name: value,
                  },
                },
              });
            }}
            maxLength={MAX_LENGTH_255}
            translate={translate}
          />
        </FormItem>
      </Col>
      {/* Tax */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            isSmall={false}
            disabled
            label={translate("CA.txt_buyer_tax_code")}
            value={model?.legalInfo?.taxCode || "---"}
          />
        </FormItem>
      </Col>
      {/* Address */}
      <Col span={SPACING.span_8}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "legalAddress")}
        >
          <InputText
            isRequired
            isSmall={false}
            label={translate("CA.txt_buyer_address")}
            placeHolder={translate("CA.placeholder_buyer_address")}
            value={model?.legalInfo?.address || ""}
            onChange={(value) => {
              dispatch({
                type: GeneralActionEnum.UPDATE,
                payload: {
                  ...model,
                  legalInfo: {
                    ...model?.legalInfo,
                    address: value,
                  },
                },
              });
            }}
            maxLength={MAX_LENGTH_500}
            translate={translate}
          />
        </FormItem>
      </Col>
      {/* Representative */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            isSmall={false}
            disabled
            label={translate("CA.txt_buyer_representative")}
            value={agentPerson?.agentPerson || DEFAULT_VALUE}
          />
        </FormItem>
      </Col>
      {/* Position */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            isSmall={false}
            disabled
            label={translate("CA.txt_buyer_position")}
            value={agentPerson?.agentPersonPosition || DEFAULT_VALUE}
          />
        </FormItem>
      </Col>
    </Row>
  );
};
