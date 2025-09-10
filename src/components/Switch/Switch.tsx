import styles from "./Switch.module.scss";
import { Switch } from "antd";
import { SwitchProps } from "antd/lib";

const SwitchStatus = (props: SwitchProps) => {
  return <Switch {...props} className={styles["switch-status"]} />;
};

export default SwitchStatus;
