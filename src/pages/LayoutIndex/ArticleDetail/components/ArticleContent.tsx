import React, { useEffect, useRef, useState } from "react";
import articleStyle from "../article.less";
import dayjs from "dayjs";
import { StarOutlined, StarFilled, LikeOutlined, LikeFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "umi";

interface ArticleContentProps {
	article: any;
	commentCount?: number;
	likeCount?: number;
	isCollected?: boolean;
	isLiked?: boolean;
	onCollect?: () => void;
	onLike?: () => void;
	collecting?: boolean;
	liking?: boolean;
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

export default function ArticleContent({
	article,
	commentCount,
	likeCount,
	isCollected = false,
	isLiked = false,
	onCollect,
	onLike,
	collecting = false,
	liking = false
}: ArticleContentProps) {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	// 检查用户是否登录
	const isLoggedIn = !!userInfo?.userName;

	// 显示登录弹窗
	const toLogin = () => {
		dispatch({
			type: "loginModel/setIsShowLoginModal",
			payload: true
		});
	};

	// 复制成功提示状态
	const [copySuccess, setCopySuccess] = useState(false);

	// 复制成功后自动隐藏提示
	useEffect(() => {
		if (copySuccess) {
			const timer = setTimeout(() => {
				setCopySuccess(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [copySuccess]);

	// 调试：检查props是否正确接收
	React.useEffect(() => {
		console.log("ArticleContent props:", {
			isCollected,
			isLiked,
			onCollect,
			onLike,
			collecting,
			liking
		});
	}, [isCollected, isLiked, onCollect, onLike, collecting, liking]);
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
				<div className={articleStyle.article_actions}>
					<div
						className={`${articleStyle.action_item} ${isLiked ? articleStyle.action_item_active : ""} ${liking ? articleStyle.action_item_disabled : ""}`}
						onClick={() => {
							console.log("Like button clicked", {
								isLiked,
								likeId: article.likeId,
								onLike,
								isLoggedIn
							});
							if (!isLoggedIn) {
								toLogin();
								return;
							}
							if (!liking && onLike) {
								onLike();
							}
						}}>
						<div className={articleStyle.action_icon}>
							{isLiked ? <LikeFilled /> : <LikeOutlined />}
						</div>
						<span className={articleStyle.action_text}>
							{isLiked ? "已点赞" : "点赞"}
						</span>
						<span className={articleStyle.action_count}>{likeCount || 0}</span>
					</div>
					<div
						className={articleStyle.action_item}
						onClick={() => {
							if (!isLoggedIn) {
								toLogin();
								return;
							}
							// 这里可以添加评论区滚动或其他评论相关逻辑
						}}>
						<div className={articleStyle.action_icon}>💬</div>
						<span className={articleStyle.action_text}>评论</span>
						<span className={articleStyle.action_count}>{commentCount || 0}</span>
					</div>
					<div
						className={`${articleStyle.action_item} ${isCollected ? articleStyle.action_item_active : ""} ${collecting ? articleStyle.action_item_disabled : ""}`}
						onClick={() => {
							console.log("Collect button clicked", {
								isCollected,
								collectionId: article.collectionId,
								onCollect,
								isLoggedIn
							});
							if (!isLoggedIn) {
								toLogin();
								return;
							}
							if (!collecting && onCollect) {
								onCollect();
							}
						}}>
						<div className={articleStyle.action_icon}>
							{isCollected ? <StarFilled /> : <StarOutlined />}
						</div>
						<span className={articleStyle.action_text}>
							{isCollected ? "已收藏" : "收藏"}
						</span>
						<span className={articleStyle.action_count}>
							{article.favoriteCount || 0}
						</span>
					</div>
					<div
						className={articleStyle.action_item}
						onClick={() => {
							if (!isLoggedIn) {
								toLogin();
								return;
							}
							// 复制页面路径到剪贴板
							const currentUrl = window.location.href;
							navigator.clipboard
								.writeText(currentUrl)
								.then(() => {
									console.log("Page URL copied to clipboard");
									setCopySuccess(true);
								})
								.catch((err) => {
									console.error("Failed to copy: ", err);
								});
						}}>
						<div className={articleStyle.action_icon}>🔗</div>
						<span className={articleStyle.action_text}>分享</span>
						{copySuccess && <span className={articleStyle.copy_success}>复制成功</span>}
					</div>
				</div>
			</div>
		</div>
	);
}
