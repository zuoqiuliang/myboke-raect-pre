import React, { useEffect, useRef } from "react";
import articleStyle from "../article.less";
import dayjs from "dayjs";

interface ArticleContentProps {
	article: any;
}

// 递归获取所有TOC项的slug
const getAllTocSlugs = (tocItems: any[]): string[] => {
	let slugs: string[] = [];
	tocItems.forEach((item) => {
		slugs.push(item.slug);
		if (item.children && item.children.length > 0) {
			slugs = slugs.concat(getAllTocSlugs(item.children));
		}
	});
	return slugs;
};

export default function ArticleContent({ article }: ArticleContentProps) {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// 当文章内容加载后，为所有标题设置id，使其与TOC的slug匹配
		if (article.toc && Array.isArray(article.toc)) {
			// 使用setTimeout确保DOM已经更新
			// 递归函数：获取所有TOC项的slug
			const getAllSlugs = (tocItems: any[]): string[] => {
				let slugs: string[] = [];
				tocItems.forEach((item) => {
					slugs.push(item.slug);
					if (item.children && item.children.length > 0) {
						slugs = slugs.concat(getAllSlugs(item.children));
					}
				});
				return slugs;
			};

			// 获取所有TOC项的slug
			const allSlugs = getAllSlugs(article.toc);
			console.log("所有TOC slug:", allSlugs);

			// 在当前组件的内容中查找标题元素
			if (contentRef.current) {
				const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6");
				console.log("找到的标题数量:", headings.length);
				headings.forEach((heading, index) => {
					if (index < allSlugs.length) {
						heading.id = allSlugs[index];
						console.log(
							`设置标题id: ${allSlugs[index]}，标题内容: ${heading.textContent?.substring(0, 20)}...`
						);
					}
				});
			}
		}
	}, [article]);

	return (
		<div className={articleStyle.article_detail}>
			<div className={articleStyle.article_title}>{article.title || "文章标题"}</div>
			<div className={articleStyle.author_info}>
				<img
					className={articleStyle.avatar}
					src={
						article.userInfo?.avatar ||
						"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
					}
					alt={article.userInfo?.userName || "作者"}
				/>
				<div className={articleStyle.author_meta}>
					<div className={articleStyle.author_name}>
						{article.userInfo?.userName || "匿名作者"}
					</div>
					<div className={articleStyle.publish_info}>
						发布于{" "}
						{article.createdAt
							? dayjs(article.createdAt).format("YYYY年MM月DD日 HH:mm:ss")
							: "未知时间"}{" "}
						· {article.scanNumber || 0} 阅读
					</div>
				</div>
				<div className={articleStyle.follow_btn}>关注</div>
			</div>
			<div
				ref={contentRef}
				className={articleStyle.article_content}
				dangerouslySetInnerHTML={{ __html: article.htmlContent || "" }}></div>
			<div className={articleStyle.article_footer}>
				<div className={articleStyle.tags}>
					{article.tags?.map((tag: any, index: number) => (
						<div key={index} className={articleStyle.tag}>
							{tag.name}
						</div>
					))}
				</div>
				<div className={articleStyle.stats}>
					<div>{article.likeCount || 0} 点赞</div>
					<div>{article.commentCount || 0} 评论</div>
					<div>{article.collectCount || 0} 收藏</div>
				</div>
			</div>
		</div>
	);
}
