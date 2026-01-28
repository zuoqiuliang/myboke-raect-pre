import React, { useState } from "react";
import { Button, Modal } from "antd";
import loginStyle from "./login.less";
import FormDialog from "../FormDialog/index";
import LoginForm from "./components/Login/index";
import RegisterForm from "./components/Register/index";
import classNames from "classnames";

export default function index({
	isModalOpen,
	confirm,
	close
}: {
	isModalOpen: boolean;
	confirm: () => void;
	close: () => void;
}) {
	const [currentTab, setCurrentTab] = useState("login");

	const handleOk = () => {
		confirm();
	};

	const handleCancel = () => {
		close();
	};
	function tabForm(tab: string) {
		if (tab === "login") {
			return <LoginForm handleCancel={handleCancel} />;
		} else if (tab === "register") {
			return <RegisterForm />;
		}
	}
	return (
		<div className={loginStyle.login_container}>
			<FormDialog
				title={`欢迎${currentTab === "login" ? "登录" : "注册"}超级码力博客`}
				isModalOpen={isModalOpen}
				footer={null}
				confirm={handleOk}
				close={handleCancel}>
				<div className={loginStyle.main}>
					<div className={loginStyle.tab}>
						<div
							className={classNames({
								[loginStyle.tab_item_active]: currentTab === "login",
								[loginStyle.tab_item]: true
							})}
							onClick={() => setCurrentTab("login")}>
							登录
						</div>
						<div
							className={classNames({
								[loginStyle.tab_item_active]: currentTab === "register",
								[loginStyle.tab_item]: true
							})}
							onClick={() => setCurrentTab("register")}>
							注册
						</div>
					</div>
					{tabForm(currentTab)}
				</div>
			</FormDialog>
		</div>
	);
}
