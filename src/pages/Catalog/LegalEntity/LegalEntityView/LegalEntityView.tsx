import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import AuthorizationInformation from "../LegalEntityDetail/Components/AuthorizationInformation/AuthorizationInformation";
import {
  LegalEntityDetailContext,
  useLegalEntityDetailHooks,
} from "../LegalEntityDetail/LegalEntityDetailHooks";
import GeneralInformationView from "./GeneralInformationView/GeneralInformationView";
import GroupActionDetail from "./GroupActionDetail";

const LegalEntityView = () => {
  const { title, breadcrumb, ...contextValue } = useLegalEntityDetailHooks({
    isDetail: true,
  });

  return (
    <>
      <LegalEntityDetailContext.Provider value={contextValue}>
        <div
          className={classNames("page-content-create", "page-content")}
          style={{ height: "100%" }}
        >
          <PageHeader
            title={title}
            breadcrumbs={breadcrumb}
            className="page-header"
            isShowBackButton
          >
            <GroupActionDetail />
          </PageHeader>
          <div className="tab__master m-l--sm m-r--sm">
            <GeneralInformationView />
            <AuthorizationInformation />
          </div>
          {contextValue.loading && <LoadingCM />}
        </div>
      </LegalEntityDetailContext.Provider>
    </>
  );
};

export default LegalEntityView;
