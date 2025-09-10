import AddEvaluationCriteria from "./AddEvaluationCriteria";
import UploadDownLoadCriteria from "./UploadDownLoadCriteria";
import styles from "./TechnicalCriteria.module.scss";

type Props = {
  contextValue?: any;
  requiredInTable?: boolean;
  isDetail?: boolean;
};

const TechnicalCriteria = (props: Props) => {
  const { contextValue, requiredInTable, isDetail = false } = props;
  return (
    <div>
      {!isDetail && (
        <div className={styles["header-tech-criteria"]}>
          <UploadDownLoadCriteria
            contextValue={contextValue}
            isDetail={isDetail}
          />
        </div>
      )}

      <AddEvaluationCriteria
        contextValue={contextValue}
        requiredInTable={requiredInTable}
        fieldName="evaluationPassFail"
        isScore={false}
        fieldTable="evaluationCriteriaBaseFlag"
        isDetail={isDetail}
      />
      <div className="m-t--xss">
        <AddEvaluationCriteria
          contextValue={contextValue}
          requiredInTable={requiredInTable}
          fieldName="evaluationScore"
          isScore={true}
          fieldTable="evaluationCriteriaBasePoint"
          isDetail={isDetail}
        />
      </div>
    </div>
  );
};

export default TechnicalCriteria;
