import { EditorCM } from "components";
import { utilService } from "core/services/common-services/util-service";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";
import { FormItem } from "react-components-design-system";
import "./ContentEmail.scss";

type Props = {
  fieldName: string;
};

const ContentEmail = ({ fieldName }: Props) => {
  const { translate, model, handleChangeAllField } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const handleChange = (content: string) => {
    const requireTextBody =
      content.length <= 0 ? translate("CM.input_require_validation") : null;
    handleChangeAllField({
      ...model,
      textBody: content,
      errors: {
        ...model.errors,
        textBody: requireTextBody,
      },
    });
  };

  return (
    <FormItem validateObject={utilService.getValidateObj(model, fieldName)}>
      <div className="purchasing-plan-supplier__content-email-wrapper">
        <div className="body-content-email_wrapper">
          <EditorCM
            data={model[fieldName]}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleChange(data);
            }}
          />
        </div>
      </div>
    </FormItem>
  );
};

export default ContentEmail;
