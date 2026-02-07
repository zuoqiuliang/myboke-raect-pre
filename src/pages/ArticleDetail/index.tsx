import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "umi";
import { getArticleDetail } from "@/api/article";
import {
	UserOutlined,
	EyeOutlined,
	CalendarOutlined,
	TagOutlined
} from "@ant-design/icons";
import styles from "./index.less";

function ArticleDetail() {
	const history = useHistory();
	const location = useLocation();
	// 从URL参数中获取文章ID
	const articleId = new URLSearchParams(location.search).get("id");

	const [article, setArticle] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// 获取文章详情
	const fetchArticleDetail = async () => {
		if (!articleId) {
			setError("文章ID不存在");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			// 调用获取文章详情的API
			const res = await getArticleDetail(Number(articleId));
			if (res) {
				setArticle(res);
				// 更新浏览量
				// 这里可以调用更新浏览量的API
			} else {
				setError("文章不存在");
			}
		} catch (err) {
			console.error("获取文章详情失败:", err);
			setError("获取文章详情失败");
		} finally {
			setLoading(false);
		}
	};

	// 组件挂载时获取文章详情
	useEffect(() => {
		fetchArticleDetail();
	}, [articleId]);

	// 返回上一页
	const handleBack = () => {
		history.goBack();
	};

	if (loading) {
		return (
			<div className={styles.loading_container}>
				<div className={styles.loading_text}>加载中...</div>
			</div>
		);
	}

	if (error || !article) {
		return (
			<div className={styles.error_container}>
				<div className={styles.error_text}>{error || "文章不存在"}</div>
				<button className={styles.back_btn} onClick={handleBack}>
					返回
				</button>
			</div>
		);
	}

	return (
		<div className={styles.article_detail_container}>
			{/* 文章头部 */}
			<div className={styles.article_header}>
				<button className={styles.back_btn} onClick={handleBack}>
					返回
				</button>
				<h1 className={styles.article_title}>{article.title}</h1>
				<div className={styles.article_meta}>
					<span className={styles.meta_item}>
						<UserOutlined /> {article.authorName || "未知作者"}
					</span>
					<span className={styles.meta_item}>
						<CalendarOutlined /> {article.createTime}
					</span>
					<span className={styles.meta_item}>
						<EyeOutlined /> {article.scanNumber || 0} 浏览
					</span>
					{article.categoryName && (
						<span className={styles.meta_item}>
							<TagOutlined /> {article.categoryName}
						</span>
					)}
				</div>
			</div>
			{/* 文章内容 */}
			<div className={styles.article_content}>
				{/* 文章封面图 */}
				{article.thumb && (
					<div className={styles.article_cover}>
						<img src={article.thumb} alt={article.title} />
					</div>
				)}

				{/* 文章正文 */}
				<div className={styles.article_body}>
					{/* 这里需要根据文章内容的格式进行渲染 */}
					{/* 如果是 markdown 格式，需要使用 markdown 解析器 */}
					{article.content || article.markdownContent}
				</div>
			</div>
		</div>
	);
}

export default ArticleDetail;
