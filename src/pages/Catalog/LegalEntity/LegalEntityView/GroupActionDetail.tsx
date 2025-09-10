import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../LegalEntityDetail/LegalEntityDetailHooks";

const GroupActionDetail = () => {
  const [translate] = useTranslation();
  const { handleBack } = useContext<LegalEntityDetail>(
    LegalEntityDetailContext
  );
  return (
    <div className="group-action">
      <Button iconPlace="left" type="primary" size="lg" onClick={handleBack}>
        {translate("LE.btn_legal_entity_close")}
      </Button>
    </div>
  );
};

export default GroupActionDetail;
