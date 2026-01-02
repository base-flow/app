import { Result } from "antd";
import type { FC } from "react";

const Component: FC = () => {
  return (
    <div>
      <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
    </div>
  );
};

export default Component;
