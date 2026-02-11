import React, { useState } from "react";
import { Button, Modal } from "antd";
import formDialogStyle from "./index.less";
export default function index({
	isModalOpen,
	confirm,
	close,
	footer,
	title = "标题",
	children
}: {
	isModalOpen: boolean;
	confirm: () => void;
	close: () => void;
	footer?: any;
	title?: string;
	children: React.ReactNode;
}) {
	const handleOk = () => {
		confirm();
	};

	const handleCancel = () => {
		close();
	};
	return (
		<div className={formDialogStyle.form_dialog_container}>
			<Modal
				mask={{ closable: false }}
				title={title}
				keyboard={false}
				getContainer={false}
				closable={{ "aria-label": "Custom Close Button" }}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={footer}
				className={formDialogStyle.glass_modal}>
				{children}
			</Modal>
		</div>
	);
}
