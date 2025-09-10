import { ExpandableConfig } from "antd/lib/table/interface";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import { ColumnProps } from "antd/lib/table";
import { IcArrowDown, IcPencilSvg, TrashIcon } from "assets/icons";
import classNames from "classnames";
import { ConfigField, FieldValue } from "core/services/service-types";
import { ContractAppendix, ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { LayoutCell, OneLineText } from "react-components-design-system";
import { ContractAppendixDrawerState } from "../DrawerAppendix/DrawerAppendixHook";
import ExpandableAppendixRow from "./ExpandableAppendixRow";

enum ColumnKey {
  NAME = "name",
  DESCRIPTION = "description",
  CODE = "code",
}

const columnsWidth = {
  code: 160,
  name: 220,
  actionIcon: 40,
};

export interface ContractAppendixContextProps {
  selectedContractAppendix: ContractAppendix;
  handleCloseDeleteModal: () => void;
  handleChangeSingleFieldMaster: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleSaveFromModal: (newTerm: ContractAppendix) => void;
  expandableTable: ExpandableConfig<ContractAppendix>;
  drawerState: ContractAppendixDrawerState;
  setDrawerState: Dispatch<SetStateAction<ContractAppendixDrawerState>>;
  handleDeleteAppendix: (data: ContractAppendix) => void;
  showModalConfirm: boolean;
}

export const ContractAppendixContext =
  createContext<ContractAppendixContextProps>({
    selectedContractAppendix: null,
    handleCloseDeleteModal: null,
    handleChangeSingleFieldMaster: null,
    handleSaveFromModal: null,
    expandableTable: null,
    drawerState: null,
    setDrawerState: null,
    showModalConfirm: null,
    handleDeleteAppendix: null,
  });

export const useContractAppendixHook = () => {
  const [translate] = useTranslationContract();

  const {
    isDetail,
    model: modelMaster,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const [selectedContractAppendix, setSelectedContractAppendix] =
    useState<ContractAppendix>(null);

  const [drawerState, setDrawerState] = useState(
    ContractAppendixDrawerState.HIDE
  );

  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const contractTermsViewColumns: ColumnProps<ContractAppendix>[] = useMemo(
    () => [
      {
        title: translate("CT.contract_appendix.appendix_number"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        width: columnsWidth.code,
        render(val: ContractAppendix["code"]) {
          return (
            <LayoutCell>
              <OneLineText value={val} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_appendix.appendix_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(val: ContractAppendix["name"]) {
          return (
            <LayoutCell>
              <OneLineText value={val} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.contract_appendix.appendix_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        ellipsis: true,
        render(description: ContractAppendix["description"]) {
          return (
            <LayoutCell>
              <OneLineText value={description} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const contractTermsDetailColumns: ColumnProps<ContractAppendix>[] = useMemo(
    () => [
      ...contractTermsViewColumns,
      {
        title: "",
        width: columnsWidth.actionIcon,
        render(_, record) {
          return (
            <LayoutCell>
              <button
                className={"contract-appendix__list-action-icon"}
                onClick={() => handleEditAppendix(record)}
              >
                <img
                  src={IcPencilSvg}
                  alt="Pencil Icon"
                  width={24}
                  height={24}
                />
              </button>
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        width: columnsWidth.actionIcon,
        render(_, record) {
          return (
            <LayoutCell>
              <button
                className={"contract-appendix__list-action-icon"}
                onClick={() => {
                  setSelectedContractAppendix(record);
                  setShowModalConfirm(true);
                }}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [contractTermsViewColumns]
  );

  const expandableTable: ExpandableConfig<ContractAppendix> = useMemo(() => {
    return {
      expandedRowRender: (record) => <ExpandableAppendixRow data={record} />,
      expandIcon: ({ expanded, onExpand, record }) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onExpand(record, e);
            }}
          >
            <img
              className={classNames("cursor-pointer m-x--3xs", {
                "rotate-180": expanded,
                "rotate-0": !expanded,
              })}
              src={IcArrowDown}
              alt="img"
              width={15}
              height={15}
            />
          </div>
        );
      },
    };
  }, []);

  const handleEditAppendix = (data: ContractAppendix) => {
    setSelectedContractAppendix(data);
    setDrawerState(ContractAppendixDrawerState.EDIT);
  };

  const handleDeleteAppendix = () => {
    handleChangeSingleFieldMaster({ fieldName: "appendixs" })(
      modelMaster?.appendixs.filter(
        (item) => item.id !== selectedContractAppendix.id
      )
    );
    setShowModalConfirm(false);
  };

  const handleCloseDeleteModal = () => {
    setShowModalConfirm(false);
  };

  const handleSaveFromModal = (newAppendix: ContractAppendix) => {
    if (drawerState === ContractAppendixDrawerState.ADD) {
      handleChangeSingleFieldMaster({
        fieldName: "appendixs",
      })([
        ...(modelMaster?.appendixs ?? []),
        { ...newAppendix, id: Date.now().toString() },
      ]);
    } else {
      handleChangeSingleFieldMaster({
        fieldName: "appendixs",
      })(
        modelMaster?.appendixs.map((item) =>
          item.id === newAppendix.id ? newAppendix : item
        )
      );
    }
  };

  return {
    isDetail,
    translate,
    modelMaster,
    selectedContractAppendix,
    handleCloseDeleteModal,
    setSelectedContractAppendix,
    contractTermsViewColumns,
    contractTermsDetailColumns,
    handleChangeSingleFieldMaster,
    handleSaveFromModal,
    expandableTable,
    drawerState,
    setDrawerState,
    showModalConfirm,
    handleDeleteAppendix,
  };
};
