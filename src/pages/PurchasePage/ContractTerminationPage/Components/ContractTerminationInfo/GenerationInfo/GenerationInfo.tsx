import React, { useContext } from "react";
import {
  DatePicker,
  FormItem,
  InputText,
} from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { Col, Row } from "antd";
import dayjs from "dayjs";
import { Profile } from "models/Profile";
import { useAppSelector } from "rtk/useRedux";
import { useTranslation } from "react-i18next";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";

const GenerationInfo = () => {
  const { model, handleChangeSingleField, handleChangeDateField } = useContext(
    ContractTerminationDetailHookContext
  );
  const [translate] = useTranslation();
  const profile: Profile = useAppSelector((state) => state.profile);
  const isView = model?.isView;
  const creator = isView
    ? `${model?.creator?.email} - ${model?.creator?.name}`
    : `${profile?.account?.email} - ${profile?.account?.name}`;
  const organizationName = isView
    ? model?.createdOrganization?.name
    : profile?.organization?.name;
  const positionName = isView ? model?.position?.name : profile?.position?.name;
  return (
    <div>
      <Row gutter={[12, 16]}>
        <Col sm={16}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "description")}
          >
            <InputText
              isRequired
              label={translate("contractTermination.liquidation_description")}
              placeHolder={translate(
                "contractTermination.placeHolder.liquidation_description"
              )}
              value={model?.description}
              onChange={handleChangeSingleField({
                fieldName: "description",
              })}
              isSmall={false}
              maxLength={255}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <div className="d-flex gap-12">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "effectiveDate"
              )}
            >
              <DatePicker
                isRequired
                label={translate("contractTermination.liquidation_date")}
                placeholder={translate(
                  "UEI.placeholder_use_electronic_invoice_date"
                )}
                value={model.effectiveDate ? dayjs(model.effectiveDate) : null}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "effectiveDate",
                })}
                isSmall={false}
              />
            </FormItem>
          </div>
        </Col>
        <Col sm={8}>
          <FormItem>
            <InputText
              translate={translate}
              label={translate("PL.purchasing_plan_creator")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={creator}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem>
            <InputText
              translate={translate}
              label={translate("PL.purchasing_plan_creator_unit")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={organizationName}
            />
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem>
            <InputText
              translate={translate}
              label={translate("PL.purchasing_plan_title")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={positionName}
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default GenerationInfo;
