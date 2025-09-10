import { PropsWithChildren } from "react";
import LayoutMasterActions from "./LayoutMasterActions";
import LayoutMasterContent from "./LayoutMasterContent";
import LayoutMasterTitle from "./LayoutMasterTitle";

const LayoutMaster = (props: PropsWithChildren<unknown>) => {
  const { children } = props;

  return <div className="page page-master">{children}</div>;
};
LayoutMaster.Title = LayoutMasterTitle;
LayoutMaster.Actions = LayoutMasterActions;
LayoutMaster.Content = LayoutMasterContent;

export default LayoutMaster;
