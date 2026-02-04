import React, { useState, useEffect } from "react";
import myArticlesStyle from "./myArticles.less";
import { history } from "umi";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "dva";
import { message } from "antd";
import { getMyArticleList, deleteArticle } from "@/api/userCenter";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

function MyArticles() {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState<boolean>(false);
	// 删除弹窗状态
	const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
	const [deleteArticleId, setDeleteArticleId] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

	function fetchMyArticleList() {
		getMyArticleList({})
			.then((res) => {
				console.log(res);
				if (res) {
					setArticles(res.rows);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
	// 编辑文章
	const handleEdit = (id: number) => {
		history.push(`/addArticle?id=${id}`);
	};

	// 删除文章
	const handleDelete = (e: React.MouseEvent, id: number) => {
		// 阻止事件冒泡
		e.stopPropagation();
		// 阻止默认行为
		e.preventDefault();
		// 设置要删除的文章ID
		setDeleteArticleId(id);
		// 显示删除弹窗
		setIsDeleteModalVisible(true);
	};

	// 确认删除文章
	const confirmDelete = async () => {
		if (!deleteArticleId) return;

		// 设置加载状态
		setDeleteLoading(true);
		try {
			// 调用删除API
			const res = await deleteArticle(deleteArticleId);
			if (res) {
				// 更新文章列表
				setArticles(articles.filter((article: any) => article.id !== deleteArticleId));
				// 显示成功消息
				message.success("文章删除成功!");
			}
		} catch (error) {
			// 显示错误消息
			message.error("删除文章失败，请稍后重试");
			console.error("删除文章失败:", error);
		} finally {
			// 关闭弹窗
			setIsDeleteModalVisible(false);
			// 重置状态
			setDeleteArticleId(null);
			setDeleteLoading(false);
		}
	};

	// 取消删除
	const cancelDelete = () => {
		// 关闭弹窗
		setIsDeleteModalVisible(false);
		// 重置状态
		setDeleteArticleId(null);
		setDeleteLoading(false);
	};

	// 查看文章
	const handleView = (id: number) => {
		// 跳转到文章详情页
		history.push(`/article/${id}`);
	};

	// 发布文章
	const handlePublish = () => {
		history.push("/addArticle");
	};

	// 获取我的文章列表
	useEffect(() => {
		fetchMyArticleList();
	}, [userInfo.id]);

	return (
		<>
			<div className={myArticlesStyle.my_articles_container}>
				<div className={myArticlesStyle.header}>
					<div className={myArticlesStyle.section_title}>我的文章</div>
					<button className={myArticlesStyle.publish_btn} onClick={handlePublish}>
						发布新文章
					</button>
				</div>

				<div className={myArticlesStyle.articles_list}>
					{articles.length === 0 ? (
						<div className={myArticlesStyle.empty_state}>
							<div className={myArticlesStyle.empty_text}>
								还没有文章，快去发布第一篇吧！
							</div>
							<button className={myArticlesStyle.publish_btn} onClick={handlePublish}>
								发布新文章
							</button>
						</div>
					) : (
						articles.map((article: any) => (
							<div
								key={article.id}
								className={myArticlesStyle.article_item}
								onClick={() => handleView(article.id)}>
								<div className={myArticlesStyle.article_header}>
									<h3 className={myArticlesStyle.article_title}>{article.title}</h3>
									<div className={myArticlesStyle.article_status}>
										{article.status === "published" ? "已发布" : "草稿"}
									</div>
								</div>
								<div className={myArticlesStyle.article_meta}>
									<span className={myArticlesStyle.meta_item}>{article.createTime}</span>
									<span className={myArticlesStyle.meta_item}>
										<EyeOutlined /> {article.scanNumber} 浏览
									</span>
								</div>
								<div className={myArticlesStyle.article_content}>
									{article.markdownContent.substring(0, 100)}...
								</div>
								<div className={myArticlesStyle.article_actions}>
									<button
										className={myArticlesStyle.action_btn}
										onClick={() => handleView(article.id)}>
										<EyeOutlined /> 查看
									</button>
									<button
										className={myArticlesStyle.action_btn}
										onClick={() => handleEdit(article.id)}>
										<EditOutlined /> 编辑
									</button>
									<button
										className={`${myArticlesStyle.action_btn} delete`}
										onClick={(e) => handleDelete(e, article.id)}>
										<DeleteOutlined /> 删除
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* 删除确认弹窗 */}
			<DeleteConfirmModal
				visible={isDeleteModalVisible}
				onCancel={cancelDelete}
				onConfirm={confirmDelete}
				loading={deleteLoading}
				title="确认删除文章"
				message="您确定要删除这篇文章吗？此操作不可撤销。"
			/>
		</>
	);
}

export default MyArticles;
