import React, { useState, useEffect } from "react";
import myCollectionsStyle from "./myCollections.less";
import { history } from "umi";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "dva";
import { message } from "antd";

// 模拟收藏数据
const mockCollections = [
	{
		id: 1,
		articleId: 101,
		title: "React Hooks 最佳实践",
		author: "张三",
		createTime: "2024-01-01 10:00:00",
		collectTime: "2024-01-05 14:30:00"
	},
	{
		id: 2,
		articleId: 102,
		title: "TypeScript 类型系统深度解析",
		author: "李四",
		createTime: "2024-01-02 14:30:00",
		collectTime: "2024-01-06 09:15:00"
	},
	{
		id: 3,
		articleId: 103,
		title: "Node.js 微服务架构设计",
		author: "王五",
		createTime: "2024-01-03 09:15:00",
		collectTime: "2024-01-07 16:45:00"
	}
];

function MyCollections() {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	const [collections, setCollections] = useState(mockCollections);

	// 查看文章
	const handleView = (articleId: number) => {
		history.push(`/articleDetail?id=${articleId}`);
	};

	// 取消收藏
	const handleUncollect = (id: number) => {
		setCollections(collections.filter((collection) => collection.id !== id));
		message.success("取消收藏成功!");
	};

	return (
		<div className={myCollectionsStyle.my_collections_container}>
			<div className={myCollectionsStyle.section_title}>我的收藏</div>

			<div className={myCollectionsStyle.collections_list}>
				{collections.length === 0 ? (
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
					collections.map((collection) => (
						<div key={collection.id} className={myCollectionsStyle.collection_item}>
							<div className={myCollectionsStyle.collection_content}>
								<h3
									className={myCollectionsStyle.article_title}
									onClick={() => handleView(collection.articleId)}>
									{collection.title}
								</h3>
								<div className={myCollectionsStyle.article_meta}>
									<span className={myCollectionsStyle.meta_item}>
										作者：{collection.author}
									</span>
									<span className={myCollectionsStyle.meta_item}>
										发布时间：{collection.createTime}
									</span>
									<span className={myCollectionsStyle.meta_item}>
										收藏时间：{collection.collectTime}
									</span>
								</div>
							</div>
							<div className={myCollectionsStyle.collection_actions}>
								<button
									className={myCollectionsStyle.action_btn}
									onClick={() => handleView(collection.articleId)}>
									<EyeOutlined /> 查看
								</button>
								<button
									className={`${myCollectionsStyle.action_btn} delete`}
									onClick={() => handleUncollect(collection.id)}>
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
