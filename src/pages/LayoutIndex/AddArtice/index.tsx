import addArticleStyle from "./index.less";
import type { FormProps, GetProp, UploadFile, UploadProps, FileType } from "antd";
import { Button, Form, Input, Upload, Select, message } from "antd";
import { Editor, EditorProps } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useState, useEffect, useRef } from "react";
import UploadImage from "./components/UploadImage";
import { getBlogTypeList, addArticle } from "@/api/article";
import { uploadImage } from "@/api/upload";

export default function index() {
	type FieldType = {
		title?: string;
	};
	const editorRef = useRef<any>(null);
	const [form] = Form.useForm();
	const [blogTypeList, setBlogTypeList] = useState<any>([]);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	useEffect(() => {
		getBlogTypeList().then((res: any) => {
			console.log(res);
			if (res) {
				setBlogTypeList(
					res.map((item: any) => {
						return {
							value: item.id,
							label: item.name
						};
					})
				);
			}
		});
	}, []);

	// 清理编辑器资源，避免dispose错误
	useEffect(() => {
		return () => {
			if (editorRef.current) {
				try {
					const editorInstance = editorRef.current.getInstance();
					if (editorInstance && typeof editorInstance.dispose === "function") {
						editorInstance.dispose();
					}
				} catch (error) {
					console.error("Error disposing editor:", error);
				}
			}
		};
	}, []);
	const changeFormItem = (values: any) => {
		// console.log(values);
	};

	const onFinish: FormProps<FieldType>["onFinish"] = (values: any) => {
		console.log("Success:", values);
		const editorInstance = editorRef.current.getInstance();
		const html = editorInstance.getHTML();
		const markdown = editorInstance.getMarkdown();
		console.log(markdown);
		addArticle({
			...values,
			htmlContent: html,
			thumb: fileList[0]?.url,
			toc: html,
			markdownContent: markdown
		}).then((res: any) => {
			console.log(res);
			if (res) {
				message.success("创建文章成功");
			}
		});
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className={addArticleStyle.add_article_container}>
			<div className={addArticleStyle.add_article_main}>
				<Form
					name="add_article_form"
					form={form}
					className={addArticleStyle.ant_form}
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 18 }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					onValuesChange={changeFormItem}
					autoComplete="off">
					<Form.Item<FieldType>
						label="文章标题"
						name="title"
						rules={[
							{
								required: true,
								message: "请输入文章标题!",
								validator: (rule: any, value: any, callback: any) => {
									console.log(value);
									if (!value || value.length < 5) {
										return Promise.reject("文章标题不能少于5个字符");
									} else {
										return Promise.resolve();
									}
								}
							}
						]}>
						<Input />
					</Form.Item>

					<Form.Item<FieldType> label="文章编辑">
						<Editor
							ref={editorRef}
							initialValue=""
							previewStyle="vertical"
							height="600px"
							initialEditType="markdown"
							useCommandShortcut={true}
						/>
					</Form.Item>
					<Form.Item name="description" label="文章描述">
						<Input.TextArea />
					</Form.Item>
					<Form.Item name="thumb" label="文章缩略图">
						<UploadImage
							fileList={fileList}
							setFileList={setFileList}
							uploadUrl={uploadImage}
						/>
					</Form.Item>
					<Form.Item
						name="categoryId"
						label="文章类型"
						rules={[{ required: true, message: "请选择文章类型!" }]}>
						<Select allowClear options={blogTypeList} placeholder="请选择文章类型" />
					</Form.Item>

					<Form.Item className="add_article_submit">
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}
