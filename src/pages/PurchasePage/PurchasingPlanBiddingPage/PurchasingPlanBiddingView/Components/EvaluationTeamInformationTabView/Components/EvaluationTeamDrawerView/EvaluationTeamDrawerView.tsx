/* eslint-disable import/named */
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { AdvancedCollapseView } from "components";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import "./EvaluationTeamDrawerView.scss";
import InformationReviewer from "./InformationReviewer/InformationReviewer";
import HistoryReviewTable from "./HistoryReviewTable/HistoryReviewTable";

enum EvaluationTeamDrawerViewSectionKey {
  GENERAL_INFO = "1",
  HISTORY_REVIEW = "2",
}

interface Props {
  handleClose: () => void;
  currentData?: any;
}

const EvaluationTeamDrawerView = ({ handleClose, currentData }: Props) => {
  const [translate] = useTranslationContract();

  const collapseItems: CollapseItem[] = useMemo(
    () => [
      {
        key: EvaluationTeamDrawerViewSectionKey.GENERAL_INFO,
        label: translate("PL.txt_info_reviewer"),
        children: <InformationReviewer currentData={currentData} />,
      },
      {
        key: EvaluationTeamDrawerViewSectionKey.HISTORY_REVIEW,
        label: translate("PL.txt_history_review"),
        children: (
          <HistoryReviewTable currentData={currentData?.evaluationHistories} />
        ),
      },
    ],
    [translate]
  );

  return (
    <Drawer
      numberButton={"1"}
      visible={true}
      size={"2xl"}
      loading={false}
      handleCancel={handleClose}
      handleClose={handleClose}
      isHaveCloseIcon={true}
      isShowButtonApply={false}
      isShowButtonCancel={false}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={true}
      title={
        <div className="fw-bold">
          <span>{translate("PL.title_drawer_detail_evaluation_team")}</span>
        </div>
      }
      className={"drawer_information_detail_evaluation_team"}
    >
      <AdvancedCollapseView
        className={classNames(
          "collapse__container",
          "collapse__container--not-border"
        )}
        items={collapseItems}
        defaultActiveKey={[
          EvaluationTeamDrawerViewSectionKey.GENERAL_INFO,
          EvaluationTeamDrawerViewSectionKey.HISTORY_REVIEW,
        ]}
      />
    </Drawer>
  );
};

export default EvaluationTeamDrawerView;
