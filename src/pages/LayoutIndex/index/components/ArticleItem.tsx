import React from "react";
import { Link } from "umi";
import articleStyle from "./articleItem.less";
import Icon, { HomeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ArticleItem({ article }: { article: any }) {
	const scanNumberIcon = (props: any) => {
		return (
			<svg
				t="1769352140216"
				viewBox="0 0 1024 1024"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				p-id="1109"
				preserveAspectRatio="xMidYMid meet"
				{...props}>
				<path
					d="M512 416a96 96 0 1 1-96 96 96 96 0 0 1 96-96m0-64a160 160 0 1 0 160 160 160 160 0 0 0-160-160z"
					fill="currentColor"
					p-id="1110"></path>
				<path
					d="M512 298.88c188.64 0 288 113.92 366.72 213.12C800 611.36 700.64 725.12 512 725.12S224 611.36 145.28 512C224 412.64 323.36 298.88 512 298.88m0-64C264.64 234.88 147.52 406.56 64 512c83.52 105.44 200.64 277.12 448 277.12S876.48 617.44 960 512c-83.52-105.44-200.64-277.12-448-277.12z"
					fill="currentColor"
					p-id="1111"></path>
			</svg>
		);
	};

	// 格式化发布时间
	const formatPublishTime = (time: string) => {
		return dayjs(time).format("YYYY-MM-DD");
	};

	// 获取分类名称
	const getCategoryName = () => {
		// 这里假设文章对象中有分类信息，如果没有可以根据实际情况调整
		return (
			article.tags
				?.map((item: any) => (
					<span className={articleStyle.tag} key={item.id}>
						{item.name}
					</span>
				))
				.slice(0, 3) || "未添加标签"
		);
	};

	// 截取文章内容，去除markdown格式
	const getContentSummary = (content: string) => {
		// 简单去除markdown标记
		const plainText = content
			.replace(/[#*`~=+-]/g, "")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/\n/g, " ");
		return plainText;
	};

	return (
		<Link to={`/article/${article.id}`} className={articleStyle.article_link}>
			<div className={articleStyle.article_item}>
				<div className={articleStyle.left_con}>
					<div className={articleStyle.article_title}>{article.title}</div>
					<div className={articleStyle.article_content}>
						{getContentSummary(article.markdownContent)}
					</div>
					<div className={articleStyle.bottom_con}>
						<div className={articleStyle.left_info}>
							<div className={articleStyle.username}>
								{article.userInfo?.userName || "未知用户"}
							</div>
							<div className={articleStyle.separator}></div>
							<div className={articleStyle.category}>{getCategoryName()}</div>
						</div>
						<div className={articleStyle.right_info}>
							<div className={articleStyle.scanNumber}>
								<Icon
									className={articleStyle.scanNumberIcon}
									style={{ fontSize: "16px", color: "#94a3b8" }}
									component={scanNumberIcon}
								/>
								{article.scanNumber || 0}
							</div>
							<div className={articleStyle.likeNumber}>
								<Icon
									className={articleStyle.likeNumberIcon}
									style={{ fontSize: "16px", color: "#94a3b8" }}
									component={() => (
										<svg
											t="1769352140216"
											viewBox="0 0 24 24"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											preserveAspectRatio="xMidYMid meet">
											<path
												d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73z"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									)}
								/>
								{article.likeCount || 0}
							</div>
							<div className={articleStyle.publish_time}>
								{formatPublishTime(article.createdAt)}
							</div>
						</div>
					</div>
				</div>
				<div className={articleStyle.right_con}>
					<div className={articleStyle.article_thumb}>
						<img
							src={
								article.thumb ||
								"https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=technology%20blog%20placeholder%20image&image_size=square"
							}
							alt={article.title}
						/>
					</div>
				</div>
			</div>
		</Link>
	);
}
