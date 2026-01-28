import { request } from "umi";
// 上传图片
export const uploadImage = (file: string) => {
	const blob = new Blob([file], { type: "base64" });
	const formData = new FormData();
	formData.append("file", blob);
	return request("/api/upload", {
		method: "POST",
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};
