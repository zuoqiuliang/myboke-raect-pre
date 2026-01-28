import { request, useRequest } from "umi";

export const resgister = (data: any) => {
	return request("/api/user/register", {
		method: "POST",
		data
	});
};

export const login = (data: any) => {
	return request("/api/user/login", {
		method: "POST",
		data
	});
};
