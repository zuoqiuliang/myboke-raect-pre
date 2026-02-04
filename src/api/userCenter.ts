import { request, useRequest } from "umi";
// 获取我的文章列表
export const getMyArticleList = (data: any) => {
	return request("/api/blog/user", {
		method: "GET",
		params: data
	});
};

// 删除文章
export const deleteArticle = (id: string) => {
	return request(`/api/blog/${id}`, {
		method: "DELETE"
	});
};

// 获取我的收藏列表
export const getMyCollections = (data: any) => {
	return request("/api/userFavorite", {
		method: "GET",
		params: data
	});
};

// 收藏文章
export const collectArticle = (articleId: string) => {
	return request("/api/userFavorite", {
		method: "POST",
		data: { blogId: articleId }
	});
};

// 取消收藏
export const uncollectArticle = (id: string) => {
	return request(`/api/userFavorite/${id}`, {
		method: "DELETE"
	});
};
