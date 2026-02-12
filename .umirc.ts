import { defineConfig } from "umi";
export default defineConfig({
	alias: {
		"@": "/src"
	},
	routes: [
		{
			path: "/",
			component: "@/pages/LayoutIndex",
			routes: [
				{ path: "/", component: "@/pages/LayoutIndex/index" },
				{ path: "/article/:id", component: "@/pages/LayoutIndex/ArticleDetail/index" },
				{ path: "/addArticle", component: "@/pages/LayoutIndex/AddArtice/index" },
				{
					path: "/personalCenter",
					component: "@/pages/LayoutIndex/PersonalCenter/index"
				},
				{ path: "/messages", component: "@/pages/LayoutIndex/Messages/index" }
			]
		}
	],
	npmClient: "pnpm",
	plugins: [
		"@umijs/plugins/dist/request",
		"@umijs/plugins/dist/antd",
		"@umijs/plugins/dist/dva"
	],
	request: { dataField: "data" },
	antd: {},
	dva: {},
	proxy: {
		"/api": {
			target: "http://localhost:3009",
			changeOrigin: true,
			pathRewrite: (path) => path.replace(/^\/api/, "/api")
		}
	},
	esbuildMinifyIIFE: true,
	// 配置 Webpack 构建
	chainWebpack(config: any) {
		// 移除默认的字体文件处理规则
		config.module.rules.delete("font");

		// 为字体文件添加新的处理规则
		config.module
			.rule("fonts")
			.test(/\.(woff|woff2|ttf|eot|otf)$/)
			.type("asset/resource")
			.generator({
				filename: "fonts/[name].[hash:8][ext]"
			});

		// 确保 css-loader 正确处理字体文件路径
		config.module
			.rule("css")
			.oneOf("normal")
			.use("css-loader")
			.tap((options: any) => {
				return {
					...options,
					url: {
						filter: (url: string) => {
							// 对于字体文件，使用我们的自定义处理规则
							if (/(woff|woff2|ttf|eot|otf)$/.test(url)) {
								return false;
							}
							// 对于其他资源，使用默认处理方式
							return true;
						}
					}
				};
			});

		// 确保 less-loader 正确处理字体文件路径
		config.module
			.rule("less")
			.oneOf("normal")
			.use("css-loader")
			.tap((options: any) => {
				return {
					...options,
					url: {
						filter: (url: string) => {
							// 对于字体文件，使用我们的自定义处理规则
							if (/(woff|woff2|ttf|eot|otf)$/.test(url)) {
								return false;
							}
							// 对于其他资源，使用默认处理方式
							return true;
						}
					}
				};
			});
	}
});
