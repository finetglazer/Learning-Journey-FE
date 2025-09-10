import { ColumnProps } from "antd/lib/table";
import { IcPencilSvg, TrashIcon } from "assets/icons";
import { MAX_LENGTH_255 } from "core/config/consts";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { ConfigField } from "core/services/service-types";
import { isEmpty } from "lodash";
import { AppendixTerm, ContractAppendix } from "models/Contract";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Model } from "react-3layer-common";
import { LayoutCell, OneLineText } from "react-components-design-system";

enum ColumnKey {
  NAME = "name",
  DESCRIPTION = "description",
}

export enum AppendixTermModalState {
  EDIT = "EDIT",
  ADD = "ADD",
  HIDE = "HIDE",
}

export enum ContractAppendixDrawerState {
  EDIT = "EDIT",
  ADD = "ADD",
  HIDE = "HIDE",
}

export type DrawerAppendixContextType = {
  model: ContractAppendix;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeAllField: (data: ContractAppendix) => void;
  termColumns: ColumnProps<AppendixTerm>[];
  appendixTermModal: AppendixTermModalState;
  setAppendixTermModal: Dispatch<SetStateAction<AppendixTermModalState>>;
  selectedTerm: AppendixTerm;
  validateAllRequiredField: () => boolean;
};

export const DrawerAppendixContext = createContext({
  model: new ContractAppendix(),
  handleChangeSelectField: null,
  handleChangeSingleField: null,
  handleChangeAllField: null,
  termColumns: null,
  appendixTermModal: AppendixTermModalState.HIDE,
  setAppendixTermModal: null,
  selectedTerm: null,
  validateAllRequiredField: null,
});

type DrawerAppendixHookType = {
  initData?: ContractAppendix;
  mode: ContractAppendixDrawerState;
};

export function useDrawerAppendixHook({
  initData,
  mode,
}: DrawerAppendixHookType) {
  const isEdit = mode === ContractAppendixDrawerState.EDIT;

  const { model, dispatch: dispatchModel } =
    detailService.useModel<ContractAppendix>(
      ContractAppendix,
      isEdit ? initData : {}
    );

  const [translate] = useTranslationContract();

  const [appendixTermModal, setAppendixTermModal] = useState(
    AppendixTermModalState.HIDE
  );

  const [selectedTerm, setSelectedTerm] = useState<AppendixTerm | undefined>();

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatchModel);

  const termColumns: ColumnProps<AppendixTerm>[] = useMemo(
    () => [
      {
        title: translate("CT.contract_appendix.column_term"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: 300,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_appendix.column_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        ellipsis: true,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        width: 80,
        render(_, record: AppendixTerm) {
          return (
            <LayoutCell>
              <button className={"action-icon"} onClick={editTerm(record)}>
                <img
                  src={IcPencilSvg}
                  alt="Pencil Icon"
                  width={24}
                  height={24}
                />
              </button>
              <button className={"action-icon"} onClick={deleteTerm(record)}>
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const editTerm = (data: AppendixTerm) => () => {
    setAppendixTermModal(AppendixTermModalState.EDIT);
    setSelectedTerm(data);
  };

  const deleteTerm = (data: AppendixTerm) => () => {
    setSelectedTerm(data);
    handleChangeSingleField({ fieldName: "appendixTerms" })(
      model.appendixTerms.filter((term) => term.id !== data.id)
    );
  };

  const validateAllRequiredField = () => {
    const validatedFields = [
      { fieldName: "name", maxLength: MAX_LENGTH_255 },
      { fieldName: "code", maxLength: MAX_LENGTH_255 },
    ];

    const errors = validatedFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (!model?.[field?.fieldName]) {
          acc[field?.fieldName] = translate("CM.input_require_validation");
        } else if (model?.[field?.fieldName]?.length > field?.maxLength) {
          acc[field?.fieldName] = translate("CM.input_length_validation", {
            maxLength: field?.maxLength,
          });
        }
        return acc;
      },
      {}
    );

    if (!isEmpty(errors)) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    return true;
  };

  return {
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
    termColumns,
    appendixTermModal,
    setAppendixTermModal,
    selectedTerm,
    validateAllRequiredField,
  };
}
