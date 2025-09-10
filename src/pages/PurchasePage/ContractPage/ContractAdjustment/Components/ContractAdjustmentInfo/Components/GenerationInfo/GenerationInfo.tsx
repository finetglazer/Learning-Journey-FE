import React, { useContext } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { Col, Row } from "antd";
import { Profile } from "models/Profile";
import { useAppSelector } from "rtk/useRedux";
import { useTranslation } from "react-i18next";
import { isEqual } from "lodash";
import { ContractRequestType } from "models/ContractAdjustment";
import { ContractAdjustmentContext } from "pages/PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentDetail/ContractAdjustmentDetailHook";

const GenerationInfo = () => {
  const { model, handleChangeSingleField } = useContext(
    ContractAdjustmentContext
  );
  const [translate] = useTranslation();
  const profile: Profile = useAppSelector((state) => state.profile);
  const isViewEdit = model?.isView || model?.isEdit;
  const creator = isViewEdit
    ? `${model?.user?.createUser?.email} - ${model?.user?.createUser?.name}`
    : `${profile?.account?.email} - ${profile?.account?.name}`;
  const organizationName = isViewEdit
    ? model?.user?.organizationName
    : profile?.organization?.name;
  const positionName = isViewEdit
    ? model?.user?.positionName
    : profile?.position?.name;
  const typeContract = model?.contract?.contractRequestType;
  return (
    <div>
      <Row gutter={[12, 16]}>
        <Col sm={24}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "desciption")}
          >
            <InputText
              isRequired
              label={
                isEqual(typeContract, ContractRequestType.Contract)
                  ? translate("contractAdjustment.description_contract")
                  : translate("contractAdjustment.description_order")
              }
              placeHolder={
                isEqual(typeContract, ContractRequestType.Contract)
                  ? translate(
                      "contractAdjustment.placeHolder.description_contract"
                    )
                  : translate(
                      "contractAdjustment.placeHolder.description_order"
                    )
              }
              value={model?.desciption}
              onChange={handleChangeSingleField({
                fieldName: "desciption",
              })}
              isSmall={false}
              maxLength={500}
              regexInput={NOT_TAB_ENTER_REGEX}
              translate={translate}
            />
          </FormItem>
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
