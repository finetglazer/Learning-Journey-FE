import { Add } from "@carbon/icons-react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { emptyCloudIcon } from "assets/icons";
import "./EmptyData.scss";

type EmptyDataProps = {
  addNew?: () => void;
  buttonLabel?: string;
  isButtonDisabled?: boolean;
};

const EmptyData = ({
  addNew,
  buttonLabel,
  isButtonDisabled,
}: EmptyDataProps) => {
  const [translate] = useTranslation();

  return (
    <div className="empty__wrapper">
      <img src={emptyCloudIcon} alt="img" width={140} height={140} />
      <div className="empty__body__content">
        <div className="text-break-line content">
          {translate("PL.bidding.title.add_new_data")}
        </div>
        <div className="empty__body__content__button">
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            onClick={addNew}
            disabled={isButtonDisabled}
          >
            {translate(buttonLabel) || translate("PL.txt_add_criteria")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
