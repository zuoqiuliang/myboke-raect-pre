import React, { useEffect, useState, useRef } from "react";
import { getArticleList } from "@/api/article";
import ArticleItem from "./ArticleItem";
import indexStyle from "../index.less";
import { Spin } from "antd";

export default function ArticleList({
	currentType,
	userId
}: {
	currentType?: string;
	userId?: string;
}) {
	const [page, setPage] = useState(1);
	const [articleList, setArticleList] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [refreshKey, setRefreshKey] = useState(0); // 用于触发刷新的 key
	const listRef = useRef<HTMLDivElement>(null);

	// 获取文章列表
	const fetchArticles = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const res = await getArticleList({
				page,
				limit: 10,
				categoryId: currentType,
				userId
			});

			if (res && res.rows) {
				let newArticleList = articleList;
				if (page === 1) {
					// 首次加载或类型切换，替换数据
					newArticleList = res.rows;
				} else {
					// 加载更多，追加数据
					newArticleList = [...articleList, ...res.rows];
				}
				setArticleList(newArticleList);
				// 判断是否还有更多数据
				setHasMore(newArticleList.length < (res.total || 0));
			} else {
				// 没有数据，设置 hasMore 为 false
				setHasMore(false);
			}
		} catch (error) {
			console.error("获取文章列表失败:", error);
		} finally {
			setLoading(false);
		}
	};

	// 首次加载和类型切换时获取数据
	useEffect(() => {
		// 类型切换时重置状态
		setPage(1);
		setArticleList([]);
		setHasMore(true);
		// 更新 refreshKey 触发 fetchArticles
		setRefreshKey((prev) => prev + 1);
	}, [currentType, userId]);

	// 当 refreshKey 变化时请求数据
	useEffect(() => {
		// 只有当 refreshKey > 0 时才请求（避免首次加载时重复请求）
		if (refreshKey > 0) {
			fetchArticles();
		}
	}, [refreshKey]);

	// 页面变化时获取数据（用于加载更多）
	useEffect(() => {
		if (page > 1) {
			fetchArticles();
		}
	}, [page]);

	// 首次加载
	useEffect(() => {
		fetchArticles();
	}, []);

	// 防抖函数
	const debounce = (func: Function, delay: number) => {
		let timeoutId: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(null, args), delay);
		};
	};

	// 滚动检测
	useEffect(() => {
		const handleScroll = () => {
			if (!listRef.current) return;

			const { scrollTop, scrollHeight, clientHeight } = listRef.current;
			// 当滚动到距离底部 100px 时加载更多
			if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && hasMore) {
				setPage((prev) => prev + 1);
			}
		};

		// 创建防抖版本的 handleScroll
		const debouncedHandleScroll = debounce(handleScroll, 300); // 300ms 防抖延迟

		const listElement = listRef.current;
		if (listElement) {
			listElement.addEventListener("scroll", debouncedHandleScroll);
			return () => listElement.removeEventListener("scroll", debouncedHandleScroll);
		}
	}, [loading, hasMore]);

	return (
		<div
			className={indexStyle.article_list}
			ref={listRef}
			style={{
				height: "calc(100vh - 100px)",
				overflowY: "auto",
				msOverflowStyle: "none", // IE and Edge
				scrollbarWidth: "none" // Firefox
			}}
			// 隐藏 WebKit 浏览器的滚动条
			onLoad={() => {
				const style = document.createElement("style");
				style.textContent = `
					.article_list::-webkit-scrollbar {
						display: none;
					}
				`;
				document.head.appendChild(style);
			}}>
			{articleList.map((item: any) => (
				<ArticleItem key={item.id} article={item} />
			))}

			{/* 加载中提示 */}
			{loading && (
				<div className={indexStyle.loading_container}>
					<Spin tip="加载中..." />
				</div>
			)}

			{/* 无更多数据提示 */}
			{!hasMore && articleList.length > 0 && (
				<div className={indexStyle.no_more_container}>没有更多数据了</div>
			)}
		</div>
	);
}
