import React, { useState, useEffect } from "react";
import indexStyle from "./index.less";
import ArticleType from "./components/ArticleType";
import ArticleList from "./components/ArticleList";
import WelcomeCard from "./components/WelcomeCard";
import RecommendedArticles from "./components/RecommendedArticles";
import beianIcon from "@/assets/beian.png";
console.log(indexStyle);
export default function index() {
	const [currentType, setCurrentType] = useState("");

	return (
		<div className={indexStyle.index_container}>
			<div className={indexStyle.types_con}>
				<ArticleType currentType={currentType} setCurrentType={setCurrentType} />
			</div>
			<div className={indexStyle.articles_con}>
				<ArticleList currentType={currentType} />
			</div>
			<div className={indexStyle.recommend_con}>
				<WelcomeCard />
				<RecommendedArticles />

				{/* 备案信息 */}
				<div className={indexStyle.beian_info}>
					<img src={beianIcon} alt="备案图标" className={indexStyle.beian_icon} />
					<a
						href="https://beian.mps.gov.cn/#/query/webSearch?code=11011502039560"
						rel="noreferrer"
						target="_blank"
						className={indexStyle.beian_link}>
						京公网安备11011502039560号
					</a>
				</div>
			</div>
		</div>
	);
}
