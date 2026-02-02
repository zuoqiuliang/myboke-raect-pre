import React, { useState, useEffect } from "react";
import personalCenterStyle from "./index.less";
import { useRequest, history } from "umi";
import {
	UserOutlined,
	MailOutlined,
	PhoneOutlined,
	CalendarOutlined,
	HomeOutlined,
	EditOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "dva";
import { getUserInfoApi, updateUserInfo } from "@/api/userInfo";
import { Upload, Modal, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { uploadImage } from "@/api/upload";
import Wrapper from "@/components/Auth/index";

function PersonalCenter() {
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
		avatar: userInfo.avatar || ""
	});

	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");

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

	// 处理头像上传成功
	const onSuccess = (res: any, file: any) => {
		uploadImage(file).then((res: any) => {
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
			}
		});
	};

	// 处理头像删除
	const onRemove = (file: UploadFile) => {
		setFileList([]);
		setFormData({
			...formData,
			avatar: ""
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

	// 处理表单输入变化
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	// 提交表单
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await updateUserInfo(formData);
			if (res) {
				// 更新本地用户信息
				dispatch({
					type: "userModel/setUserInfo",
					payload: formData
				});
				message.success("个人信息更新成功!");
			} else {
				message.error(`个人信息更新失败: ${res.msg}`);
			}
		} catch (error) {
			console.error("更新用户信息失败:", error);
			message.error("更新用户信息失败，请稍后重试");
		}
	};

	return (
		<div className={personalCenterStyle.personal_center_container}>
			<div className={personalCenterStyle.main_content}>
				{/* 左侧用户信息 */}
				<div className={personalCenterStyle.left_con}>
					<div className={personalCenterStyle.avatar_upload}>
						<Upload
							action=""
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
					<div className={personalCenterStyle.user_name}>
						{formData.userName || "未设置用户名"}
					</div>
					<div className={personalCenterStyle.user_bio}>
						{formData.selfIntroduction || "这个人很懒，还没有填写个人简介"}
					</div>

					<div className={personalCenterStyle.user_stats}>
						<div className={personalCenterStyle.stat_item}>
							<div className={personalCenterStyle.stat_value}>12</div>
							<div className={personalCenterStyle.stat_label}>文章</div>
						</div>
						<div className={personalCenterStyle.stat_item}>
							<div className={personalCenterStyle.stat_value}>89</div>
							<div className={personalCenterStyle.stat_label}>关注</div>
						</div>
						<div className={personalCenterStyle.stat_item}>
							<div className={personalCenterStyle.stat_value}>24</div>
							<div className={personalCenterStyle.stat_label}>粉丝</div>
						</div>
					</div>

					<div className={personalCenterStyle.user_details}>
						{formData.email && (
							<div className={personalCenterStyle.detail_item}>
								<div className={personalCenterStyle.icon}>
									<MailOutlined />
								</div>
								<div className={personalCenterStyle.label}>邮箱</div>
								<div className={personalCenterStyle.value}>{formData.email}</div>
							</div>
						)}
						{formData.phone && (
							<div className={personalCenterStyle.detail_item}>
								<div className={personalCenterStyle.icon}>
									<PhoneOutlined />
								</div>
								<div className={personalCenterStyle.label}>电话</div>
								<div className={personalCenterStyle.value}>{formData.phone}</div>
							</div>
						)}
						{formData.location && (
							<div className={personalCenterStyle.detail_item}>
								<div className={personalCenterStyle.icon}>
									<HomeOutlined />
								</div>
								<div className={personalCenterStyle.label}>所在地</div>
								<div className={personalCenterStyle.value}>{formData.location}</div>
							</div>
						)}
					</div>
				</div>

				{/* 右侧编辑区域 */}
				<div className={personalCenterStyle.right_con}>
					<div className={personalCenterStyle.section_title}>编辑个人资料</div>
					<form onSubmit={handleSubmit}>
						<div className={personalCenterStyle.form_item}>
							<label className={personalCenterStyle.form_label}>用户名</label>
							<input
								type="text"
								name="userName"
								className={personalCenterStyle.form_control}
								value={formData.userName}
								onChange={handleInputChange}
								placeholder="请输入用户名"
							/>
						</div>

						<div className={personalCenterStyle.form_item}>
							<label className={personalCenterStyle.form_label}>个人简介</label>
							<textarea
								name="selfIntroduction"
								className={personalCenterStyle.form_textarea}
								value={formData.selfIntroduction}
								onChange={handleInputChange}
								placeholder="请输入个人简介"
							/>
						</div>

						<div className={personalCenterStyle.form_item}>
							<label className={personalCenterStyle.form_label}>邮箱</label>
							<input
								type="email"
								name="email"
								className={personalCenterStyle.form_control}
								value={formData.email}
								onChange={handleInputChange}
								placeholder="请输入邮箱"
							/>
						</div>

						<div className={personalCenterStyle.form_item}>
							<label className={personalCenterStyle.form_label}>电话</label>
							<input
								type="tel"
								name="phone"
								className={personalCenterStyle.form_control}
								value={formData.phone}
								onChange={handleInputChange}
								placeholder="请输入电话"
							/>
						</div>

						<div className={personalCenterStyle.form_item}>
							<label className={personalCenterStyle.form_label}>所在地</label>
							<input
								type="text"
								name="location"
								className={personalCenterStyle.form_control}
								value={formData.location}
								onChange={handleInputChange}
								placeholder="请输入所在地"
							/>
						</div>

						<button type="submit" className={personalCenterStyle.submit_btn}>
							保存更改
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Wrapper(PersonalCenter);
