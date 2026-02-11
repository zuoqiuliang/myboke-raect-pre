import React, { useState } from "react";
import loginStyle from "./index.less";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { login } from "@/api/login";
import { getUserInfoApi } from "@/api/userInfo";
import { useDispatch, useSelector } from "umi";
import { history } from "umi";
export default function LoginForm({ handleCancel }: { handleCancel: () => void }) {
	type FieldType = {
		phone?: string;
		password?: string;
		remember?: string;
	};
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const onFinish: FormProps<FieldType>["onFinish"] = (values: any) => {
		console.log("Success:", values);
		setLoading(true);
		login(values)
			.then((res) => {
				console.log(res);
				if (res) {
					// 登录成功后，获取用户信息
					getUserInfoApi()
						.then((userInfoRes) => {
							console.log(userInfoRes);
							if (userInfoRes) {
								dispatch({
									type: "userModel/setUserInfo",
									payload: userInfoRes
								});
								window.location.reload();
								handleCancel();
							}
						})
						.catch((err) => {
							console.log(err);
						})
						.finally(() => {
							setLoading(false);
						});
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className={loginStyle.login_form_container}>
			<Form
				name="login_form"
				labelCol={{ span: 5 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off">
				<Form.Item<FieldType>
					label="手机号"
					name="phone"
					hasFeedback
					rules={[{ required: true, message: "请输入手机号!" }]}>
					<Input placeholder="请输入手机号" disabled={loading} />
				</Form.Item>

				<Form.Item<FieldType>
					label="密码"
					name="password"
					hasFeedback
					rules={[{ required: true, message: "请输入密码!" }]}>
					<Input.Password placeholder="请输入密码" disabled={loading} />
				</Form.Item>

				<Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
					<Checkbox disabled={loading}>记住密码</Checkbox>
				</Form.Item>

				<Form.Item label={null}>
					<Button
						type="primary"
						htmlType="submit"
						className={loginStyle.login_button}
						loading={loading}>
						登录
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
