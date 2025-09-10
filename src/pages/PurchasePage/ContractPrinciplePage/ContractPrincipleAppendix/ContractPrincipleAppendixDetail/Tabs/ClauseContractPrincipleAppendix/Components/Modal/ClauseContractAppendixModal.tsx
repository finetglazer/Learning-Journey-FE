import {
  MAX_LENGTH_2000,
  MAX_LENGTH_255,
  WIDTH_1000,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { isEqual } from "lodash";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import { useContractPrincipleAppendixDetailContext } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixDetail/context";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useContractAppendixClause } from "../useContractAppendixClause";

type ClauseContractAppendixModalProps = {
  open: boolean;
  handleCancel: () => void;
  recordEdit?: ContractTermsModel;
};

const ClauseContractAppendixModal = ({
  open,
  handleCancel,
  recordEdit,
}: ClauseContractAppendixModalProps) => {
  const [translate] = useTranslation();

  const { model, handleChangeSingleField } =
    useContractPrincipleAppendixDetailContext();

  const { model: formValueModel, dispatch } =
    detailService.useModel<ContractTermsModel>(ContractTermsModel, {
      ...new ContractTermsModel(),
      ...recordEdit,
    });

  const { validate, handleChangeSingleFieldMaster } = useContractAppendixClause(
    {
      formValueModel,
      dispatch,
    }
  );

  const handleAddNew = () => {
    if (!validate()) {
      return;
    }
    const newModel = {
      id: Date.now(),
      ...formValueModel,
    };
    const updatedGuarantees = recordEdit
      ? model?.contractTerms?.map((terms) =>
          isEqual(terms?.id, recordEdit?.id) ? newModel : terms
        )
      : [...(model?.contractTerms || []), { ...newModel, id: Date.now() }];
    handleChangeSingleField({
      fieldName: "contractTerms",
    })(updatedGuarantees);
    handleCancel();
  };

  return (
    <Modal
      open={open}
      title={translate("CPA.txt_add_term")}
      size={WIDTH_1000}
      closeIcon={true}
      handleSave={handleAddNew}
      handleCancel={handleCancel}
      isShowIconBack={false}
      titleButtonCancel={translate("CT.btn_cancel")}
      titleButtonApply={translate("CT.btn_add")}
    >
      <div className="d-flex flex-column gap-1">
        <FormItem
          validateObject={utilService.getValidateObj(formValueModel, "name")}
        >
          <InputText
            label={translate("CT.terms_name")}
            placeHolder={translate("CM.placeholder_clause_name")}
            onChange={handleChangeSingleFieldMaster({
              fieldName: "name",
            })}
            value={formValueModel?.name}
            maxLength={MAX_LENGTH_255}
            isSmall={false}
            allowClear={false}
            isRequired
          />
        </FormItem>
        <FormItem
          validateObject={utilService.getValidateObj(
            formValueModel,
            "description"
          )}
        >
          <TextArea
            label={translate("CM.txt_description")}
            placeHolder={translate("CM.type_description")}
            onChange={handleChangeSingleFieldMaster({
              fieldName: "description",
            })}
            value={formValueModel?.description}
            maxLength={MAX_LENGTH_2000}
            resize="none"
            rows={16}
            isRequired
            showCount
          />
        </FormItem>
      </div>
    </Modal>
  );
};

export default ClauseContractAppendixModal;
