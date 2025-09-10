import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import { emptyIcon } from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import "./AuthorizationInformation.scss";
import { ModalAuthorizationInformation } from "./ModalAuthorizationInformation";

import add from "assets/icons/add.svg";
import { isEmpty } from "lodash";
import { Authorizers } from "pages/Catalog/LegalEntity/LegalEntityMaster/LegalEntityMasterHooks";
import { Button } from "react-components-design-system";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../../LegalEntityDetailHooks";
import AuthorizationInformationTable from "./AuthorizationInformationTable";
const AuthorizationInformation = () => {
  const [translate] = useTranslation();
  const { model } = useContext<LegalEntityDetail>(LegalEntityDetailContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [recordEdit, setRecordEdit] = useState<Authorizers | null>(null);
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setRecordEdit(null);
  };
  const onEditRow = (record: Authorizers) => {
    setRecordEdit(record);
    handleOpenModal();
  };
  return (
    <div className="authorization_information_wrapper">
      <div className="title_authorization">
        {translate("LE.title_legal_entity_authorization_information")}
      </div>
      <div className="body">
        {isEmpty(model?.authorizers) ? (
          !model?.isDetail ? (
            <EmptyInitializeTable
              textButton={translate("LE.txt_legal_entity_add_authorization")}
              content={
                <div className="">
                  {translate(
                    "LE.txt_legal_entity_add_authorization_information"
                  )}
                </div>
              }
              icon={<img src={emptyIcon} alt="" />}
              onHandleClickAdd={handleOpenModal}
            />
          ) : null
        ) : (
          <>
            {!model?.isDetail ? (
              <Button
                icon={<img src={add} alt="img" width={12} height={12} />}
                iconPlace="left"
                type="secondary"
                onClick={handleOpenModal}
                className="btn_add_authorization"
              >
                {translate("LE.txt_legal_entity_add_authorization")}
              </Button>
            ) : null}
            <AuthorizationInformationTable onEditRow={onEditRow} />
          </>
        )}
      </div>
      {isModalOpen && (
        <ModalAuthorizationInformation
          onClose={handleCloseModal}
          recordEdit={recordEdit}
        />
      )}
    </div>
  );
};

export default AuthorizationInformation;
