import { request, useRequest } from "umi";

export const updateUserInfo = (data: any) => {
	return request("/api/userInfo/update", {
		method: "POST",
		data
	});
};

// 查询用户信息
export const getUserInfoApi = () => {
	return request("/api/userInfo", {
		method: "GET"
	});
};
