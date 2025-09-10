import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import GroupAction from "../Components/GroupAction";
import AuthorizationInformation from "./Components/AuthorizationInformation/AuthorizationInformation";
import GeneralInformation from "./Components/GeneralInformation/GeneralInformation";
import {
  LegalEntityDetailContext,
  useLegalEntityDetailHooks,
} from "./LegalEntityDetailHooks";

const LegalEntityDetail = () => {
  const { breadcrumb, title, ...contextValue } = useLegalEntityDetailHooks({
    isDetail: false,
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
            <GroupAction />
          </PageHeader>
          <div className="tab__master m-l--sm m-r--sm">
            <GeneralInformation />
            <AuthorizationInformation />
          </div>
          {contextValue.loading && <LoadingCM />}
        </div>
      </LegalEntityDetailContext.Provider>
    </>
  );
};

export default LegalEntityDetail;
