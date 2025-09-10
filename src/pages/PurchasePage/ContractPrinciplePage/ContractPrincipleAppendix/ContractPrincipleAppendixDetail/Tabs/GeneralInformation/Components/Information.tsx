import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { MAX_LENGTH_255, MAX_LENGTH_500 } from "core/config/consts";
import { convertUTCTimeToVietnamTimezone } from "core/helpers/date-time";
import { combineText } from "core/helpers/text";
import { utilService } from "core/services/common-services/util-service";
import CommonFilter from "models/CommonFilter";
import { annexType } from "pages/PurchasePage/ContractPrinciplePage/constants";
import {
  DatePicker,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import { useContractPrincipleAppendixDetailContext } from "../../../context";

const SPACING = {
  gutter: [12, 16] as [Gutter, Gutter],
  span_8: 8,
  span_16: 16,
  span_24: 24,
};

export const Information = () => {
  const {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
  } = useContractPrincipleAppendixDetailContext();
  const [translate] = useTranslation();

  const profile = useAppSelector((state) => state.profile);

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
            label={translate("CPA.txt_annex_no")}
            placeHolder={translate("CPA.placeholder_annex_no")}
            value={model?.contractAppendixNo || ""}
            onChange={handleChangeSingleField({
              fieldName: "contractAppendixNo",
            })}
            maxLength={MAX_LENGTH_255}
            translate={translate}
          />
        </FormItem>
      </Col>
      {/* Date */}
      <Col span={SPACING.span_8}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "appendixDate")}
        >
          <DatePicker
            isRequired
            isSmall={false}
            label={translate("CPA.txt_annex_date")}
            placeholder={translate("CPA.placeholder_annex_date")}
            value={
              model?.appendixDate
                ? convertUTCTimeToVietnamTimezone(model?.appendixDate)
                : undefined
            }
            onChange={handleChangeDateField({
              fieldName: "appendixDate",
            })}
          />
        </FormItem>
      </Col>
      {/* Adjust type */}
      <Col span={SPACING.span_8}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "adjustmentType")}
        >
          <Select
            isRequired
            isSmall={false}
            isEnumerable={false}
            classFilter={CommonFilter}
            getList={annexType}
            label={translate("CPA.txt_adjust_type")}
            placeHolder={translate("CPA.placeholder_adjust_type")}
            value={model?.adjustmentTypeValue}
            onChange={handleChangeSelectField({
              fieldName: "adjustmentTypeValue",
            })}
            render={(item) => item?.name}
          />
        </FormItem>
      </Col>
      {/* Name */}
      <Col span={SPACING.span_24}>
        <FormItem validateObject={utilService.getValidateObj(model, "name")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("CPA.txt_annex_name")}
            placeHolder={translate("CPA.placeholder_annex_name")}
            value={model?.name || ""}
            onChange={handleChangeSingleField({
              fieldName: "name",
            })}
            maxLength={MAX_LENGTH_500}
            translate={translate}
          />
        </FormItem>
      </Col>
      {/* Creator */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            disabled
            isSmall={false}
            label={translate("CPA.txt_creator")}
            value={combineText(profile?.account?.email, profile?.account?.name)}
          />
        </FormItem>
      </Col>
      {/* Unit Creator */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            disabled
            isSmall={false}
            label={translate("CPA.txt_unit_create")}
            value={profile?.organization?.name}
          />
        </FormItem>
      </Col>
      {/* Position */}
      <Col span={SPACING.span_8}>
        <FormItem>
          <InputText
            disabled
            isSmall={false}
            label={translate("CPA.txt_position")}
            value={profile?.position?.name}
          />
        </FormItem>
      </Col>
    </Row>
  );
};
