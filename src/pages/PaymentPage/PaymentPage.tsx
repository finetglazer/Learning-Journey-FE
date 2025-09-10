import {
  PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE,
  PAYMENT_CREATE_ADVANCE_ROUTE,
  PAYMENT_CREATE_DEPOSIT_ROUTE,
  PAYMENT_CREATE_EXPENSE_ROUTE,
  PAYMENT_CREATE_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
  PAYMENT_MASTER_ROUTE,
  ADVANCE_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  ACCOUNTING_ENTRY_DETAIL_ROUTE,
  DEPOSIT_DETAIL_ROUTE,
  // PAYMENT_ADVANCE_DETAIL_TEST_WORKFLOW_ROUTE,
  // PAYMENT_EXPENSE_DETAIL_TEST_WORKFLOW_ROUTE,
  // PAYMENT_ACCOUNTING_ENTRY_DETAIL_TEST_WORKFLOW_ROUTE,
  // PAYMENT_DEPOSIT_DETAIL_TEST_WORKFLOW_ROUTE,
} from "config/route-const";
import { ProtectedRoute } from "core/pages/Authentication/ProtectedRoute";
import { Helmet } from "react-helmet";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PaymentCreate from "./PaymentCreate/PaymentCreate";
import PaymentDetail from "./PaymentDetail/PaymentDetail";
import PaymentMaster from "./PaymentMaster/PaymentMaster";

function PaymentPage() {
  const { path } = useRouteMatch();

  return (
    <>
      <Helmet>
        <title>Portal | PaymentPage</title>
      </Helmet>
      <Switch>
        <ProtectedRoute
          path={PAYMENT_MASTER_ROUTE}
          key={PAYMENT_MASTER_ROUTE}
          component={PaymentMaster}
          auth
        />
        <ProtectedRoute
          path={PAYMENT_CREATE_ROUTE}
          key={PAYMENT_CREATE_ROUTE}
          component={PaymentCreate}
          exact
          auth
        />
        <ProtectedRoute
          path={PAYMENT_CREATE_ADVANCE_ROUTE}
          key={PAYMENT_CREATE_ADVANCE_ROUTE}
          component={PaymentCreate}
          exact
          auth
        />
        <ProtectedRoute
          exact
          path={PAYMENT_CREATE_EXPENSE_ROUTE}
          key={PAYMENT_CREATE_EXPENSE_ROUTE}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE}
          key={PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={PAYMENT_CREATE_DEPOSIT_ROUTE}
          key={PAYMENT_CREATE_DEPOSIT_ROUTE}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_REQUEST_DETAIL_ROUTE}/:id`}
          key={PAYMENT_REQUEST_DETAIL_ROUTE}
          component={PaymentDetail}
          auth
        />
        <ProtectedRoute
          exact
          path={`${ADVANCE_DETAIL_ROUTE}/:id`}
          key={ADVANCE_DETAIL_ROUTE}
          component={PaymentDetail}
          auth
        />
        <ProtectedRoute
          exact
          path={`${EXPENSE_DETAIL_ROUTE}/:id`}
          key={EXPENSE_DETAIL_ROUTE}
          component={PaymentDetail}
          auth
        />
        <ProtectedRoute
          exact
          path={`${ACCOUNTING_ENTRY_DETAIL_ROUTE}/:id`}
          key={ACCOUNTING_ENTRY_DETAIL_ROUTE}
          component={PaymentDetail}
          auth
        />
        <ProtectedRoute
          exact
          path={`${DEPOSIT_DETAIL_ROUTE}/:id`}
          key={DEPOSIT_DETAIL_ROUTE}
          component={PaymentDetail}
          auth
        />

        {/* Bên dưới test phê duyệt workflow, khi test done sẽ xoá đi  */}
        {/* <ProtectedRoute
          exact
          path={`${PAYMENT_ADVANCE_DETAIL_TEST_WORKFLOW_ROUTE}/:id`}
          key={PAYMENT_ADVANCE_DETAIL_TEST_WORKFLOW_ROUTE}
          component={PaymentDetailTestWorkflow}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_EXPENSE_DETAIL_TEST_WORKFLOW_ROUTE}/:id`}
          key={PAYMENT_EXPENSE_DETAIL_TEST_WORKFLOW_ROUTE}
          component={PaymentDetailTestWorkflow}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_ACCOUNTING_ENTRY_DETAIL_TEST_WORKFLOW_ROUTE}/:id`}
          key={PAYMENT_ACCOUNTING_ENTRY_DETAIL_TEST_WORKFLOW_ROUTE}
          component={PaymentDetailTestWorkflow}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_DEPOSIT_DETAIL_TEST_WORKFLOW_ROUTE}/:id`}
          key={PAYMENT_DEPOSIT_DETAIL_TEST_WORKFLOW_ROUTE}
          component={PaymentDetailTestWorkflow}
          auth
        /> */}
        {/*Bên trên test phê duyệt workflow, khi test done sẽ xoá đi  */}
        <ProtectedRoute
          exact
          path={`${PAYMENT_CREATE_ROUTE}/:id`}
          key={`${PAYMENT_CREATE_ROUTE}:id`}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_CREATE_ADVANCE_ROUTE}/:id`}
          key={`${PAYMENT_CREATE_ADVANCE_ROUTE}:id`}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_CREATE_EXPENSE_ROUTE}/:id`}
          key={`${PAYMENT_CREATE_EXPENSE_ROUTE}:id`}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE}/:id`}
          key={`${PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE}:id`}
          component={PaymentCreate}
          auth
        />
        <ProtectedRoute
          exact
          path={`${PAYMENT_CREATE_DEPOSIT_ROUTE}/:id`}
          key={`${PAYMENT_CREATE_DEPOSIT_ROUTE}:id`}
          component={PaymentCreate}
          auth
        />
        <Route exact path={path}>
          <Redirect to={PAYMENT_MASTER_ROUTE} />
        </Route>
      </Switch>
    </>
  );
}

export default PaymentPage;
