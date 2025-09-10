import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { utilService } from "core/services/common-services/util-service";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { FormItem, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractAnnexDetailContext } from "../../../context";

const SPACING = {
  gutter: [12, 16] as [Gutter, Gutter],
  span_8: 8,
  span_16: 16,
};

export const AnnexInformation = () => {
  const { model, dispatch, handleChangeSingleField } =
    useContractAnnexDetailContext();
  const [translate] = useTranslation();

  return (
    <Row gutter={SPACING.gutter}>
      {/* No */}
      <Col span={SPACING.span_8}>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "contractAppendixNo"
          )}
        >
          <InputText
            isRequired
            isSmall={false}
            label={translate("CA.txt_annex_no")}
            placeHolder={translate("CA.placeholder_annex_no")}
            value={model?.contractAppendixNo}
            onChange={handleChangeSingleField({
              fieldName: "contractAppendixNo",
            })}
          />
        </FormItem>
      </Col>
      {/* Name */}
      <Col span={SPACING.span_16}>
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("CA.txt_annex_name")}
            placeHolder={translate("CA.placeholder_annex_name")}
            value={model?.name}
            onChange={handleChangeSingleField({
              fieldName: "name",
            })}
          />
        </FormItem>
      </Col>
      {/* Creator */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            disabled
            isSmall={false}
            label={translate("CA.txt_annex_create")}
            value={combineText(
              model?.userCreatedInfo?.createUser,
              model?.userCreatedInfo?.createFullname
            )}
          />
        </FormItem>
      </Col>
      {/* Unit Creator */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            disabled
            isSmall={false}
            label={translate("CA.txt_annex_unit_create")}
            value={model?.userCreatedInfo?.createOrganization}
          />
        </FormItem>
      </Col>
      {/* Position */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            disabled
            isSmall={false}
            label={translate("CA.txt_annex_position")}
            value={model?.userCreatedInfo?.createPosition}
          />
        </FormItem>
      </Col>
    </Row>
  );
};
