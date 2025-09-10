import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../LegalEntityDetail/LegalEntityDetailHooks";

const GroupAction = () => {
  const [translate] = useTranslation();
  const { onSave, handleBack } = useContext<LegalEntityDetail>(
    LegalEntityDetailContext
  );
  return (
    <div className="group-action">
      <Button iconPlace="left" type="secondary" size="lg" onClick={handleBack}>
        {translate("LE.btn_legal_entity_close")}
      </Button>
      <Button iconPlace="left" type="primary" size="lg" onClick={onSave}>
        {translate("LE.btn_legal_entity_save")}
      </Button>
    </div>
  );
};

export default GroupAction;
