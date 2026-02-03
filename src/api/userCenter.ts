import { request, useRequest } from "umi";
// 获取我的文章列表
export const getMyArticleList = (data: any) => {
	return request("/api/blog/user", {
		method: "GET",
		params: data
	});
};
