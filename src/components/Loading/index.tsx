import React, { ReactElement } from 'react';
import { Spin } from 'antd';

interface Props {
  height?: number;
}

export default React.memo(function Loading({ height =200 }: Props): ReactElement {
  return (
    <Spin spinning>
      <div style={{ height, overflow: 'hidden' }} />
    </Spin>
  );
});