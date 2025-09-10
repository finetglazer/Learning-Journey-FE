import {
  MAX_LENGTH_2000,
  MAX_LENGTH_255,
  numberConstants,
} from "core/config/consts";
import { validator } from "core/helpers/validator";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { listService } from "core/services/page-services/list-service";
import { GeneralAction, GeneralActionEnum } from "core/services/service-types";
import { gt, isEmpty, isEqual, isNil, uniqueId } from "lodash";
import { ContractTermsModel } from "models/ContractTerms/ContractTerms";
import { Dispatch, useMemo, useRef, useState } from "react";

export enum TypeAction {
  "EDIT",
  "CREATE",
  "DELETE",
}

interface ContractTermsHooksParams<T> {
  model: T & { contractTerms?: ContractTermsModel[] };
  onDispatch: Dispatch<GeneralAction<T>>;
}

function useContractTermsHooks<T>({
  model,
  onDispatch,
}: ContractTermsHooksParams<T>) {
  const contractTerms = useMemo(
    () =>
      model?.contractTerms?.map((contractTerm) => ({
        ...contractTerm,
        id: uniqueId("contract-term"),
      })) || [],
    [model?.contractTerms]
  );

  const [typeAction, setTypeAction] = useState<TypeAction | null>(null);
  const contractTermId = useRef<string>(null);

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ContractTermsModel>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const { model: detailModel, dispatch } =
    detailService.useModel<ContractTermsModel>(ContractTermsModel, {
      ...new ContractTermsModel(),
    });

  const { handleChangeSingleField, handleChangeAllField } =
    fieldService.useField(detailModel, dispatch);

  const handleAction = (typeAction: null | TypeAction, id: string | null) => {
    contractTermId.current = id;
    if (isEqual(typeAction, TypeAction.EDIT)) {
      const dataDetail = contractTerms?.find((item) => isEqual(id, item?.id));
      handleChangeAllField(dataDetail);
    }
    setTypeAction(typeAction);
  };

  const handleClose = () => {
    contractTermId.current = null;
    setTypeAction(null);
    handleChangeAllField({
      ...new ContractTermsModel(),
    });
  };

  const validate = () => {
    const fieldsToValidate = [
      { name: "name", maxLength: MAX_LENGTH_255 },
      { name: "description", maxLength: MAX_LENGTH_2000 },
    ];

    const errors = fieldsToValidate.reduce((acc, field) => {
      const requiredError = validator.required({
        filedValidate: [field.name],
        data: detailModel,
      });

      const maxLengthError = validator.maxLength({
        filedValidate: [field.name],
        data: detailModel,
        maxLength: field.maxLength,
      });

      return {
        ...acc,
        ...requiredError,
        ...maxLengthError,
      };
    }, {});

    handleChangeAllField({
      ...detailModel,
      errors,
    });

    return isEmpty(errors);
  };

  const handleAddContractTerms = () => {
    if (!validate()) {
      return;
    }

    const list = contractTerms;

    if (isNil(detailModel?.id)) {
      const newCommercial = {
        ...detailModel,
        id: uniqueId(),
      };
      list.push(newCommercial);
    } else {
      const index = contractTerms.findIndex((item) =>
        isEqual(item?.id, detailModel?.id)
      );
      if (gt(index, -numberConstants.ONE)) {
        list.splice(index, numberConstants.ONE, {
          ...detailModel,
          id: detailModel.id || uniqueId("contract-term"),
        });
      }
    }

    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractTerms: list,
      } as T,
    });

    handleClose();
  };

  const handleDeleteContractTerms = () => {
    const id = contractTermId.current;
    let newList: ContractTermsModel[] = [];
    let remainIds: string[] = [];
    if (isNil(id)) {
      newList = contractTerms.filter(
        (item) => !selectedRowKeys?.includes(item?.id)
      );
      remainIds = newList.reduce((acc, item) => {
        if (selectedRowKeys.includes(item?.id)) {
          return [...acc, item.id];
        }
        return acc;
      }, []);
    } else {
      newList = contractTerms.filter((item) => item?.id !== id);
      remainIds = selectedRowKeys?.filter(
        (itemId) => itemId !== id
      ) as string[];
      contractTermId.current = null;
    }

    setSelectedRowKeys(remainIds);
    onDispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        contractTerms: newList,
      } as T,
    });
    setTypeAction(null);
  };

  return {
    contractTerms,
    typeAction,
    detailModel,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    handleClose,
    handleAction,
    setSelectedRowKeys,
    handleChangeSingleField,
    handleAddContractTerms,
    handleDeleteContractTerms,
  };
}

export default useContractTermsHooks;
