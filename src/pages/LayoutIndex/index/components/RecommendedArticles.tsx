import React, { useEffect, useState } from "react";
import { Link } from "umi";
import { getRecommendedArticles } from "@/api/article";
import dayjs from "dayjs";
import indexStyle from "../index.less";

interface Article {
	id: string;
	title: string;
	createdAt: string;
	scanNumber: number;
	thumb?: string;
}

const RecommendedArticles: React.FC = () => {
	const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);

	// 获取推荐文章列表
	useEffect(() => {
		// 使用专门的推荐文章接口获取热门文章
		getRecommendedArticles({
			limit: 5 // 获取前5篇推荐文章
		}).then((res: any) => {
			if (res) {
				setRecommendedArticles(res);
			}
		});
	}, []);

	// 格式化发布时间
	const formatPublishTime = (time: string) => {
		return dayjs(time).format("YYYY-MM-DD");
	};

	return (
		<div className={indexStyle.recommended_articles}>
			<div className={indexStyle.section_title}>推荐文章</div>
			<div className={indexStyle.recommended_list}>
				{recommendedArticles.map((article, index) => (
					<Link
						key={article.id}
						to={`/article/${article.id}`}
						className={indexStyle.recommended_item}>
						<div className={indexStyle.recommended_rank}>{index + 1}</div>
						<div className={indexStyle.recommended_content}>
							<div className={indexStyle.recommended_title}>{article.title}</div>
							<div className={indexStyle.recommended_meta}>
								<span className={indexStyle.recommended_time}>
									{formatPublishTime(article.createdAt)}
								</span>
								<span className={indexStyle.recommended_views}>
									浏览 {article.scanNumber || 0}
								</span>
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default RecommendedArticles;
