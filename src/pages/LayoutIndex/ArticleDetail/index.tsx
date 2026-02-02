import React, { useEffect, useState } from "react";
import { useParams } from "umi";
import articleStyle from "./article.less";
import { getArticleDetail } from "@/api/article";
import ArticleContent from "./components/ArticleContent";
import AuthorInfo from "./components/AuthorInfo";
import ArticleTOC from "./components/ArticleTOC";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

export default function index() {
	const params = useParams();
	const [article, setArticle] = useState<any>({});
	const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);

	// 滚动到顶部函数
	const scrollToTop = () => {
		// 找到左侧内容区
		const articleContent = document.querySelector(".article_detail");
		if (articleContent) {
			// 添加滚动动画类
			articleContent.style.transition = "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
			articleContent.style.transform = "translateY(-15px)";
		}

		// 使用平滑滚动到顶部
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});

		// 移除动画类
		setTimeout(() => {
			if (articleContent) {
				// 先恢复到原始位置
				articleContent.style.transform = "translateY(0)";
				// 然后移除过渡效果
				setTimeout(() => {
					articleContent.style.transition = "";
				}, 200);
			}
		}, 600);
	};

	// 滚动事件监听
	useEffect(() => {
		const handleScroll = () => {
			// 当滚动超过200px时显示按钮
			if (window.scrollY > 200) {
				setIsScrollToTopVisible(true);
			} else {
				setIsScrollToTopVisible(false);
			}
		};

		// 添加滚动事件监听
		window.addEventListener("scroll", handleScroll);

		// 清理函数
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// 获取文章详情
	useEffect(() => {
		// 获取动态路由参数id
		const articleId = params.id;
		if (articleId) {
			getArticleDetail(articleId).then((res: any) => {
				console.log(res);
				setArticle(res);
			});
		}
	}, [params.id]);
	return (
		<div className={articleStyle.article_container}>
			<div className={articleStyle.operate}>
				<div className={articleStyle.operate_item}>
					<div className={articleStyle.icon}>❤</div>
					收藏
				</div>
				<div className={articleStyle.operate_item}>
					<div className={articleStyle.icon}>👍</div>
					点赞
				</div>
				<div className={articleStyle.operate_item}>
					<div className={articleStyle.icon}>🔗</div>
					分享
				</div>
			</div>
			<div className={articleStyle.main_content}>
				<ArticleContent article={article} />
				<div className={articleStyle.article_right}>
					<AuthorInfo article={article} />
					<ArticleTOC article={article} />
				</div>
			</div>

			{/* 滚动到顶部按钮 */}
			<div
				className={`${articleStyle.scroll_to_top} ${isScrollToTopVisible ? articleStyle.scroll_to_top_visible : ""}`}
				onClick={scrollToTop}>
				<div className={articleStyle.icon}>
					<VerticalAlignTopOutlined />
				</div>
			</div>
		</div>
	);
}
