import { CONTRACT_CLASSIFICATION_ROUTE_MASTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { ContractClassificationMaster } from "./ContractClassificationMaster";
import { MENU_CODE } from "config/const";

export const ContractClassificationPage = () => {
  const { path } = useRouteMatch();
  const [translate] = useTranslation();

  return (
    <>
      <Helmet>
        <title>{translate("CM.menu_title_contract_classification")}</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={CONTRACT_CLASSIFICATION_ROUTE_MASTER}
          key={CONTRACT_CLASSIFICATION_ROUTE_MASTER}
          component={ContractClassificationMaster}
          code={MENU_CODE.CATALOG_CONTRACT_TYPE}
        />
        <Route exact path={path}>
          <Redirect to={CONTRACT_CLASSIFICATION_ROUTE_MASTER} />
        </Route>
      </Switch>
    </>
  );
};
