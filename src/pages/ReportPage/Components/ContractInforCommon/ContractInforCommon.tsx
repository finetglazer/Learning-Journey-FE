import { Fragment, ReactNode } from "react";
import styles from "./ContractInforCommon.module.scss";
import { OneLineText } from "react-components-design-system";

interface ContractDataItem {
  title?: string[] | string;
  text?: ReactNode[] | ReactNode;
}

interface ContractInforCommonProps {
  contractData?: ContractDataItem[];
  column?: number; // Thêm props column, mặc định là 4
  classNameDate?: () => void;
}

export default function ContractInforCommon({
  contractData = [],
  column = 4,
}: ContractInforCommonProps) {
  return (
    <div className={styles["contract-information"]}>
      {contractData?.map((item, index) => {
        const isArray = Array.isArray(item?.title) && Array.isArray(item?.text);

        return (
          <Fragment key={index}>
            {isArray ? (
              <div
                className={styles["contract-information__row"]}
                style={{ width: `${100 / column}%` }}
              >
                {Array.isArray(item?.title) &&
                  item?.title?.map((subTitle, subIndex) => (
                    <div
                      className={styles["contract-information__col"]}
                      key={subIndex}
                    >
                      <span
                        className={styles["contract-information__box-title"]}
                      >
                        {subTitle}
                      </span>
                      <span
                        className={styles["contract-information__box-text"]}
                      >
                        {item?.text && Array.isArray(item?.text)
                          ? item?.text[subIndex]
                          : item?.text}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                className={styles["contract-information__box"]}
                style={{ width: `${100 / column}%` }}
              >
                <span className={styles["contract-information__box-title"]}>
                  {item?.title}
                </span>
                <span className={styles["contract-information__box-text"]}>
                  {item?.text}
                </span>
              </div>
            )}

            {(index + 1) % column === 0 && (
              <div className={styles["contract-information__deliver"]} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
