import React, { useState, useEffect } from "react";
import { getArticleComments, submitComment, deleteComment } from "@/api/article";
import { message } from "antd";
import { useSelector, useDispatch } from "umi";
import dayjs from "dayjs";
import articleStyle from "../article.less";

interface CommentSectionProps {
	articleId: string;
	onCommentUpdate: (count: number) => void;
}

interface Comment {
	id: string;
	content: string;
	userInfo: {
		userName: string;
		avatar: string;
	};
	createdAt: string;
}

export default function CommentSection({
	articleId,
	onCommentUpdate
}: CommentSectionProps) {
	const dispatch = useDispatch();
	// 获取用户登录状态
	const isHasAuth = useSelector((state: any) => state.userModel?.isHasAuth || false);
	const NovaAuth = useSelector((state: any) => state.userModel?.NovaAuth || null);

	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [commentContent, setCommentContent] = useState("");
	const [showLoginModal, setShowLoginModal] = useState(false);

	// 获取评论列表
	const fetchComments = async () => {
		if (!articleId) return;

		// 未登录时不调用评论接口
		if (!isHasAuth && !NovaAuth) {
			setComments([]);
			onCommentUpdate(0);
			return;
		}

		setLoading(true);
		try {
			const res = await getArticleComments(articleId);
			if (res && res.rows) {
				setComments(res.rows);
				onCommentUpdate(res.rows.length);
			} else {
				setComments([]);
				onCommentUpdate(0);
			}
		} catch (error) {
			console.error("获取评论失败:", error);
			message.error("获取评论失败，请稍后重试");
		} finally {
			setLoading(false);
		}
	};

	// 提交评论
	const handleSubmitComment = async () => {
		if (!articleId || !commentContent.trim()) {
			message.warning("请输入评论内容");
			return;
		}

		setSubmitting(true);
		try {
			const res = await submitComment({
				blogId: articleId,
				content: commentContent.trim()
			});

			if (res) {
				message.success("评论成功!");
				setCommentContent("");
				// 重新获取评论列表
				await fetchComments();
			}
		} catch (error) {
			console.error("提交评论失败:", error);
			message.error("评论失败，请稍后重试");
		} finally {
			setSubmitting(false);
		}
	};

	// 删除评论
	const handleDeleteComment = async (id: string) => {
		try {
			await deleteComment(id);
			message.success("删除评论成功!");
			// 重新获取评论列表
			await fetchComments();
		} catch (error) {
			console.error("删除评论失败:", error);
			message.error("删除评论失败，请稍后重试");
		}
	};

	// 初始化获取评论
	useEffect(() => {
		fetchComments();
	}, [articleId]);

	// 处理登录按钮点击
	const handleLoginClick = () => {
		// 打开登录弹窗
		dispatch({
			type: "loginModel/setIsShowLoginModal",
			payload: true
		});
	};

	return (
		<div className={articleStyle.comment_section}>
			<h3 className={articleStyle.comment_title}>评论 ({comments.length})</h3>

			{/* 根据登录状态显示不同内容 */}
			{!isHasAuth && !NovaAuth ? (
				/* 未登录状态 - 掘金风格 */
				<div className={articleStyle.comment_login_prompt}>
					<div className={articleStyle.login_prompt_content}>
						<h4 className={articleStyle.login_prompt_title}>登录后才能评论</h4>
						<p className={articleStyle.login_prompt_text}>
							登录后可以参与评论互动，与作者和其他读者交流想法
						</p>
						<button className={articleStyle.login_btn} onClick={handleLoginClick}>
							立即登录
						</button>
					</div>
					{comments.length > 0 && (
						<div className={articleStyle.comments_preview}>
							<h5 className={articleStyle.preview_title}>热门评论</h5>
							<div className={articleStyle.comments_list}>
								{comments.slice(0, 3).map((comment) => (
									<div key={comment.id} className={articleStyle.comment_item}>
										<div className={articleStyle.comment_avatar}>
											<img
												src={
													comment.userInfo?.avatar ||
													"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
												}
												alt={comment.userInfo?.userName}
											/>
										</div>
										<div className={articleStyle.comment_content}>
											<div className={articleStyle.comment_header}>
												<div className={articleStyle.comment_author}>
													{comment.userInfo?.userName || "匿名用户"}
												</div>
												<div className={articleStyle.comment_time}>
													{dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
												</div>
											</div>
											<div className={articleStyle.comment_text}>{comment.content}</div>
										</div>
									</div>
								))}
								{comments.length > 3 && (
									<div className={articleStyle.more_comments}>
										还有 {comments.length - 3} 条评论，登录后查看全部
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			) : (
				/* 已登录状态 - 正常评论功能 */
				<>
					{/* 评论表单 */}
					<div className={articleStyle.comment_form}>
						<textarea
							className={articleStyle.comment_input}
							placeholder="写下你的评论..."
							value={commentContent}
							onChange={(e) => setCommentContent(e.target.value)}
							rows={4}
						/>
						<button
							className={articleStyle.comment_submit}
							onClick={handleSubmitComment}
							disabled={submitting || !commentContent.trim()}>
							{submitting ? "提交中..." : "发表评论"}
						</button>
					</div>

					{/* 评论列表 */}
					<div className={articleStyle.comments_list}>
						{loading ? (
							<div className={articleStyle.loading_state}>加载评论中...</div>
						) : comments.length === 0 ? (
							<div className={articleStyle.empty_comments}>
								暂无评论，快来发表第一条评论吧！
							</div>
						) : (
							comments.map((comment) => (
								<div key={comment.id} className={articleStyle.comment_item}>
									<div className={articleStyle.comment_avatar}>
										<img
											src={
												comment.userInfo?.avatar ||
												"https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
											}
											alt={comment.userInfo?.userName}
										/>
									</div>
									<div className={articleStyle.comment_content}>
										<div className={articleStyle.comment_header}>
											<div className={articleStyle.comment_author}>
												{comment.userInfo?.userName || "匿名用户"}
											</div>
											<div className={articleStyle.comment_time}>
												{dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
											</div>
										</div>
										<div className={articleStyle.comment_text}>{comment.content}</div>
										{/* <div className={articleStyle.comment_actions}>
											<button
												className={articleStyle.comment_delete}
												onClick={() => handleDeleteComment(comment.id)}>
												删除
											</button>
										</div> */}
									</div>
								</div>
							))
						)}
					</div>
				</>
			)}
		</div>
	);
}
