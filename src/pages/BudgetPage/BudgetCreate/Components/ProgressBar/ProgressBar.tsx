import { ProcessUploadSvg } from "assets/icons";
import { fakeProgress } from "core/helpers/common";
import { useEffect, useState } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ProgressBar.scss";

type ProgressBarProps = {
  onClickCancel: () => void;
};

const ProgressBar = ({ onClickCancel }: ProgressBarProps) => {
  const [translate] = useTranslation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fakeProgress(6, setProgress); // Chạy tiến trình giả trong 3 giây
  }, []);

  return (
    <div className="progress-bar-container">
      <div>
        <img src={ProcessUploadSvg} alt="progress-bar" />
      </div>
      <div className="progress-bar-contain">
        <div className="progress-bar-header">
          <span className="progress-title">
            {translate("BG.process_upload")}
          </span>
          <span className="progress-title-progress">{progress}%</span>
        </div>
        <div className="progress-bar-body">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-bar-footer">
          <Button type="tertiary" onClick={onClickCancel}>
            {translate("BG.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
