import addArticleStyle from "./index.less";
import type { FormProps, GetProp, UploadFile, UploadProps, FileType } from "antd";
import { Button, Form, Input, Upload, Select, message, TreeSelect } from "antd";
import { Editor, EditorProps } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useState, useEffect, useRef } from "react";
import UploadImage from "./components/UploadImage";
import {
	getBlogTypeList,
	addArticle,
	getSignList,
	getArticleDetail,
	updateArticle
} from "@/api/article";
import { uploadImage } from "@/api/upload";
import { useNavigate, useLocation } from "umi";

export default function index() {
	type FieldType = {
		title?: string;
	};
	const editorRef = useRef<any>(null);
	const [form] = Form.useForm();
	const [blogTypeList, setBlogTypeList] = useState<any>([]);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [tagList, setTagList] = useState<any>([]);
	const [tags, setTags] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [mode, setMode] = useState<"add" | "edit" | "view">("add");
	const [articleId, setArticleId] = useState<string | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		getBlogTypeList().then((res: any) => {
			console.log(res);
			if (res) {
				setBlogTypeList(
					res.rows.map((item: any) => {
						return {
							value: item.id,
							label: item.name
						};
					})
				);
			}
		});
	}, []);

	// 处理URL参数，确定模式并获取文章详情
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const id = searchParams.get("id");
		const viewMode = searchParams.get("view");

		if (id) {
			setArticleId(id);

			if (viewMode === "true") {
				setMode("view");
			} else {
				setMode("edit");
			}

			// 获取文章详情
			setLoading(true);
			getArticleDetail(id)
				.then((res: any) => {
					if (res) {
						// 填充表单数据
						form.setFieldsValue({
							title: res.title,
							description: res.description,
							categoryId: res.categoryId,
							tags: res.tags?.map((tag: any) => tag.id)
						});

						// 设置编辑器内容
						if (editorRef.current) {
							const editorInstance = editorRef.current.getInstance();
							editorInstance.setMarkdown(res.markdownContent);
						}

						// 设置缩略图
						if (res.thumb) {
							setFileList([
								{
									uid: "1",
									name: "thumb.png",
									status: "done",
									url: res.thumb
								}
							]);
						}

						// 设置标签
						if (res.tags) {
							setTags(res.tags.map((tag: any) => tag.id));
						}
					}
				})
				.catch((error) => {
					console.error("获取文章详情失败:", error);
					message.error("获取文章详情失败");
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [location.search, form]);

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
	useEffect(() => {
		getSignList().then((res: any) => {
			console.log(res);
			if (res) {
				setTagList(
					res.map((item: any) => {
						return {
							value: item.id,
							title: item.name,
							children: item.children?.map((child: any) => {
								return {
									value: child.id,
									title: child.name
								};
							})
						};
					})
				);
			}
		});
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

		const articleData = {
			...values,
			htmlContent: html,
			thumb: fileList[0]?.url,
			toc: html,
			markdownContent: markdown
		};

		if (mode === "edit" && articleId) {
			// 编辑模式：更新文章
			updateArticle(articleId, articleData)
				.then((res: any) => {
					console.log(res);
					if (res) {
						navigate(`/personalCenter`);
						message.success("更新文章成功");
					}
				})
				.catch((error) => {
					console.error("更新文章失败:", error);
					message.error("更新文章失败");
				});
		} else {
			// 添加模式：创建新文章
			addArticle(articleData)
				.then((res: any) => {
					console.log(res);
					if (res) {
						navigate(`/`);
						message.success("创建文章成功");
					}
				})
				.catch((error) => {
					console.error("创建文章失败:", error);
					message.error("创建文章失败");
				});
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};
	const tagTreeOnChange = (values: any) => {
		console.log(values);
		// setTags(values);
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
					autoComplete="off"
					disabled={mode === "view"}>
					<Form.Item<FieldType>
						label="文章标题"
						name="title"
						rules={[
							{
								required: mode !== "view",
								message: "请输入文章标题!",
								validator: (rule: any, value: any, callback: any) => {
									if (mode === "view") return Promise.resolve();
									console.log(value);
									if (!value || value.length < 5) {
										return Promise.reject("文章标题不能少于5个字符");
									} else {
										return Promise.resolve();
									}
								}
							}
						]}>
						<Input disabled={mode === "view"} />
					</Form.Item>

					<Form.Item<FieldType> label="文章编辑">
						<Editor
							ref={editorRef}
							initialValue=""
							previewStyle="vertical"
							height="600px"
							initialEditType={mode === "view" ? "preview" : "markdown"}
							useCommandShortcut={mode !== "view"}
							disabled={mode === "view"}
						/>
					</Form.Item>
					<Form.Item name="description" label="文章描述">
						<Input.TextArea disabled={mode === "view"} />
					</Form.Item>
					<Form.Item name="thumb" label="文章缩略图">
						{mode === "view" ? (
							fileList.length > 0 ? (
								<img
									src={fileList[0].url}
									alt="文章缩略图"
									style={{ maxWidth: "200px", maxHeight: "100px" }}
								/>
							) : null
						) : (
							<UploadImage
								fileList={fileList}
								setFileList={setFileList}
								uploadUrl={uploadImage}
							/>
						)}
					</Form.Item>
					<Form.Item
						name="categoryId"
						label="文章类型"
						rules={[{ required: mode !== "view", message: "请选择文章类型!" }]}>
						<Select
							allowClear
							options={blogTypeList}
							placeholder="请选择文章类型"
							disabled={mode === "view"}
						/>
					</Form.Item>

					<Form.Item
						name="tags"
						label="添加标签"
						rules={[{ required: mode !== "view", message: "请选择标签!" }]}>
						<TreeSelect
							showSearch
							style={{ width: "100%" }}
							value={tags}
							styles={{
								popup: {
									root: { maxHeight: 400, overflow: "auto" }
								}
							}}
							placeholder="请选择标签"
							allowClear
							multiple
							treeDefaultExpandAll
							onChange={tagTreeOnChange}
							treeData={tagList}
							disabled={mode === "view"}
						/>
					</Form.Item>
					{mode !== "view" && (
						<Form.Item className="add_article_submit">
							<Button type="primary" htmlType="submit">
								{mode === "edit" ? "更新" : "提交"}
							</Button>
						</Form.Item>
					)}
				</Form>
			</div>
		</div>
	);
}
