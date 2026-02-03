import React, { useState, useEffect } from "react";
import myArticlesStyle from "./myArticles.less";
import { history } from "umi";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "dva";
import { message } from "antd";
import { getMyArticleList } from "@/api/userCenter";

function MyArticles() {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	const [articles, setArticles] = useState([]);

	// 编辑文章
	const handleEdit = (id: number) => {
		history.push(`/addArticle?id=${id}`);
	};

	// 删除文章
	const handleDelete = (id: number) => {
		setArticles(articles.filter((article: any) => article.id !== id));
		message.success("文章删除成功!");
	};

	// 查看文章
	const handleView = (id: number) => {
		history.push(`/addArticle?id=${id}&view=true`);
	};

	// 发布文章
	const handlePublish = () => {
		history.push("/addArticle");
	};

	// 获取我的文章列表
	useEffect(() => {
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
	}, [userInfo.id]);

	return (
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
						<div key={article.id} className={myArticlesStyle.article_item}>
							<div className={myArticlesStyle.article_header}>
								<h3
									className={myArticlesStyle.article_title}
									onClick={() => handleView(article.id)}>
									{article.title}
								</h3>
								<div className={myArticlesStyle.article_status}>
									{article.status === "published" ? "已发布" : "草稿"}
								</div>
							</div>
							<div className={myArticlesStyle.article_meta}>
								<span className={myArticlesStyle.meta_item}>{article.createTime}</span>
								<span className={myArticlesStyle.meta_item}>
									<EyeOutlined /> {article.views} 浏览
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
									onClick={() => handleDelete(article.id)}>
									<DeleteOutlined /> 删除
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default MyArticles;
