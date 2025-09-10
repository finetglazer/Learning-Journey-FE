import {
  MAX_LENGTH_2000,
  MAX_LENGTH_255,
  numberConstants,
} from "core/config/consts";
import { validator } from "core/helpers/validator";
import { fieldService } from "core/services/page-services/field-service";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
} from "core/services/service-types";
import { isEmpty, isEqual, isNull, isUndefined } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import { useCheckStateContractPrincipleAppendix } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/Components/hooks/useCheckStateContractPrincipleAppendix";
import { Dispatch, Key, useMemo, useState } from "react";

interface useContractAppendixClauseProps {
  model?: ContractAnnex;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  formValueModel?: ContractTermsModel;
  dispatch?: Dispatch<GeneralAction<ContractTermsModel>>;
  modelView?: ContractAnnex;
}

export const useContractAppendixClause = ({
  model,
  handleChangeSingleField,
  formValueModel,
  dispatch,
  modelView,
}: useContractAppendixClauseProps) => {
  const { state } = useCheckStateContractPrincipleAppendix();
  const [isShowModelAdd, setIsShowModelAdd] = useState(false);
  const [recordEdit, setRecordEdit] = useState<ContractTermsModel | null>(null);
  const [idDelete, setIdDelete] = useState<string>("");
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const isDetailMode = useMemo(() => isEqual(state, "DETAIL"), [state]);
  const canAddAppendixTerms = useMemo(
    () => ["EDIT", "CREATE"].includes(state),
    [state]
  );
  const contractTerms = isDetailMode
    ? modelView?.contractTerms
    : model?.contractTerms;

  const isTableEmpty = useMemo(() => {
    return (
      isNull(contractTerms) ||
      isUndefined(contractTerms) ||
      isEqual(contractTerms?.length, numberConstants.ZERO)
    );
  }, [contractTerms]);

  const handleRowSelectionChange = (selectedKeys: Key[]) =>
    setSelectedRowKeys(selectedKeys);

  const handleCheckboxChange = (checked: boolean, recordId: Key) => {
    setSelectedRowKeys((prevKeys) =>
      checked
        ? [...prevKeys, recordId]
        : prevKeys.filter((key) => !isEqual(key, recordId))
    );
  };

  const handleEditRow = (record: ContractTermsModel) => {
    setRecordEdit(record);
    setIsShowModelAdd(true);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const updatedTerms = model?.contractTerms.filter(
      (item) => !isEqual(item?.id, idDelete)
    );
    handleChangeSingleField({ fieldName: "contractTerms" })(updatedTerms);
    setSelectedRowKeys((prev) => prev.filter((key) => !isEqual(key, idDelete)));
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDelete = () => setOpenModalConfirmDeleteAll(true);

  const handleBulkDeleteRow = () => {
    const updatedTerms = model?.contractTerms.filter(
      (item) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({ fieldName: "contractTerms" })(updatedTerms);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleCancelModal = () => {
    setIsShowModelAdd(false);
    setRecordEdit(null);
  };

  const {
    handleChangeAllField,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = fieldService.useField(formValueModel, dispatch);

  const validate = () => {
    const fieldsToValidate = [
      { name: "name", maxLength: MAX_LENGTH_255 },
      { name: "description", maxLength: MAX_LENGTH_2000 },
    ];
    const errors = fieldsToValidate.reduce((acc, field) => {
      const requiredError = validator.required({
        filedValidate: [field.name],
        data: formValueModel,
      });
      const maxLengthError = validator.maxLength({
        filedValidate: [field.name],
        data: formValueModel,
        maxLength: field.maxLength,
      });
      return {
        ...acc,
        ...requiredError,
        ...maxLengthError,
      };
    }, {});
    handleChangeAllField({
      ...formValueModel,
      errors,
    });
    return isEmpty(errors);
  };

  return {
    formValueModel,
    canAddAppendixTerms,
    isTableEmpty,
    isDetailMode,
    contractTerms,
    isShowModelAdd,
    recordEdit,
    idDelete,
    isOpenModelConfirmDeleteRow,
    openModalConfirmDeleteAll,
    selectedRowKeys,

    setIsShowModelAdd,
    setSelectedRowKeys,
    handleRowSelectionChange,
    handleCheckboxChange,
    handleEditRow,
    handleDeleteRowConfirm,
    handleDeleteRow,
    handleBulkDelete,
    handleBulkDeleteRow,
    handleCancelModal,
    setIsOpenModelConfirmDeleteRow,
    setOpenModalConfirmDeleteAll,
    handleChangeSingleFieldMaster,
    validate,
  };
};
