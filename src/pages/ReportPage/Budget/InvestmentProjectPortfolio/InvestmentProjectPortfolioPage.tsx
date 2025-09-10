import { REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER } from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Control from "./InvestmentProjectPortfolio";
import { MENU_CODE } from "config/const";

export const InvestmentProjectPortfolioPage = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <Helmet>
        <title>Portal | InvestmentProjectPortfolioPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER}
          key={REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER}
          component={Control}
          code={MENU_CODE.REPORT_INVESTMENT_PROJECT_PORTFOLIO_MASTER}
        />
        <Route exact path={path}>
          <Redirect to={REPORT_INVESTMENT_PROJECT_PORTFOLIO_ROUTER} />
        </Route>
      </Switch>
    </>
  );
};
