import type { RequestConfig } from "umi";

export const request: RequestConfig = {
	timeout: 60000,
	// other axios options you want
	errorConfig: {
		// errorThrower(res) {
		// 	// const { data, msg, code } = res;
		// 	// const error: any = new Error(msg ? msg : '网络异常，请稍候重试');
		// 	// error.name = 'BizError';
		// 	// error.info = { code, msg, data };
		// 	// throw error;
		// },
		// errorHandler() {}
	},
	requestInterceptors: [
		[
			(url, options) => {
				return { url, options };
			},
			(error) => {
				return Promise.reject(error);
			}
		]
	],
	responseInterceptors: [
		[
			(response) => {
				// 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
				const { data = {} as any, config } = response;
				// do something
				// console.log(response);
				if (data.code == 200) {
					return data;
				}
				return Promise.reject(null);
			},
			(error) => {
				// 用来捕获错误，如网络错误、HTTP 错误等
				console.error(error);
				return Promise.reject(error);
			}
		]
	]
};
