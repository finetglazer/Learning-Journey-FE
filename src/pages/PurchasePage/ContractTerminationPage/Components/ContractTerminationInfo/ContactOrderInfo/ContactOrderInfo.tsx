import React, { useContext, useState } from "react";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyIconContact, warningIcon } from "assets/icons";
import { isEmpty } from "lodash";
import { Button, ModalConfirm } from "react-components-design-system";
import { contactDetailInListModel } from "models/Settlement";
import { useTranslation } from "react-i18next";
import { ModalSelectContactPO } from "pages/SettlementPage/Components/ModalSelectContactPO/ModalSelectContactPO";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { PAGE_USED } from "pages/SettlementPage/Components/ModalSelectContactPO/ModalSelectContactPOHook";
import Insight from "../Insight/Insight";

const ContactOrderInfo = () => {
  const [translate] = useTranslation();
  const { model, handleGetContractDetail } = useContext(
    ContractTerminationDetailHookContext
  );
  const [isOpenModalSelectContactPO, setIsOpenModalSelectContactPO] =
    useState(false);
  const [
    isOpenModalConfirmSelectContactPO,
    setIsOpenModalConfirmSelectContactPO,
  ] = useState(false);
  const [idContactPO, setIdContactPO] = useState("");

  const handleSaveData = async (id: string) => {
    setIsOpenModalConfirmSelectContactPO(false);
    await handleGetContractDetail(id, model);
  };

  const handleConfirm = (value: contactDetailInListModel) => {
    if (isEmpty(model?.contactOrderInfo?.id)) {
      handleSaveData(value?.id);
    } else {
      setIdContactPO(value?.id);
      setIsOpenModalConfirmSelectContactPO(true);
    }
  };
  return (
    <div>
      {isEmpty(model?.contactOrderInfo?.contract?.id) ? (
        <EmptyInitializeTable
          textButton={translate("settlement.add_contact_po")}
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: translate("settlement.empty_file_message").replace(
                  /\n/g,
                  "<br/>"
                ),
              }}
            ></div>
          }
          icon={<img src={emptyIconContact} alt="" />}
          onHandleClickAdd={() => {
            setIsOpenModalSelectContactPO(true);
          }}
        />
      ) : (
        <div>
          <div>
            <Button
              icon={<img src={AddIcon} alt="img" width={14} height={14} />}
              iconPlace="left"
              type="secondary"
              className="m-b--sm"
              onClick={() => setIsOpenModalSelectContactPO(true)}
            >
              {translate("settlement.add_contact_po")}
            </Button>
            <Insight />
          </div>
        </div>
      )}
      {isOpenModalSelectContactPO && (
        <ModalSelectContactPO
          setModal={setIsOpenModalSelectContactPO}
          isShowModel={isOpenModalSelectContactPO}
          callback={(value) => {
            handleConfirm(value);
          }}
          selectedKey={model?.contactOrderInfo?.contract?.id}
          title={translate("contractTermination.select_liquidated")}
          pageUsed={PAGE_USED.CONTRACT_TERMINATION}
        />
      )}

      <ModalConfirm
        open={isOpenModalConfirmSelectContactPO}
        maskClosable={false}
        icon={<img src={warningIcon} alt="img" width={72} height={72} />}
        title={translate("settlement.confirm_select_contract_title")}
        content={translate("settlement.confirm_select_contract_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PL.confirm")}
        handleSave={() => handleSaveData(idContactPO)}
        handleCancel={() => setIsOpenModalConfirmSelectContactPO(false)}
      />
    </div>
  );
};

export default ContactOrderInfo;
