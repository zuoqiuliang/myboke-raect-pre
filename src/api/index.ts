import { request, useRequest } from "umi";

export const getArticleType = () => {
	return request("/api/blogType", {
		method: "GET",
		params: {
			limit: 50
		}
	});
};
