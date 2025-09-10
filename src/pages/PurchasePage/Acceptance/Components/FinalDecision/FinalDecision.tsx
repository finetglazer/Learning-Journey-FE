import { MAX_LENGTH_TEXT_AREA } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { FormItem, TextArea } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";

interface FinalDecisionProps {
  isEdit?: boolean;
}

export const FinalDecision = ({ isEdit }: FinalDecisionProps) => {
  const [translate] = useTranslation();
  const { model, ...context } = useAcceptanceInformationContext();

  return (
    <FormItem validateObject={utilService.getValidateObj(model, "conclude")}>
      <TextArea
        showCount={isEdit}
        isRequired={isEdit}
        label={isEdit ? translate("AC.txt_conclusion_info") : undefined}
        placeHolder={isEdit ? translate("AC.txt_enter_conclusion") : undefined}
        maxLength={MAX_LENGTH_TEXT_AREA}
        translate={translate}
        resize="none"
        onChange={
          isEdit
            ? context?.handleChangeSingleField({ fieldName: "conclude" })
            : undefined
        }
        value={model?.conclude}
        readOnly={!isEdit}
      />
    </FormItem>
  );
};
