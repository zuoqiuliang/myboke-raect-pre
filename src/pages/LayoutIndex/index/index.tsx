import React, { useState, useEffect } from "react";
import indexStyle from "./index.less";
import ArticleType from "./components/ArticleType";
import ArticleList from "./components/ArticleList";
import WelcomeCard from "./components/WelcomeCard";
import RecommendedArticles from "./components/RecommendedArticles";
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
			</div>
		</div>
	);
}
