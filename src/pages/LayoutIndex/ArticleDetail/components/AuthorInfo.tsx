import React from "react";
import { useNavigate } from "umi";
import articleStyle from "../article.less";

interface AuthorInfoProps {
	article: any;
}

export default function AuthorInfo({ article }: AuthorInfoProps) {
	const navigate = useNavigate();

	// 处理头像点击
	const handleAvatarClick = () => {
		console.log("Article data:", article);
		// 尝试获取 userId，兼容不同的字段名
		const userId = article.userInfo?.userId;
		console.log("User ID:", userId);
		if (userId) {
			navigate(`/userProfile?userId=${userId}`);
		}
	};

	return (
		<div className={articleStyle.user}>
			<div className={articleStyle.user_header}>作者信息</div>
			<div className={articleStyle.user_info}>
				<img
					className={articleStyle.avatar}
					src={
						article.userInfo?.avatar ||
						"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
					}
					alt={article.userInfo?.userName || "作者"}
					onClick={handleAvatarClick}
					style={{ cursor: "pointer" }}
				/>
				<div className={articleStyle.user_meta}>
					<div
						className={articleStyle.user_name}
						onClick={handleAvatarClick}
						style={{ cursor: "pointer" }}>
						{article.userInfo?.userName || "匿名作者"}
					</div>
					<div className={articleStyle.user_desc}>
						{article.userInfo?.selfIntroduction || "暂无简介"}
					</div>
				</div>
			</div>
		</div>
	);
}
