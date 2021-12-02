/** 登录页 **/

// ==================
// 所需的各种插件
// ==================
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import tools from "@/util/tools";
// ==================
// 所需的所有组件
// ==================
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import Vcode from "@/components/Vcode";
import logoUrl from "@/assets/logo.png";

// ==================
// 类型声明
// ==================
import { RootState, Dispatch } from "@/store";
import { Role, Menu, Power, UserBasicInfo, Res } from "@/models/index.type";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

import { History } from "history";
import { match } from "react-router-dom";

/**
 * 除了mapState和mapDispatch
 * 每个页面都自动被注入history,location,match 3个对象
 */
type Props = {
  history: History;
  location: Location;
  match: match;
};

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 本组件
// ==================
function Login(props: Props): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 是否正在登录中
  const [rememberPassword, setRememberPassword] = useState(false); // 是否记住密码
  let uuid = ''

  // 进入登陆页时，判断之前是否保存了用户名和密码
  useEffect(() => {
    const loginInfoStorage = localStorage.getItem("loginInfo");
    if (loginInfoStorage) {
      const loginInfo = JSON.parse(loginInfoStorage);
      setRememberPassword(true);

      form.setFieldsValue({
        username: loginInfo.username,
        password: tools.uncompile(loginInfo.password),
      });
    }
    if (!loginInfoStorage) {
      document.getElementById("username")?.focus();
    } else {
      document.getElementById("vcode")?.focus();
    }
  }, [form]);

  /**
   * 执行登录
   * 这里模拟：
   * 1.登录，得到用户信息
   * 2.通过用户信息获取其拥有的所有角色信息
   * 3.通过角色信息获取其拥有的所有权限信息
   * **/
  const onLogin = useCallback(
    async (creds) => {
      let userBasicInfo: UserBasicInfo | null = null;
      let roles: Role[] = [];
      let menus: Menu[] = [];
      let powers: Power[] = [];

      /** 1.登录 （返回信息中有该用户拥有的角色id） **/
      const res1: Res | undefined = await dispatch.app.onLogin(creds);
      if (!res1 || res1.status !== 200 || !res1.data) {
        // 登录失败
        return res1;
      }

      userBasicInfo = res1.data;

      /** 2.根据角色id获取角色信息 (角色信息中有该角色拥有的菜单id和权限id) **/
      const res2 = await dispatch.sys.getRoleById({
        id: (userBasicInfo as UserBasicInfo).roles,
      });
      if (!res2 || res2.status !== 200) {
        // 角色查询失败
        return res2;
      }

      roles = res2.data.filter((item: Role) => item.conditions === 1); // conditions: 1启用 -1禁用

      /** 3.根据菜单id 获取菜单信息 **/
      const menuAndPowers = roles.reduce(
        (a, b) => [...a, ...b.menuAndPowers],
        []
      );
      const res3 = await dispatch.sys.getMenusById({
        id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
      });
      if (!res3 || res3.status !== 200) {
        // 查询菜单信息失败
        return res3;
      }

      menus = res3.data.filter((item: Menu) => item.conditions === 1);

      /** 4.根据权限id，获取权限信息 **/
      const res4 = await dispatch.sys.getPowerById({
        id: Array.from(
          new Set(menuAndPowers.reduce((a, b) => [...a, ...b.powers], []))
        ),
      });
      if (!res4 || res4.status !== 200) {
        // 权限查询失败
        return res4;
      }
      powers = res4.data.filter((item: Power) => item.conditions === 1);
      return { status: 200, data: { userBasicInfo, roles, menus, powers } };
    },
    [dispatch.sys, dispatch.app]
  );

  // 用户提交登录
  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await onLogin({ ...values, uuid });
      if (res && res.status === 200) {
        message.success("登录成功");
        if (rememberPassword) {
          localStorage.setItem(
            "loginInfo",
            JSON.stringify({
              username: values.username,
              password: tools.compile(values.password), // 密码简单加密一下再存到localStorage
            })
          ); // 保存用户名和密码
        } else {
          localStorage.removeItem("loginInfo");
        }
        /** 将这些信息加密后存入sessionStorage,并存入store **/
        sessionStorage.setItem(
          "userinfo",
          tools.compile(JSON.stringify(res.data))
        );
        await dispatch.app.setUserInfo(res.data);
        props.history.replace("/"); // 跳转到主页
      } else {
        message.error(res?.message ?? "登录失败");
        setLoading(false);
      }
    } catch (e) {
      // 验证未通过
    }
  };

  // 记住密码按钮点击
  const onRemember = (e: CheckboxChangeEvent): void => {
    setRememberPassword(e.target.checked);
  };


  return (
    <div className="page-login">
      <div className='login-box'>
        <Form form={form}>
          <div className="heading">
            <h1><img src={logoUrl} alt="logo" /></h1>
            <h2>华能智能调运系统</h2>
          </div>
          <div>
            <Form.Item
              name="username"
              rules={[
                { max: 12, message: "最大长度为12位字符" },
                {
                  required: true,
                  whitespace: true,
                  message: "请输入用户名",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ fontSize: 13 }} />}
                size="large"
                id="username" // 为了获取焦点
                placeholder="用户名"
                onPressEnter={handleSubmit}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                { max: 18, message: "最大长度18个字符" },
              ]}
            >
              <Input
                prefix={<KeyOutlined style={{ fontSize: 13 }} />}
                size="large"
                type="password"
                placeholder="密码"
                onPressEnter={handleSubmit}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  { required: true, message: "请输入验证码" },
                ]}
              >
                <Input
                  style={{ width: 240, marginRight: 4, float: 'left' }}
                  size="large"
                  id="vcode" // 为了获取焦点
                  placeholder="请输入验证码"
                  onPressEnter={handleSubmit}
                />
              </Form.Item>
              <Vcode
                height={40}
                width={108}
                onClick={(res) => {
                  console.log(res, 'res')
                  uuid = res.uuid
                }}
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                className="remember"
                checked={rememberPassword}
                onChange={onRemember}
              >
                记住密码
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                className="submit-btn"
                size="large"
                type="primary"
                loading={loading}
                block
                onClick={handleSubmit}
              >
                登录
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
