/* eslint-disable import/no-unresolved */
import { Add } from "@carbon/icons-react";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { isEmpty } from "lodash";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { useContext, useState } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import { ProposalModal } from "../ProposalModal/ProposalModal";
import EmptyData from "./EmptyData";
import "./PolicyInfo.scss";
import PurchaseProposalData from "./PurchaseProposalData";

const PolicyInfo = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const {
    model,
    handleChangeAllField,
    isShowModalProposal,
    setIsShowModalProposal,
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <div className="policy_info_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PR.policy_info")}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="body">
          {isEmpty(model?.purchaseProposalId) ? (
            <EmptyData />
          ) : (
            <div>
              {!model.isDetail && !model.isAdjust && (
                <Button
                  icon={<Add />}
                  iconPlace="left"
                  type="secondary"
                  disabled={!isEmpty(model?.purchaseItems)}
                  onClick={() => setIsShowModalProposal(true)}
                  className="mb-3"
                >
                  {translate("PR.select_policy")}
                </Button>
              )}
              <PurchaseProposalData />
            </div>
          )}
        </div>
      )}
      {isShowModalProposal && (
        <ProposalModal
          setModal={setIsShowModalProposal}
          isShowModel={isShowModalProposal}
          addedProposal={model?.purchaseProposalId?.id}
          callback={(value) => {
            handleChangeAllField({
              ...model,
              purchaseItems: value?.purchaseItems,
              purchaseProposalId: value,
            });
          }}
        />
      )}
    </div>
  );
};

export default PolicyInfo;
