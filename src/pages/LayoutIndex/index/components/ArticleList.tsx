import React, { useEffect, useState } from "react";
import { getArticleList } from "@/api/article";
import ArticleItem from "./ArticleItem";
import indexStyle from "../index.less";

export default function ArticleList({ currentType }: { currentType: string }) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [articleList, setArticleList] = useState<any>([]);
	useEffect(() => {
		console.log(currentType);
		getArticleList({
			page: page,
			limit: limit,
			categoryId: currentType
		}).then((res: any) => {
			console.log(res);
			if (res.rows) {
				setArticleList(res.rows);
				// setTotal(res[0].total);
			}
		});
	}, [currentType, page]);
	return (
		<div className={indexStyle.article_list}>
			{articleList.map((item: any) => {
				return <ArticleItem key={item.id} article={item} />;
			})}
		</div>
	);
}
