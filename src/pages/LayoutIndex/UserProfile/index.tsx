import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "umi";
import userProfileStyle from "./index.less";
import {
	UserOutlined,
	CalendarOutlined,
	HeartOutlined,
	EyeOutlined,
	MessageOutlined,
	ArrowLeftOutlined,
	EditOutlined,
	MoreOutlined,
	TeamOutlined,
	MailOutlined
} from "@ant-design/icons";
import { getUserInfoApi, getUserInfoById } from "@/api/userInfo";
import { getMyCollections } from "@/api/userCenter";
import ArticleList from "../index/components/ArticleList";
import ArticleItem from "../index/components/ArticleItem";

export default function UserProfile() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const userId = searchParams.get("userId");
	const [userInfo, setUserInfo] = useState<any>(null);
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [activeTab, setActiveTab] = useState("posts");
	const [collections, setCollections] = useState<any[]>([]);
	const [collectionsLoading, setCollectionsLoading] = useState(false);
	const [loading, setLoading] = useState(true);

	// 获取用户信息
	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				setLoading(true);
				// 获取当前用户信息
				const currentUserRes = await getUserInfoApi();
				if (currentUserRes) {
					setCurrentUser(currentUserRes);
				}

				// 根据userId获取对应用户的信息
				let res;
				if (userId) {
					res = await getUserInfoById(userId);
				} else {
					res = await getUserInfoApi();
				}
				if (res) {
					setUserInfo(res);
				}
			} catch (error) {
				console.error("获取用户信息失败:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserInfo();
	}, [userId]);

	// 监听标签切换，获取收藏数据
	useEffect(() => {
		const fetchCollections = async () => {
			if (activeTab === "collections") {
				try {
					setCollectionsLoading(true);
					const res = await getMyCollections({ page: 1, pageSize: 10 });
					if (res?.rows) {
						setCollections(res.rows);
					}
				} catch (error) {
					console.error("获取收藏列表失败:", error);
				} finally {
					setCollectionsLoading(false);
				}
			}
		};

		fetchCollections();
	}, [activeTab]);

	// 处理返回
	const handleBack = () => {
		navigate(-1);
	};

	if (loading) {
		return <div className={userProfileStyle.loading}>加载中...</div>;
	}

	if (!userInfo) {
		return <div className={userProfileStyle.error}>用户不存在</div>;
	}

	return (
		<div className={userProfileStyle.container}>
			{/* 顶部导航栏 */}
			<div className={userProfileStyle.header}>
				<div className={userProfileStyle.header_content}>
					<div
						className={userProfileStyle.header_left}
						onClick={handleBack}
						style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
						<ArrowLeftOutlined className={userProfileStyle.back_icon} />
						<h1 className={userProfileStyle.page_title}>返回</h1>
					</div>
					<div className={userProfileStyle.header_right}>
						{/* 只有当当前用户与页面作者不是同一人时才显示关注按钮 */}
						{currentUser?.id !== userInfo?.id && (
							<button className={userProfileStyle.follow_btn}>+ 关注</button>
						)}
						{/* <button className={userProfileStyle.message_btn}>
							<MessageOutlined />
						</button> */}
					</div>
				</div>
			</div>

			{/* 用户信息头部 */}
			<div className={userProfileStyle.user_header}>
				<div className={userProfileStyle.user_header_content}>
					{/* 背景图 */}
					<div className={userProfileStyle.background}>
						<div className={userProfileStyle.background_overlay}></div>
					</div>

					{/* 用户信息卡片 */}
					<div className={userProfileStyle.user_card}>
						{/* 头像 */}
						<div className={userProfileStyle.avatar_container}>
							<img
								className={userProfileStyle.avatar}
								src={
									userInfo.avatar ||
									"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
								}
								alt={userInfo.userName}
							/>
						</div>

						{/* 用户信息 */}
						<div className={userProfileStyle.user_info}>
							<div className={userProfileStyle.user_name}>
								{userInfo.userName || "未设置用户名"}
								<span className={userProfileStyle.user_badge}>超级码力创作者</span>
							</div>
							<div className={userProfileStyle.user_bio}>
								{userInfo.selfIntroduction || "这个人很懒，还没有填写个人简介"}
							</div>
							<div className={userProfileStyle.user_meta}>
								<div className={userProfileStyle.meta_item}>
									<CalendarOutlined className={userProfileStyle.meta_icon} />
									<span>
										加入于{" "}
										{userInfo.createdAt
											? new Date(userInfo.createdAt).toLocaleDateString()
											: "未知"}
									</span>
								</div>
								{userInfo.location && (
									<div className={userProfileStyle.meta_item}>
										<UserOutlined className={userProfileStyle.meta_icon} />
										<span>{userInfo.location}</span>
									</div>
								)}
								{userInfo.careerDirection && (
									<div className={userProfileStyle.meta_item}>
										<TeamOutlined className={userProfileStyle.meta_icon} />
										<span>{userInfo.careerDirection}</span>
									</div>
								)}
								{userInfo.email && (
									<div className={userProfileStyle.meta_item}>
										<MailOutlined className={userProfileStyle.meta_icon} />
										<span>{userInfo.email}</span>
									</div>
								)}
							</div>

							{/* 统计数据 */}
							<div className={userProfileStyle.stats}>
								<div className={userProfileStyle.stat_item}>
									<div className={userProfileStyle.stat_value}>
										{userInfo.articleCount || 0}
									</div>
									<div className={userProfileStyle.stat_label}>文章</div>
								</div>
								<div className={userProfileStyle.stat_item}>
									<div className={userProfileStyle.stat_value}>
										{userInfo.followingCount || 0}
									</div>
									<div className={userProfileStyle.stat_label}>关注</div>
								</div>
								<div className={userProfileStyle.stat_item}>
									<div className={userProfileStyle.stat_value}>
										{userInfo.followerCount || 0}
									</div>
									<div className={userProfileStyle.stat_label}>粉丝</div>
								</div>
								<div className={userProfileStyle.stat_item}>
									<div className={userProfileStyle.stat_value}>
										{userInfo.totalArticlesLikeCount || 0}
									</div>
									<div className={userProfileStyle.stat_label}>获赞</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 内容导航 */}
			<div className={userProfileStyle.content_nav}>
				<div className={userProfileStyle.content_nav_content}>
					<div
						className={`${userProfileStyle.nav_item} ${activeTab === "posts" ? userProfileStyle.nav_item_active : ""}`}
						onClick={() => setActiveTab("posts")}>
						文章
					</div>
					<div
						className={`${userProfileStyle.nav_item} ${activeTab === "collections" ? userProfileStyle.nav_item_active : ""}`}
						onClick={() => setActiveTab("collections")}>
						收藏
					</div>
				</div>
			</div>

			{/* 内容区域 */}
			<div className={userProfileStyle.content}>
				<div className={userProfileStyle.content_inner}>
					{activeTab === "posts" ? (
						<ArticleList userId={userId} />
					) : activeTab === "collections" ? (
						collectionsLoading ? (
							<div className={userProfileStyle.loading}>加载收藏中...</div>
						) : collections.length > 0 ? (
							<div className={userProfileStyle.collections_list}>
								{collections.map((item) => (
									<ArticleItem key={item.id} article={item} />
								))}
							</div>
						) : (
							<div className={userProfileStyle.empty_collections}>暂无收藏</div>
						)
					) : activeTab === "topics" ? (
						<div className={userProfileStyle.empty_topics}>暂无话题</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
