import React from "react";
import { Button, Form, Input, Upload, Image, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { FormProps, GetProp, UploadFile, UploadProps, FileType } from "antd";
import { useState } from "react";

export default function ({
	fileList,
	setFileList,
	uploadUrl
}: {
	fileList: UploadFile[];
	setFileList: (fileList: UploadFile[]) => void;
	uploadUrl: (file: FileType) => Promise<string>;
}) {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const uploadButton = (
		<button style={{ border: 0, background: "none" }} type="button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>上传图片</div>
		</button>
	);
	const getBase64 = (file: FileType): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};
	const beforeUpload = (file: FileType) => {
		console.log(file);
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			message.error("只能上传 JPG/PNG 文件!");
		}
		const isLt1M = file.size / 1024 / 1024 < 1;
		if (!isLt1M) {
			message.error("图片不能超过1MB!");
		}
		return isJpgOrPng && isLt1M;
	};
	const onSuccess = (res: any, file: any) => {
		console.log(file);
		uploadUrl(file).then((res: any) => {
			if (res) {
				console.log(res);
				setFileList([
					{
						url: res
					}
				]);
			}
		});
	};
	const onRemove = (file: UploadFile) => {
		console.log(file);
		setFileList([]);
	};
	return (
		<div>
			<Upload
				action=""
				listType="picture-card"
				fileList={fileList}
				onPreview={handlePreview}
				beforeUpload={beforeUpload}
				onSuccess={onSuccess}
				onRemove={onRemove}>
				{fileList.length >= 1 ? null : uploadButton}
			</Upload>
			{previewImage && (
				<Image
					width={400}
					styles={{ root: { display: "none" } }}
					preview={{
						open: previewOpen,
						onOpenChange: (visible: boolean) => setPreviewOpen(visible),
						afterOpenChange: (visible: boolean) => !visible && setPreviewImage("")
					}}
					src={previewImage}
				/>
			)}
		</div>
	);
}
