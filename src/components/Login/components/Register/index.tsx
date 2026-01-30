import React from "react";
import registerStyle from "./index.less";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message } from "antd";
import { resgister } from "@/api/login";
export default function RegisterForm() {
	type FieldType = {
		phone?: string;
		password?: string;
		confirmPassword?: string;
	};

	const onFinish: FormProps<FieldType>["onFinish"] = (values: any) => {
		console.log("Success:", values);
		resgister(values)
			.then((res) => {
				console.log(res);
				if (res) {
					message.success("注册成功!");
				} else {
					message.error(res.msg || "注册失败!");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};
	const [form] = Form.useForm();

	// 手机号校验规则
	const phoneValidator = (rule: any, value: any) => {
		console.log(value);
		if (!/^1[3-9]\d{9}$/.test(value)) {
			return Promise.reject("请输入正确的手机号!");
		}
		return Promise.resolve();
	};

	// 密码校验规则
	const passwordValidator = (rule: any, value: any) => {
		const passwordRegex =
			/^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()\-_=+\|\[\]{};:'",<.>/?\s]).{8,64}$/;
		if (!passwordRegex.test(value)) {
			return Promise.reject(
				"密码必须包含至少1个大写字母、1个数字和1个特殊字符，长度8-64个字符!"
			);
		}
		return Promise.resolve();
	};

	// 确认密码校验规则
	const confirmPasswordValidator = (rule: any, value: any) => {
		const password = form.getFieldValue("password");
		if (value && password !== value) {
			return Promise.reject(new Error("两次输入密码不一致!"));
		}
		return Promise.resolve();
	};
	return (
		<div className={registerStyle.register_form_container}>
			<Form
				form={form}
				name="register_form"
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
					rules={[
						{ required: true, message: "请输入手机号!", validator: phoneValidator }
					]}>
					<Input placeholder="请输入手机号" />
				</Form.Item>

				<Form.Item<FieldType>
					label="密码"
					name="password"
					hasFeedback
					rules={[
						{ required: true, message: "请输入密码!" },
						{ validator: passwordValidator }
					]}>
					<Input.Password placeholder="请输入密码" />
				</Form.Item>

				<Form.Item<FieldType>
					label="确认密码"
					name="confirmPassword"
					hasFeedback
					rules={[
						{ required: true, message: "请输入确认密码!" },
						{ validator: confirmPasswordValidator }
					]}>
					<Input.Password placeholder="请输入确认密码" />
				</Form.Item>

				<Form.Item label={null}>
					<Button
						type="primary"
						htmlType="submit"
						className={registerStyle.register_button}>
						注册
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
