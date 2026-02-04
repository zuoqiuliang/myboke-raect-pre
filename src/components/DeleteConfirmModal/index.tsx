import React from "react";
import { createPortal } from "react-dom";
import styles from "./index.less";

interface DeleteConfirmModalProps {
	visible: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	loading: boolean;
	title?: string;
	message?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	visible,
	onCancel,
	onConfirm,
	loading,
	title = "确认删除",
	message = "您确定要执行此操作吗？此操作不可撤销。"
}) => {
	if (!visible) return null;

	// 处理确认按钮点击
	const handleConfirmClick = () => {
		// 确保 onConfirm 是函数且未加载中
		if (typeof onConfirm === "function" && !loading) {
			onConfirm();
		}
	};

	// 处理取消按钮点击
	const handleCancelClick = () => {
		// 确保 onCancel 是函数且未加载中
		if (typeof onCancel === "function" && !loading) {
			onCancel();
		}
	};

	// 使用 React Portal 将弹窗渲染到 document.body
	// 这样就不会受到任何父容器样式的影响
	const modalContent = (
		<div className={styles["delete-modal-backdrop"]}>
			<div className={styles["delete-modal-content"]}>
				{/* 标题栏 */}
				<div className={styles["delete-modal-header"]}>
					<div className={styles["delete-modal-title"]}>{title}</div>
				</div>

				{/* 内容区 */}
				<div className={styles["delete-modal-body"]}>
					<p className={styles["delete-modal-message"]}>{message}</p>
				</div>

				{/* 按钮区 */}
				<div className={styles["delete-modal-footer"]}>
					<button
						className={`${styles["delete-modal-btn"]} ${styles["cancel-btn"]}`}
						onClick={handleCancelClick}
						disabled={loading}>
						取消
					</button>
					<button
						className={`${styles["delete-modal-btn"]} ${styles["confirm-btn"]}`}
						onClick={handleConfirmClick}
						disabled={loading}>
						{loading ? "删除中..." : "确认删除"}
					</button>
				</div>
			</div>
		</div>
	);

	// 使用 createPortal 渲染到 document.body
	return createPortal(modalContent, document.body);
};

export default DeleteConfirmModal;
