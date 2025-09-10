import React, { useContext, useState } from "react";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { AddIcon, emptyIconContact, warningIcon } from "assets/icons";
import { SettlementHookContext } from "../../../SettlementDetail/SettlementDetailHook";
import { isEmpty } from "lodash";
import { Button, ModalConfirm } from "react-components-design-system";
import ContactOrderInsight from "../ContactOrderInsight/ContactOrderInsight";
import { ModalSelectContactPO } from "../../ModalSelectContactPO/ModalSelectContactPO";
import { contactDetailInListModel } from "models/Settlement";
import { PAGE_USED } from "../../ModalSelectContactPO/ModalSelectContactPOHook";

type ContactOrderInfoProps = {
  isHasContract: boolean;
};
const ContactOrderInfo = ({ isHasContract }: ContactOrderInfoProps) => {
  const { model, translate, handleGetContractDetail } = useContext(
    SettlementHookContext
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
      {!isHasContract ? (
        <EmptyInitializeTable
          textButton={translate("settlement.add_contact_po")}
          content={<div>{translate("settlement.select_contact_po")}</div>}
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
            <ContactOrderInsight />
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
          selectedKey={model?.contactOrderInfoId}
          pageUsed={PAGE_USED.CONTRACT_SETTLEMENT}
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
