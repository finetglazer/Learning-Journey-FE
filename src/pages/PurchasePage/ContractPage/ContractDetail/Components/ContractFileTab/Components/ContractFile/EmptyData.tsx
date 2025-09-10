import { Add } from "@carbon/icons-react";
import { emptyApplicationIcon } from "assets/icons";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { Button } from "react-components-design-system";
import "./ContractFile.scss";

type EmptyDataProps = {
  addNew?: () => void;
};

const EmptyData = ({ addNew }: EmptyDataProps) => {
  const [translate] = useTranslationContract();

  return (
    <div className="empty__wrapper">
      <img src={emptyApplicationIcon} alt="img" width={140} height={140} />
      <div className="empty__body__content">
        <span className="content">
          <span className="content__import">
            {translate("CT.contract_file.upload_signed_contract")}
          </span>{" "}
          {translate("PP.and_add_description")} <br />
          {translate("PP.accompanying_each_document_group")}{" "}
        </span>
        <div className="empty__body__content__button">
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            onClick={addNew}
          >
            {translate("CT.contract_file.add_contract_file")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
