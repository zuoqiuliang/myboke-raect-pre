import React, { useState, useEffect } from "react";
import myCollectionsStyle from "./myCollections.less";
import { history } from "umi";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "umi";
import { message } from "antd";
import { getMyCollections, uncollectArticle } from "@/api/userCenter";

function MyCollections() {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState<boolean>(false);

	// 获取收藏列表
	const fetchCollections = () => {
		setLoading(true);
		getMyCollections({})
			.then((res) => {
				console.log(res);
				if (res && res.rows) {
					setCollections(res.rows);
				}
			})
			.catch((err) => {
				console.error("获取收藏列表失败:", err);
				message.error("获取收藏列表失败，请稍后重试");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// 查看文章
	const handleView = (articleId: number) => {
		history.push(`/article/${articleId}`);
	};

	// 取消收藏
	const handleUncollect = async (id: number) => {
		try {
			await uncollectArticle(id);
			setCollections(collections.filter((collection: any) => collection.id !== id));
			message.success("取消收藏成功!");
		} catch (error) {
			console.error("取消收藏失败:", error);
			message.error("取消收藏失败，请稍后重试");
		}
	};

	// 初始化获取收藏列表
	useEffect(() => {
		fetchCollections();
	}, [userInfo.id]);

	return (
		<div className={myCollectionsStyle.my_collections_container}>
			<div className={myCollectionsStyle.section_title}>我的收藏</div>

			<div className={myCollectionsStyle.collections_list}>
				{loading ? (
					<div className={myCollectionsStyle.loading_state}>加载中...</div>
				) : collections.length === 0 ? (
					<div className={myCollectionsStyle.empty_state}>
						<div className={myCollectionsStyle.empty_text}>
							还没有收藏文章，快去浏览并收藏感兴趣的内容吧！
						</div>
						<button
							className={myCollectionsStyle.browse_btn}
							onClick={() => history.push("/")}>
							浏览文章
						</button>
					</div>
				) : (
					collections.map((collection: any) => (
						<div
							key={collection.id}
							className={myCollectionsStyle.collection_item}
							onClick={() => handleView(collection.id)}>
							<div className={myCollectionsStyle.article_header}>
								<h3 className={myCollectionsStyle.article_title}>{collection.title}</h3>
							</div>
							<div className={myCollectionsStyle.article_meta}>
								<span className={myCollectionsStyle.meta_item}>
									{collection.createdAt}
								</span>
								<span className={myCollectionsStyle.meta_item}>
									<EyeOutlined /> {collection.scanNumber || 0} 浏览
								</span>
							</div>
							<div className={myCollectionsStyle.article_content}>
								{collection.markdownContent?.substring(0, 100) || "无内容"}...
							</div>
							<div className={myCollectionsStyle.article_actions}>
								<button
									className={myCollectionsStyle.action_btn}
									onClick={(e) => {
										e.stopPropagation();
										handleView(collection.id);
									}}>
									<EyeOutlined /> 查看
								</button>
								<button
									className={`${myCollectionsStyle.action_btn} delete`}
									onClick={(e) => {
										e.stopPropagation();
										handleUncollect(collection.id);
									}}>
									<DeleteOutlined /> 取消收藏
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default MyCollections;
