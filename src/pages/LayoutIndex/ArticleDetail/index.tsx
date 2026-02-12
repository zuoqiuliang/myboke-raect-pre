import React, { useEffect, useState } from "react";
import { useParams } from "umi";
import articleStyle from "./article.less";
import { getArticleDetail } from "@/api/article";
import {
	collectArticle,
	uncollectArticle,
	likeArticle,
	unlikeArticle,
	followUser,
	unfollowUser
} from "@/api/userCenter";
import ArticleContent from "./components/ArticleContent";
import AuthorInfo from "./components/AuthorInfo";
import ArticleTOC from "./components/ArticleTOC";
import CommentSection from "./components/CommentSection";
import {
	VerticalAlignTopOutlined,
	StarOutlined,
	StarFilled,
	LikeOutlined,
	LikeFilled
} from "@ant-design/icons";
import { message } from "antd";

export default function index() {
	const params = useParams();
	const [article, setArticle] = useState<any>({});
	const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
	const [isCollected, setIsCollected] = useState(false);
	const [collectionId, setCollectionId] = useState<string | null>(null);
	const [collecting, setCollecting] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likeId, setLikeId] = useState<string | null>(null);
	const [liking, setLiking] = useState(false);
	const [likeCount, setLikeCount] = useState<number>(0);
	const [commentCount, setCommentCount] = useState<number>(0);
	const [isFollowing, setIsFollowing] = useState(false);
	const [following, setFollowing] = useState(false);

	// 滚动到顶部函数
	const scrollToTop = () => {
		// 找到左侧内容区
		const articleContent = document.querySelector(".article_detail");
		if (articleContent) {
			// 添加滚动动画类
			articleContent.style.transition = "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
			articleContent.style.transform = "translateY(-15px)";
		}

		// 使用平滑滚动到顶部
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});

		// 移除动画类
		setTimeout(() => {
			if (articleContent) {
				// 先恢复到原始位置
				articleContent.style.transform = "translateY(0)";
				// 然后移除过渡效果
				setTimeout(() => {
					articleContent.style.transition = "";
				}, 200);
			}
		}, 600);
	};

	// 滚动事件监听
	useEffect(() => {
		const handleScroll = () => {
			// 当滚动超过200px时显示按钮
			if (window.scrollY > 200) {
				setIsScrollToTopVisible(true);
			} else {
				setIsScrollToTopVisible(false);
			}
		};

		// 添加滚动事件监听
		window.addEventListener("scroll", handleScroll);

		// 清理函数
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// 切换收藏状态
	const handleCollect = async () => {
		console.log(params);
		const articleId: string = params.id as string;
		if (!articleId) return;

		setCollecting(true);
		try {
			if (isCollected) {
				// 取消收藏
				if (articleId) {
					console.log("取消收藏", articleId);
					const res = await uncollectArticle(articleId as string);
					console.log(res);
					setIsCollected(false);
					setCollectionId(null);
					message.success("取消收藏成功!");
				}
			} else {
				// 收藏文章
				console.log("收藏文章", articleId);
				const res = await collectArticle(articleId as string);
				if (res) {
					setIsCollected(true);
					// setCollectionId(res.id);
					message.success("收藏成功!");
				}
			}
		} catch (error) {
			console.error("操作失败:", error);
			message.error(isCollected ? "取消收藏失败" : "收藏失败");
		} finally {
			setCollecting(false);
		}
	};

	// 切换点赞状态
	const handleLike = async () => {
		const articleId: string = params.id as string;
		if (!articleId) return;

		setLiking(true);
		console.log(isLiked, articleId);
		try {
			if (isLiked) {
				// 取消点赞
				if (articleId) {
					await unlikeArticle(articleId as string);
					setIsLiked(false);
					// setLikeId(null);
					setLikeCount((prev) => Math.max(0, prev - 1));
					message.success("取消点赞成功!");
				}
			} else {
				// 点赞文章
				const res = await likeArticle(articleId as string);
				if (res) {
					setIsLiked(true);
					// setLikeId(res.id);
					setLikeCount((prev) => prev + 1);
					message.success("点赞成功!");
				}
			}
		} catch (error) {
			console.error("操作失败:", error);
			message.error(isLiked ? "取消点赞失败" : "点赞失败");
		} finally {
			setLiking(false);
		}
	};

	// 切换关注状态
	const handleFollow = async () => {
		const authorId = article.userInfo?.userId;
		if (!authorId) return;

		setFollowing(true);
		try {
			if (isFollowing) {
				// 取消关注
				await unfollowUser(authorId);
				setIsFollowing(false);
				message.success("取消关注成功!");
			} else {
				// 关注用户
				const res = await followUser(authorId);
				if (res) {
					setIsFollowing(true);
					message.success("关注成功!");
				}
			}
		} catch (error) {
			console.error("操作失败:", error);
			message.error(isFollowing ? "取消关注失败" : "关注失败");
		} finally {
			setFollowing(false);
		}
	};

	// 获取文章详情
	useEffect(() => {
		// 获取动态路由参数id
		const articleId = params.id;
		if (articleId) {
			getArticleDetail(articleId).then((res: any) => {
				console.log(res);
				setArticle(res);
				// 更新收藏状态
				setIsCollected(res.isCollected || false);
				setCollectionId(res.id || null);
				// 更新点赞状态
				setIsLiked(res.isLiked || false);
				setLikeId(res.id || null);
				setLikeCount(res.likeCount || 0);
				// 更新评论数
				setCommentCount(res.commentCount || 0);
				// 更新关注状态
				setIsFollowing(res.isFollowingAuthor || false);
			});
		}
	}, [params.id]);
	return (
		<div className={articleStyle.article_container}>
			<div className={articleStyle.main_content}>
				<div className={articleStyle.left_content}>
					<ArticleContent
						article={article}
						commentCount={commentCount}
						likeCount={likeCount}
						isCollected={isCollected}
						isLiked={isLiked}
						isFollowing={isFollowing}
						onCollect={handleCollect}
						onLike={handleLike}
						onFollow={handleFollow}
						collecting={collecting}
						liking={liking}
						following={following}
					/>
					<CommentSection
						articleId={params.id as string}
						onCommentUpdate={setCommentCount}
					/>
				</div>
				<div className={articleStyle.article_right}>
					<AuthorInfo article={article} />
					<ArticleTOC article={article} />
				</div>
			</div>

			{/* 滚动到顶部按钮 */}
			<div
				className={`${articleStyle.scroll_to_top} ${isScrollToTopVisible ? articleStyle.scroll_to_top_visible : ""}`}
				onClick={scrollToTop}>
				<div className={articleStyle.icon}>
					<VerticalAlignTopOutlined />
				</div>
			</div>
		</div>
	);
}
