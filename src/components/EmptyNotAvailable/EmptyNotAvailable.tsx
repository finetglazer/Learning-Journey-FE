import styles from "./EmptyNotAvailable.module.scss";

interface EmptyNotAvailableProps {
  text?: string;
  className?: string;
}

export default function EmptyNotAvailable({
  text,
  className,
}: EmptyNotAvailableProps) {
  return (
    <div
      className={`${styles["contract-annex-information__empty"]} ${className}`}
    >
      <span className={styles["contract-annex-information__empty-text"]}>
        {text || "N/A"}
      </span>
    </div>
  );
}
