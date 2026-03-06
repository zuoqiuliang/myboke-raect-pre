import React, { useState, useEffect } from "react";
import indexStyle from "./index.less";
import ArticleType from "./components/ArticleType";
import ArticleList from "./components/ArticleList";
import WelcomeCard from "./components/WelcomeCard";
import RecommendedArticles from "./components/RecommendedArticles";
import beianIcon from "@/assets/beian.png";
import weixinCode from "@/assets/weixin_code.png";
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

				{/* 联系博主 */}
				<div className={indexStyle.contact_blogger}>
					<div className={indexStyle.section_title}>联系博主</div>
					<div className={indexStyle.qr_code_container}>
						<img src={weixinCode} alt="联系博主二维码" className={indexStyle.qr_code} />
						<div className={indexStyle.qr_code_text}>扫码添加微信</div>
					</div>
				</div>

				{/* 备案信息 */}
				<div className={indexStyle.beian_info}>
					<div className={indexStyle.beian_text}>
						<div className={indexStyle.beian_item}>
							<span className={indexStyle.beian_spacer}></span>
							<a
								href="https://beian.miit.gov.cn"
								rel="noreferrer"
								target="_blank"
								className={indexStyle.beian_link}>
								京ICP备2026007952号-1
							</a>
						</div>
						<div className={indexStyle.beian_item}>
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
			</div>
		</div>
	);
}
