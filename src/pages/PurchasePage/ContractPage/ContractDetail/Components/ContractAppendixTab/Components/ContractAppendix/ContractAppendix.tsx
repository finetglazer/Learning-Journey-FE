import { isEmpty } from "lodash";
import {
  Button,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";

import {
  ContractAppendixContext,
  useContractAppendixHook,
} from "./ContractAppendixHook";

import { DeleteRoundIcon, IcEmptyGoodsServices, IcPlusSVG } from "assets/icons";
import { ContractAppendix } from "models/Contract";
import DrawerAppendix from "../DrawerAppendix/DrawerAppendix";
import { ContractAppendixDrawerState } from "../DrawerAppendix/DrawerAppendixHook";
import "./ContractAppendix.scss";

const ContractAppendixComponent = () => {
  const contextValue = useContractAppendixHook();

  const {
    handleSaveFromModal,
    modelMaster,
    setDrawerState,
    isDetail,
    translate,
    contractTermsDetailColumns,
    contractTermsViewColumns,
    showModalConfirm,
  } = contextValue;

  const isShowDrawer =
    contextValue.drawerState !== ContractAppendixDrawerState.HIDE;

  const handleSave = (data: ContractAppendix) => {
    handleSaveFromModal(data);
    setDrawerState(ContractAppendixDrawerState.HIDE);
  };

  return (
    <ContractAppendixContext.Provider value={contextValue}>
      <div className={"contract-appendix-wrapper "}>
        {!isEmpty(modelMaster?.appendixs) ? (
          <div className={"contract-appendix__list"}>
            {!isDetail && (
              <Button
                iconPlace="left"
                icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                type="secondary"
                size="lg"
                onClick={() => setDrawerState(ContractAppendixDrawerState.ADD)}
              >
                {translate("CT.contract_appendix.add_appendix")}
              </Button>
            )}

            <div>
              <StandardTable
                rowKey="id"
                isDragable
                columns={
                  !isDetail
                    ? contractTermsDetailColumns
                    : contractTermsViewColumns
                }
                dataSource={modelMaster?.appendixs}
                expandable={contextValue.expandableTable}
                idContainer="contract-appendix-table"
                scroll={{
                  y: isDetail ? "calc(100vh - 330px)" : "calc(100vh - 376px)",
                }}
              />
            </div>
          </div>
        ) : (
          <div className={"empty-contract-appendix"}>
            <div className={"empty-contract-appendix__wrapper"}>
              <img
                src={IcEmptyGoodsServices}
                alt="img"
                width={140}
                height={140}
              />

              <div className={"empty-contract-appendix__container"}>
                <span className={"no-contract-appendix-text"}>
                  {translate("CM.message_empty_data")}
                </span>
                {!isDetail && (
                  <Button
                    iconPlace="left"
                    icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                    type="secondary"
                    size="lg"
                    onClick={() =>
                      setDrawerState(ContractAppendixDrawerState.ADD)
                    }
                  >
                    {translate("CT.contract_appendix.add_appendix")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isShowDrawer && (
        <DrawerAppendix
          mode={contextValue.drawerState}
          modelData={contextValue?.selectedContractAppendix}
          handleClose={() => setDrawerState(ContractAppendixDrawerState.HIDE)}
          handleSave={handleSave}
        />
      )}
      <ModalConfirm
        open={showModalConfirm}
        maskClosable={false}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.contract_appendix.confirm_delete_appendix")}
        content={translate("CT.warning_delete_term")}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.txt_delete")}
        handleCancel={contextValue.handleCloseDeleteModal}
        handleSave={contextValue.handleDeleteAppendix}
      />
    </ContractAppendixContext.Provider>
  );
};

export default ContractAppendixComponent;
