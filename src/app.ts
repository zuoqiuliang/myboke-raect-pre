import type { RequestConfig } from "umi";

// 全局loading状态管理
let loadingCount = 0;
let loadingTimer: NodeJS.Timeout | null = null;

const showLoading = () => {
	if (loadingCount === 0) {
		// 延迟显示loading，避免短暂请求造成的闪烁
		loadingTimer = setTimeout(() => {
			// 创建loading元素
			let loadingElement = document.getElementById("global-loading");
			if (!loadingElement) {
				loadingElement = document.createElement("div");
				loadingElement.id = "global-loading";
				loadingElement.style.cssText = `
					position: fixed;
					top: 0;
					left: 0;
					width: 100vw;
					height: 100vh;
					background: rgba(0, 0, 0, 0.3);
					backdrop-filter: blur(8px);
					-webkit-backdrop-filter: blur(8px);
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 9999;
					margin: 0;
					padding: 0;
				`;

				const loadingContent = document.createElement("div");
				loadingContent.style.cssText = `
					background: rgba(255, 255, 255, 0.85);
					backdrop-filter: blur(32px);
					-webkit-backdrop-filter: blur(32px);
					border: 1px solid rgba(24, 144, 255, 0.3);
					border-radius: 20px;
					box-shadow: 0 16px 40px rgba(24, 144, 255, 0.25);
					padding: 32px;
					text-align: center;
				`;

				const loadingIcon = document.createElement("div");
				loadingIcon.style.cssText = `
					animation: spin 1s linear infinite;
					width: 40px;
					height: 40px;
					border: 3px solid rgba(24, 144, 255, 0.3);
					border-top-color: #1890ff;
					border-radius: 50%;
					margin: 0 auto 16px;
				`;

				const loadingText = document.createElement("div");
				loadingText.style.cssText = `
					color: #1890ff;
					font-size: 14px;
					font-weight: 500;
				`;
				loadingText.textContent = "加载中...";

				const style = document.createElement("style");
				style.textContent = `
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
				`;
				document.head.appendChild(style);

				loadingContent.appendChild(loadingIcon);
				loadingContent.appendChild(loadingText);
				loadingElement.appendChild(loadingContent);
				document.body.appendChild(loadingElement);
			} else {
				loadingElement.style.display = "flex";
			}
		}, 300);
	}
	loadingCount++;
};

const hideLoading = () => {
	loadingCount--;
	if (loadingCount <= 0) {
		loadingCount = 0;
		if (loadingTimer) {
			clearTimeout(loadingTimer);
			loadingTimer = null;
		}
		const loadingElement = document.getElementById("global-loading");
		if (loadingElement) {
			loadingElement.style.display = "none";
		}
	}
};

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
				// 显示loading
				showLoading();
				return { url, options };
			},
			(error) => {
				// 隐藏loading
				hideLoading();
				return Promise.reject(error);
			}
		]
	],
	responseInterceptors: [
		[
			(response) => {
				// 隐藏loading
				hideLoading();
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
				// 隐藏loading
				hideLoading();
				// 用来捕获错误，如网络错误、HTTP 错误等
				console.error(error);
				return Promise.reject(error);
			}
		]
	]
};
