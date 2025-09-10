import { IcSearchSVG } from "assets/icons";
import { InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import React, { useContext, useState } from "react";
import { FilterActionEnum } from "core/services/service-types";
import { useDebounceFn } from "ahooks";
import {
  ContractModal,
  ContractModalContext,
} from "../ModalChooseContractHooks";

const ModalChooseContractHeader = () => {
  const [translate] = useTranslation();
  const { modelFilter, dispatchFilter, handleLoadList } =
    useContext<ContractModal>(ContractModalContext);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = (search || "").replace(/\s+/g, " ").trim();
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  return (
    <div>
      <InputText
        prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
        value={modelFilter.search}
        onChange={run}
        placeHolder={translate("TIA.model_search_contract_code")}
        isSmall={false}
      />
    </div>
  );
};

export default ModalChooseContractHeader;
