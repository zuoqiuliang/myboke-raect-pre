import React, { useEffect, useState } from "react";
import { useParams } from "umi";
import articleStyle from "./article.less";
import { getArticleDetail } from "@/api/article";
import ArticleContent from "./components/ArticleContent";
import AuthorInfo from "./components/AuthorInfo";
import ArticleTOC from "./components/ArticleTOC";

export default function index() {
	const params = useParams();
	const [article, setArticle] = useState<any>({});
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
		</div>
	);
}
