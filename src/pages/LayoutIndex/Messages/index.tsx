import React, { useState, useEffect } from "react";
import { history } from "umi";
import messageStyle from "./messages.less";
import { getMessages } from "@/api/userCenter";
import { message, Empty } from "antd";
import dayjs from "dayjs";

export default function Messages() {
	const [messages, setMessages] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [total, setTotal] = useState(0);

	// 获取消息列表
	const fetchMessages = async () => {
		setLoading(true);
		try {
			const res = await getMessages({
				page,
				pageSize
			});
			if (res && res.rows) {
				setMessages(res.rows);
				setTotal(res.count || 0);
			} else {
				setMessages([]);
				setTotal(0);
			}
		} catch (error) {
			console.error("获取消息失败:", error);
			message.error("获取消息失败，请稍后重试");
		} finally {
			setLoading(false);
		}
	};

	// 初始化获取消息
	useEffect(() => {
		fetchMessages();
	}, [page, pageSize]);

	// 查看文章详情
	const viewArticle = (articleId: string) => {
		history.push(`/article/${articleId}`);
	};

	// 查看用户个人主页
	const viewUserProfile = (userId: string) => {
		// 这里可以根据实际情况跳转到用户个人主页
		message.info("跳转到用户个人主页");
	};

	return (
		<div className={messageStyle.messages_container}>
			<div className={messageStyle.messages_header}>
				<h1 className={messageStyle.messages_title}>社区评论</h1>
				<p className={messageStyle.messages_subtitle}>查看所有用户提交的评论</p>
			</div>

			<div className={messageStyle.messages_content}>
				{loading ? (
					<div className={messageStyle.loading_state}>加载评论中...</div>
				) : messages.length === 0 ? (
					<div className={messageStyle.empty_state}>
						<Empty description="暂无评论" />
					</div>
				) : (
					<div className={messageStyle.messages_list}>
						{messages.map((msg) => (
							<div key={msg.id} className={messageStyle.message_item}>
								<div className={messageStyle.message_avatar}>
									<img
										src={
											msg.userInfo?.avatar ||
											"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
										}
										alt={msg.userInfo?.userName}
									/>
								</div>
								<div className={messageStyle.message_content}>
									<div className={messageStyle.message_header}>
										<div className={messageStyle.user_info_section}>
											<span
												className={messageStyle.message_author}
												onClick={() => viewUserProfile(msg.userInfo?.id)}>
												{msg.userInfo?.userName || "匿名用户"}
											</span>
											<div className={messageStyle.user_details}>
												<span className={messageStyle.user_location}>
													{msg.userInfo?.location || "未知地点"}
												</span>
												<span className={messageStyle.user_separator}>•</span>
												<span className={messageStyle.user_occupation}>
													{msg.userInfo?.careerDirection || "未知职业"}
												</span>
											</div>
										</div>
										<span className={messageStyle.message_time}>
											{dayjs(msg.createdAt).format("YYYY-MM-DD HH:mm")}
										</span>
									</div>
									<div className={messageStyle.message_text}>{msg.content}</div>
									<div
										className={messageStyle.article_info_section}
										onClick={() => viewArticle(msg.blogId)}>
										<div className={messageStyle.message_source}>
											<span className={messageStyle.message_source_label}>
												文章来源：
											</span>
											<span className={messageStyle.message_source_value}>
												{msg.blogInfo.title || msg.articleTitle || "未知文章"}
											</span>
											{msg.blogInfo && (
												<span className={messageStyle.article_category}>
													<span className={messageStyle.category_separator}>•</span>
													<span className={messageStyle.category_label}>分类：</span>
													<span className={messageStyle.category_value}>
														{msg.blogInfo.category}
													</span>
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{total > pageSize && (
				<div className={messageStyle.pagination}>
					<div className={messageStyle.pagination_info}>共 {total} 条评论</div>
					<div className={messageStyle.pagination_controls}>
						<button
							className={`${messageStyle.pagination_btn} ${page === 1 ? messageStyle.pagination_btn_disabled : ""}`}
							onClick={() => setPage(page - 1)}
							disabled={page === 1}>
							上一页
						</button>
						<span className={messageStyle.pagination_current}>{page}</span>
						<button
							className={`${messageStyle.pagination_btn} ${page * pageSize >= total ? messageStyle.pagination_btn_disabled : ""}`}
							onClick={() => setPage(page + 1)}
							disabled={page * pageSize >= total}>
							下一页
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
