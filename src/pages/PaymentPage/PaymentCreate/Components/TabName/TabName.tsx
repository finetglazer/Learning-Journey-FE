import React from "react";
import { ErrorTab } from "assets/icons";

interface TabNameProps {
  text: string;
  isShowIconError?: boolean;
}

const TabName: React.FC<TabNameProps> = ({ text, isShowIconError = false }) => {
  return (
    <div className="tab-name d-flex align-items-center gap-2">
      {isShowIconError && <ErrorTab />}
      <span className="tab-text">{text}</span>
    </div>
  );
};

export default TabName;
