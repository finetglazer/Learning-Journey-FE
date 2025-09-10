/* eslint-disable import/named */
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import { ContractAppendix } from "models/Contract";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import AppendixTerm from "./Components/AppendixTerm/AppendixTerm";
import GeneralInfo from "./Components/GeneralInfo/GeneralInfo";
import "./DrawerAppendix.scss";
import {
  ContractAppendixDrawerState,
  DrawerAppendixContext,
  useDrawerAppendixHook,
} from "./DrawerAppendixHook";

interface Props {
  handleClose: () => void;
  handleSave: (data: ContractAppendix) => void;
  mode?: ContractAppendixDrawerState;
  modelData?: ContractAppendix;
}

enum DrawerAppendixSectionKey {
  GENERAL_INFO = "GENERAL_INFO",
  APPENDIX = "APPENDIX",
}

const DrawerAppendix = ({
  handleClose,
  handleSave,
  mode = ContractAppendixDrawerState.HIDE,
  modelData,
}: Props) => {
  const [translate] = useTranslationContract();

  const contextValue = useDrawerAppendixHook({ initData: modelData, mode });

  const isVisible = mode !== ContractAppendixDrawerState.HIDE;

  const isEdit = mode === ContractAppendixDrawerState.EDIT;

  const collapseItems: CollapseItem[] = useMemo(
    () => [
      {
        key: DrawerAppendixSectionKey.GENERAL_INFO,
        label: translate("CT.create_contract.general_information"),
        children: <GeneralInfo />,
      },
      {
        key: DrawerAppendixSectionKey.APPENDIX,
        label: translate("CT.contract_appendix.appendix_term"),
        children: <AppendixTerm />,
      },
    ],
    [translate]
  );

  const handleSaveModal = () => {
    if (!contextValue.validateAllRequiredField()) return;
    handleSave(contextValue?.model);
    handleClose();
  };

  return (
    <Drawer
      numberButton={"1"}
      visible={isVisible}
      size={"xl"}
      loading={false}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={
        isEdit ? translate("CM.txt_editable") : translate("CM.txt_add")
      }
      handleCancel={handleClose}
      handleClose={handleClose}
      handleSave={handleSaveModal}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      title={
        <div className="fw-bold">
          <span>
            {isEdit
              ? translate("CT.contract_appendix.edit_appendix")
              : translate("CT.contract_appendix.add_appendix")}
          </span>
        </div>
      }
      className={"ct_drawer_wrapper"}
    >
      <DrawerAppendixContext.Provider value={contextValue}>
        <CollapseView
          className={classNames(
            "collapse__container",
            "collapse__container--not-border"
          )}
          items={collapseItems}
          defaultActiveKey={[
            DrawerAppendixSectionKey.GENERAL_INFO,
            DrawerAppendixSectionKey.APPENDIX,
          ]}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div>
              <img
                src={IcArrowDown}
                className={classNames(
                  "invoice-transition",
                  isActive && "invoice-transition_expand"
                )}
                alt=""
              />
            </div>
          )}
        />
      </DrawerAppendixContext.Provider>
    </Drawer>
  );
};

export default DrawerAppendix;
