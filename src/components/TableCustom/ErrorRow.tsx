import { Tooltip } from "antd";
import ErrorTab from "assets/icons/ErrorTab";
import { isNil } from "lodash";
import { LayoutCell } from "react-components-design-system";

interface ErrorRowProps {
  message: string;
}

export default function ErrorRow({ message }: ErrorRowProps) {
  if (isNil(message)) {
    return;
  }

  return (
    <LayoutCell>
      <Tooltip placement="right" title={message} className="text-break-line">
        <div className="error-tab">
          <ErrorTab />
        </div>
      </Tooltip>
    </LayoutCell>
  );
}
