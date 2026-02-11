import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import userInfoSidebarStyle from "./userInfoSidebar.less";
import {
	MailOutlined,
	PhoneOutlined,
	HomeOutlined,
	UserOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "umi";
import { getUserInfoApi } from "@/api/userInfo";
import { Upload, Modal, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { uploadImage } from "@/api/upload";

interface UserInfoSidebarMethods {
	getFileList: () => UploadFile[];
}

const UserInfoSidebar = forwardRef<UserInfoSidebarMethods, any>((props, ref) => {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	const [formData, setFormData] = useState({
		userName: userInfo.userName || "",
		selfIntroduction: userInfo.selfIntroduction || "",
		email: userInfo.email || "",
		phone: userInfo.phone || "",
		location: userInfo.location || "",
		careerDirection: userInfo.careerDirection || "",
		avatar: userInfo.avatar || ""
	});

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	// 只有当 ref 存在时才使用 useImperativeHandle
	if (ref) {
		useImperativeHandle(ref, () => ({
			// 可以暴露一些方法或状态给父组件调用
			getFileList: () => fileList
		}));
	}
	// 处理头像预览
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as File);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	// 处理头像上传前校验
	const beforeUpload = (file: File) => {
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			message.error("只能上传 JPG/PNG 文件!");
		}
		const isLt1M = file.size / 1024 / 1024 < 6;
		if (!isLt1M) {
			message.error("图片不能超过6MB!");
		}
		return isJpgOrPng && isLt1M;
	};

	// 自定义上传逻辑
	const customRequest: UploadProps["customRequest"] = ({ file, onSuccess, onError }) => {
		uploadImage(file)
			.then((res: any) => {
				if (res) {
					setFileList([
						{
							url: res
						}
					]);
					setFormData({
						...formData,
						avatar: res
					});
					// 更新全局用户信息
					dispatch({
						type: "userModel/setUserInfo",
						payload: {
							...userInfo,
							avatar: res
						}
					});
					onSuccess(res);
				} else {
					onError(new Error("上传失败"));
				}
			})
			.catch((error) => {
				onError(error);
			});
	};

	// 处理头像上传成功（现在由 customRequest 调用）
	const onSuccess = (res: any, file: any) => {
		// 这里可以添加额外的成功处理逻辑
	};

	// 处理头像删除
	const onRemove = (file: UploadFile) => {
		setFileList([]);
		setFormData({
			...formData,
			avatar: ""
		});
		// 更新全局用户信息
		dispatch({
			type: "userModel/setUserInfo",
			payload: {
				...userInfo,
				avatar: ""
			}
		});
	};

	// 生成base64预览
	const getBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	// 上传按钮
	const uploadButton = (
		<div>
			<div style={{ marginTop: 8 }}>点击上传</div>
		</div>
	);

	// 获取用户信息
	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const res = await getUserInfoApi();

				if (res) {
					setFormData({
						userName: res.userName || "",
						selfIntroduction: res.selfIntroduction || "",
						email: res.email || "",
						phone: res.phone || "",
						location: res.location || "",
						careerDirection: res.careerDirection || "",
						avatar: res.avatar || ""
					});
					// 更新fileList状态
					if (res.avatar) {
						setFileList([
							{
								url: res.avatar
							}
						]);
					} else {
						setFileList([]);
					}
				}
			} catch (error) {
				console.error("获取用户信息失败:", error);
			}
		};

		fetchUserInfo();
	}, []);

	return (
		<div className={userInfoSidebarStyle.user_info_sidebar}>
			<div className={userInfoSidebarStyle.avatar_upload}>
				<Upload
					customRequest={customRequest}
					listType="picture-circle"
					fileList={fileList}
					onPreview={handlePreview}
					beforeUpload={beforeUpload}
					onSuccess={onSuccess}
					onRemove={onRemove}>
					{fileList.length >= 1 ? null : uploadButton}
				</Upload>
				{previewImage && (
					<Modal
						open={previewOpen}
						title="预览头像"
						footer={null}
						onCancel={() => setPreviewOpen(false)}>
						<img src={previewImage} alt="头像预览" style={{ width: "100%" }} />
					</Modal>
				)}
			</div>
			<div className={userInfoSidebarStyle.user_name}>
				{formData.userName || "未设置用户名"}
			</div>
			<div className={userInfoSidebarStyle.user_bio}>
				{formData.selfIntroduction || "这个人很懒，还没有填写个人简介"}
			</div>

			<div className={userInfoSidebarStyle.user_stats}>
				<div className={userInfoSidebarStyle.stat_item}>
					<div className={userInfoSidebarStyle.stat_value}>12</div>
					<div className={userInfoSidebarStyle.stat_label}>文章</div>
				</div>
				<div className={userInfoSidebarStyle.stat_item}>
					<div className={userInfoSidebarStyle.stat_value}>89</div>
					<div className={userInfoSidebarStyle.stat_label}>关注</div>
				</div>
				<div className={userInfoSidebarStyle.stat_item}>
					<div className={userInfoSidebarStyle.stat_value}>24</div>
					<div className={userInfoSidebarStyle.stat_label}>粉丝</div>
				</div>
			</div>

			<div className={userInfoSidebarStyle.user_details}>
				{formData.email && (
					<div className={userInfoSidebarStyle.detail_item}>
						<div className={userInfoSidebarStyle.icon}>
							<MailOutlined />
						</div>
						<div className={userInfoSidebarStyle.label}>邮箱</div>
						<div className={userInfoSidebarStyle.value}>{formData.email}</div>
					</div>
				)}
				{formData.phone && (
					<div className={userInfoSidebarStyle.detail_item}>
						<div className={userInfoSidebarStyle.icon}>
							<PhoneOutlined />
						</div>
						<div className={userInfoSidebarStyle.label}>电话</div>
						<div className={userInfoSidebarStyle.value}>{formData.phone}</div>
					</div>
				)}
				{formData.location && (
					<div className={userInfoSidebarStyle.detail_item}>
						<div className={userInfoSidebarStyle.icon}>
							<HomeOutlined />
						</div>
						<div className={userInfoSidebarStyle.label}>所在地</div>
						<div className={userInfoSidebarStyle.value}>{formData.location}</div>
					</div>
				)}
				{formData.careerDirection && (
					<div className={userInfoSidebarStyle.detail_item}>
						<div className={userInfoSidebarStyle.icon}>
							<UserOutlined />
						</div>
						<div className={userInfoSidebarStyle.label}>职业方向</div>
						<div className={userInfoSidebarStyle.value}>{formData.careerDirection}</div>
					</div>
				)}
			</div>
		</div>
	);
});

UserInfoSidebar.displayName = "UserInfoSidebar";
export default UserInfoSidebar;
