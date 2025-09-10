import { PageHeader } from "components";
import { APP_OVERVIEW } from "config/route-const";
import { useTranslation } from "react-i18next";
import { LegalSignatureMasterContext } from "./context";
import { useLegalSignatureMasterHook } from "./LegalSignatureMasterHook";
import LegalSignatureTab from "./LegalSignatureTab/LegalSignatureTab";

const LegalSignatureMaster = () => {
  const [translate] = useTranslation();
  const { ...contextValue } = useLegalSignatureMasterHook();

  return (
    <>
      <LegalSignatureMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("legalSignature.title")}
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("legalSignature.title"),
              },
            ]}
            hasTabs={false}
          />
          <div className="tab__master pt-2">
            <LegalSignatureTab />
          </div>
        </div>
      </LegalSignatureMasterContext.Provider>
    </>
  );
};

export default LegalSignatureMaster;
