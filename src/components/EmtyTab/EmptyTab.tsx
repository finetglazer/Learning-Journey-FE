import React from "react";
import "./EmptyTab.scss";
import { emptyIcon } from "../../assets/icons";
import { useTranslation } from "react-i18next";
const EmptyTab = () => {
  const [translate] = useTranslation();

  return (
    <div className="w-full EmptyTab-height d-flex justify-content-center align-items-center flex-column">
      <img src={emptyIcon} width={200} alt="" />
      <div className="EmptyTab-text">
        {translate("CM.text_empty_information")}
      </div>
    </div>
  );
};

export default EmptyTab;
