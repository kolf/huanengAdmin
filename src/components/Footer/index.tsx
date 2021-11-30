/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import "./index.less";

const { Footer } = Layout;

interface Props {
  className?: string;
}

export default function AppFooter(props: Props) {
  return (
    <Footer className={`footer ${props.className}`}>
      Copyright © 2018-{new Date().getFullYear()}
      <a
        target="_blank"
        rel="noopener noreferrer"
      >
        中国华能
      </a>
         All Rights Reserved
    </Footer>
  );
}
