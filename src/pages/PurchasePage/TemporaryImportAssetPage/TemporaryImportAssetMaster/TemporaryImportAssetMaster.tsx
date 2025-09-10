import { PageHeader } from "components";
import { APP_OVERVIEW } from "config/route-const";
import { useTranslation } from "react-i18next";
import {
  TemporaryImportAssetMasterContext,
  useTemporaryImportAssetMasterHook,
} from "./TemporaryImportAssetMasterHook";
import TemporaryImportAssetMasterTab from "./TemporaryImportAssetMasterTab/TemporaryImportAssetMasterTab";

import "./TemporaryImportAssetMaster.scss";

const TemporaryImportAssetMaster = () => {
  const [translate] = useTranslation();
  const { ...contextValue } = useTemporaryImportAssetMasterHook();
  return (
    <>
      <TemporaryImportAssetMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("CM.menu_temporary_import_asset")}
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("CM.menu_title_shopping"),
              },
              {
                name: translate("CM.menu_temporary_import_asset"),
              },
            ]}
            hasTabs={false}
          />
          <div className="tab__master">
            <TemporaryImportAssetMasterTab />
          </div>
        </div>
      </TemporaryImportAssetMasterContext.Provider>
    </>
  );
};

export default TemporaryImportAssetMaster;
