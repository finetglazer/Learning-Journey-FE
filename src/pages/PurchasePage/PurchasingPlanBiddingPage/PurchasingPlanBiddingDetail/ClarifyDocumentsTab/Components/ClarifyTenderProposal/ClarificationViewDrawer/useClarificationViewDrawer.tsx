import { useCallback, useState } from "react";
import { ClarificationViewDrawer } from "./ClarificationViewDrawer";
import {
  ClarificationDetailModel,
  ClarificationRecord,
} from "models/PurchasingPlan";

export const useClarificationViewDrawer = () => {
  const [visible, setVisible] = useState(false);
  const [currentData, setCurrentData] =
    useState<ClarificationDetailModel>(null);

  const openDrawer = useCallback((data: any) => {
    setCurrentData(data);
    setVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setVisible(false);
  }, []);

  const ClarificationDrawerComponent = useCallback(() => {
    return (
      <ClarificationViewDrawer
        visible={visible}
        onClose={closeDrawer}
        data={currentData}
      />
    );
  }, [visible, closeDrawer, currentData]);

  return {
    openClarificationDrawer: openDrawer,
    closeClarificationDrawer: closeDrawer,
    ClarificationDrawerComponent,
  };
};

export default useClarificationViewDrawer;
