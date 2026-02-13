import React, { useEffect, useState } from "react";
import { getArticleList } from "@/api/article";
import ArticleItem from "./ArticleItem";
import indexStyle from "../index.less";

export default function ArticleList({ currentType, userId }: { currentType?: string; userId?: string }) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [articleList, setArticleList] = useState<any>([]);
	useEffect(() => {
		getArticleList({
			page: page,
			limit: limit,
			categoryId: currentType,
			userId: userId
		}).then((res: any) => {
			if (res.rows) {
				setArticleList(res.rows);
			}
		});
	}, [currentType, page, userId]);
	return (
		<div className={indexStyle.article_list}>
			{articleList.map((item: any) => {
				return <ArticleItem key={item.id} article={item} />;
			})}
		</div>
	);
}
