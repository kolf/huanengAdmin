import React from "react";
import ReactDOM from "react-dom";
import { Modal, ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
const IS_REACT_16 = !!ReactDOM.createPortal;

class Mod extends React.PureComponent {
  static defaultProps = {
    width: 520,
  };

  state = {
    disabled: true,
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },
    innerHeight: 600,
  };

  componentDidMount() {
    this.setState({
      innerHeight: window.innerHeight - 200,
    });
  }

  render() {
    const { title, children, wrapClassName, ...otherProps } = this.props;
    return (
      <ConfigProvider locale={zhCN}>
        <Modal
          {...otherProps}
          title={title}
          wrapClassName={wrapClassName + " my-modal"}
          bodyStyle={{
            ...otherProps.bodyStyle,
            maxHeight: this.state.innerHeight,
            overflowY: "auto",
          }}
          cancelText="取消"
          okText="确定"
        >
          {children}
        </Modal>
      </ConfigProvider>
    );
  }
}

function modal(config) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  let currentConfig = {
    ...config,
    onCancel: close,
    visible: true,
  };

  function close(...args) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: () => {
        destroy(...args);
      },
    };
    if (IS_REACT_16) {
      render(currentConfig);
    } else {
      destroy(...args);
    }
  }
  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }
  function confirmLoading() {
    update({
      confirmLoading: true,
    });
  }
  function destroy(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult) {
      document.body.removeChild(div);
    }
    const triggerCancel =
      args && args.length && args.some((arg) => arg && arg.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
  }
  function render(props) {
    ReactDOM.render(<Mod {...props}>{props.content}</Mod>, div);
  }

  render(currentConfig);
  return {
    close,
    update,
    confirmLoading,
  };
}

export default modal;
