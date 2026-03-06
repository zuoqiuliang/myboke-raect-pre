import React, { useEffect, useState } from "react";
import { useNavigate } from "umi";
import articleStyle from "../article.less";
import { useDispatch, useSelector } from "umi";
import { getUserInfoById } from "@/api/userInfo";

interface AuthorInfoProps {
	article: any;
}

export default function AuthorInfo({ article }: AuthorInfoProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [authorInfo, setAuthorInfo] = useState<any>(null);

	// 获取用户信息
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

	// 处理头像点击
	const handleAvatarClick = () => {
		// 尝试获取 userId，兼容不同的字段名
		const userId = article.userInfo?.userId;
		if (userId) {
			// 检查是否登录
			// if (isLoggedIn) {
			// 	// 已登录，跳转到用户 profile 页面
			// 	navigate(`/userProfile?userId=${userId}`);
			// } else {
			// 	// 未登录，显示登录弹窗
			// 	toLogin();
			// }
			navigate(`/userProfile?userId=${userId}`);
		}
	};

	// 使用getUserInfoById接口获取作者详细信息
	useEffect(() => {
		const userId = article.userInfo?.userId;
		if (userId) {
			getUserInfoById(userId)
				.then((res: any) => {
					if (res) {
						setAuthorInfo(res);
					}
				})
				.catch((error) => {
					console.error("获取作者信息失败:", error);
				});
		}
	}, [article.userInfo?.userId]);

	// 合并文章中的用户信息和通过接口获取的用户信息
	const displayInfo = authorInfo || article.userInfo || {};

	return (
		<div className={articleStyle.author_card}>
			<div className={articleStyle.author_header}>
				<div className={articleStyle.author_avatar}>
					<img
						src={
							displayInfo?.avatar ||
							"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
						}
						alt={displayInfo?.userName || "作者"}
						onClick={handleAvatarClick}
						style={{ cursor: "pointer" }}
					/>
				</div>
				<div className={articleStyle.author_info}>
					<h3
						className={articleStyle.author_name}
						onClick={handleAvatarClick}
						style={{ cursor: "pointer" }}>
						{displayInfo?.userName || "匿名作者"}
					</h3>
					<p className={articleStyle.author_bio}>
						{displayInfo?.selfIntroduction || "暂无简介"}
					</p>
				</div>
			</div>
			<div className={articleStyle.author_stats}>
				<div
					className={articleStyle.stat_item}
					onClick={handleAvatarClick}
					style={{ cursor: "pointer" }}>
					<span className={articleStyle.stat_value}>
						{displayInfo?.articleCount || 0}
					</span>
					<span className={articleStyle.stat_label}>文章</span>
				</div>
				<div className={articleStyle.stat_divider}></div>
				<div
					className={articleStyle.stat_item}
					onClick={handleAvatarClick}
					style={{ cursor: "pointer" }}>
					<span className={articleStyle.stat_value}>
						{displayInfo?.followerCount || 0}
					</span>
					<span className={articleStyle.stat_label}>粉丝</span>
				</div>
				<div className={articleStyle.stat_divider}></div>
				<div
					className={articleStyle.stat_item}
					onClick={handleAvatarClick}
					style={{ cursor: "pointer" }}>
					<span className={articleStyle.stat_value}>
						{displayInfo?.likeCount || displayInfo?.totalArticlesLikeCount || 0}
					</span>
					<span className={articleStyle.stat_label}>获赞</span>
				</div>
			</div>
		</div>
	);
}
