import { Modal, Spin } from "antd";
import "./Loading.scss";
const Loading = () => {
  return (
    <Modal open footer={null} closable={false} centered width={120}>
      <div className="ctn__loading">
        <Spin size="large" />
        <span className="text__loading">Loading...</span>
      </div>
    </Modal>
  );
};

export default Loading;
