import { request, useRequest } from "umi";

export const getBlogTypeList = () => {
	return request("/api/blogType", {
		method: "GET"
	});
};

// 新增文章
export const addArticle = (data: any) => {
	return request("/api/blog", {
		method: "POST",
		data
	});
};

// 获取文章列表
export const getArticleList = (data: any) => {
	return request("/api/blog", {
		method: "GET",
		params: data
	});
};

// 获取文章详情
export const getArticleDetail = (id: string) => {
	return request(`/api/blog/${id}`, {
		method: "GET"
	});
};

// 获取标签列表
export const getSignList = () => {
	return request("/api/tag", {
		method: "GET"
	});
};

// 更新文章
export const updateArticle = (id: number, data: any) => {
	return request(`/api/blog/${id}`, {
		method: "PUT",
		data
	});
};
