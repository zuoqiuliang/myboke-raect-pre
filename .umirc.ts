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
				{ path: "/personalCenter", component: "@/pages/LayoutIndex/PersonalCenter/index" },
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
	}
});
