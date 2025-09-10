import {
  PHONE_NUMBER_REGEX,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import dayjs from "dayjs";
import { useContext } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { AccountInfoModel, PaymentCreateModel } from "models/Payment";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
import { useAppSelector } from "rtk/useRedux";
import { isNil } from "lodash";

const ProposerPeople = () => {
  const { translate, model, handleChangeSingleField } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const account = useAppSelector(
    (state) => state.profile?.account
  ) as AccountInfoModel;
  const position = useAppSelector((state) => state.profile?.position);
  const businessBranch = useAppSelector(
    (state) => state.profile?.businessBranch
  );
  const businessDepartment = useAppSelector(
    (state) => state.profile?.businessDepartment
  );

  return (
    <div>
      <div className="fw-semibold position-relative payment-top">
        {translate("PM.payment_proposer_people_label")}
      </div>
      <div className="border rounded-1">
        <div className="border-bottom">
          <div className="p-x--sm p-y--xs">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div className="payment-label">{position?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {position?.code}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="fw-bold fs-5">
                {!isNil(model?.createUserName)
                  ? model?.createUserName
                  : account?.name}
              </div>
              <div className="payment-label">
                {!isNil(model?.createUser) ? model?.createUser : account.email}
              </div>
            </div>
            <div className="m-t--sm">
              <form onSubmit={(e) => e.preventDefault()}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "phoneNumber"
                  )}
                >
                  <InputText
                    label={translate("PM.payment_phone_number")}
                    className="payment-custom_input payment-label_none"
                    placeHolder={translate(
                      "PM.payment_add_contact_phone_number_placeholder"
                    )}
                    isSmall={false}
                    onChange={handleChangeSingleField({
                      fieldName: "phoneNumber",
                    })}
                    value={model.phoneNumber}
                    maxLength={20}
                    regexInput={PHONE_NUMBER_REGEX}
                    translate={translate as TFunction}
                  />
                </FormItem>
              </form>
            </div>
          </div>
        </div>
        <div className="payment-bg_color">
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div>{businessBranch?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {businessBranch?.code}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div>{businessDepartment?.businessUnitName}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {businessDepartment?.businessUnitCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-x--sm p-y--xs border-bottom">
            <div className="d-flex">
              <div className="d-flex justify-content-between w-100">
                <div>{businessDepartment?.name}</div>
                <div>
                  <div className="payment-label border payment-tag_bg">
                    {businessDepartment?.code}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-x--sm p-y--xs">
          <div className="d-flex">
            <div className="d-flex justify-content-between w-100">
              <div className="payment-label">
                {translate("PM.payment_date_of_proposal_label")}
              </div>
              <div>
                <div>
                  {isNil(model?.createdDate)
                    ? dayjs().format(STANDARD_DATE_FORMAT_SLASH)
                    : dayjs(model?.createdDate).format(
                        STANDARD_DATE_FORMAT_SLASH
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposerPeople;
