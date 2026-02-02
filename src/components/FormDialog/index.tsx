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
				title={title}
				maskClosable={false}
				keyboard={false}
				getContainer={false}
				closable={{ "aria-label": "Custom Close Button" }}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={footer}
				className={formDialogStyle.glass_modal}
				style={{
					background: "rgba(255, 255, 255, 0.85)",
					backdropFilter: "blur(32px)",
					WebkitBackdropFilter: "blur(32px)",
					border: "1px solid rgba(24, 144, 255, 0.3)",
					borderRadius: "20px",
					boxShadow: "0 16px 40px rgba(24, 144, 255, 0.25)"
				}}>
				{children}
			</Modal>
		</div>
	);
}
