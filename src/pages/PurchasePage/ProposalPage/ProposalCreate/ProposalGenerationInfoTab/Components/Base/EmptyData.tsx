import { Add } from "@carbon/icons-react";
import { BasisIcon } from "assets/icons";
import { ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./Base.scss";

const EmptyData = () => {
  const [translate] = useTranslation();

  const { handleAddNewBasis } = useContext<ProposalCreateModel>(
    ProposalCreateHookContext
  );

  return (
    <div className="empty__wrapper">
      <img src={BasisIcon} alt="img" width={140} height={140} />
      <div className="empty__body__content">
        <span className="content">
          <span className="content__import">
            {translate("PP.upload_basis_document")}
          </span>{" "}
          {translate("PP.and_add_description")} <br />
          {translate("PP.accompanying_each_document_group")}{" "}
        </span>
        <div className="empty__body__content__button">
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            onClick={handleAddNewBasis}
          >
            {translate("PP.add_basis")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
