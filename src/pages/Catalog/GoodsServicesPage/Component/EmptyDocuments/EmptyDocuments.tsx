import React from "react";
import { emptyIcon } from "assets/icons";
import { useTranslation } from "react-i18next";
import "./EmptyDocuments.scss";
const EmptyDocuments = () => {
  const [translate] = useTranslation();

  return (
    <div className="w-full empty_documents-height d-flex justify-content-center align-items-center flex-row gap-4">
      <img src={emptyIcon} width={140} alt="" />
      <div className="empty_documents-text">
        {translate("PL.purchase_no_document")}
      </div>
    </div>
  );
};

export default EmptyDocuments;
