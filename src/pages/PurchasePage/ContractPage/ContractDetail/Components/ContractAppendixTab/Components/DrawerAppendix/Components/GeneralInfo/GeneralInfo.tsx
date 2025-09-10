import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { DrawerAppendixContext } from "../../DrawerAppendixHook";

const MAX_LENGTH_255 = 255;

const MAX_LENGTH_500 = 500;

const GeneralInfo = () => {
  const [translate] = useTranslation();

  const { model, handleChangeSingleField } = useContext(DrawerAppendixContext);

  return (
    <div className={classNames("general_info_wrapper")}>
      <div className="row g-2">
        <div className="col-6">
          <FormItem validateObject={utilService.getValidateObj(model, "code")}>
            <InputText
              isRequired
              isSmall={false}
              label={translate("CT.contract_appendix.appendix_number")}
              placeHolder={translate(
                "CT.contract_appendix.appendix_number_placeholder"
              )}
              maxLength={MAX_LENGTH_255}
              translate={translate}
              value={model?.code}
              onChange={(value: string) =>
                handleChangeSingleField({
                  fieldName: "code",
                })(value)
              }
            />
          </FormItem>
        </div>
        <div className="col-6">
          <FormItem validateObject={utilService.getValidateObj(model, "name")}>
            <InputText
              isRequired
              isSmall={false}
              label={translate("CT.contract_appendix.appendix_name")}
              placeHolder={translate(
                "CT.contract_appendix.appendix_name_placeholder"
              )}
              maxLength={MAX_LENGTH_255}
              translate={translate}
              value={model?.name}
              onChange={(value: string) =>
                handleChangeSingleField({
                  fieldName: "name",
                })(value)
              }
            />
          </FormItem>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <InputText
            isSmall={false}
            label={translate("CT.contract_appendix.appendix_description")}
            placeHolder={translate(
              "CT.contract_appendix.appendix_description_placeholder"
            )}
            maxLength={MAX_LENGTH_500}
            translate={translate}
            value={model?.description}
            onChange={(value: string) =>
              handleChangeSingleField({
                fieldName: "description",
              })(value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
