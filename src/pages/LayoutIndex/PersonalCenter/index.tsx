import React, { useState, useRef } from "react";
import personalCenterStyle from "./index.less";
import { UserOutlined, FileTextOutlined, StarOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "umi";
import UserInfoSidebar from "./components/UserInfoSidebar";
import PersonalProfile from "./PersonalProfile/PersonalProfile";
import MyArticles from "./MyArticles/MyArticles";
import MyCollections from "./MyCollections/MyCollections";
import withAuth from "@/components/Auth/index";

function PersonalCenter() {
	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});
	const [activeTab, setActiveTab] = useState("profile");
	const userInfoSidebarRef = useRef<any>(null);

	// 处理tab点击
	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};
	const getFileList = () => {
		console.log(userInfoSidebarRef.current?.getFileList());
		return userInfoSidebarRef.current?.getFileList();
	};
	// 根据activeTab渲染对应的组件
	const renderContent = () => {
		switch (activeTab) {
			case "profile":
				return <PersonalProfile getFileList={getFileList} />;
			case "articles":
				return <MyArticles />;
			case "collections":
				return <MyCollections />;
			default:
				return <PersonalProfile getFileList={getFileList} />;
		}
	};

	return (
		<div className={personalCenterStyle.personal_center_container}>
			<div className={personalCenterStyle.main_content}>
				{/* 左侧tab栏 */}
				<div className={personalCenterStyle.left_con}>
					<div className={personalCenterStyle.tab_container}>
						<div className={personalCenterStyle.tab_title}>个人中心</div>
						<div className={personalCenterStyle.tab_list}>
							<div
								className={`${personalCenterStyle.tab_item} ${activeTab === "profile" ? personalCenterStyle.tab_item_active : ""}`}
								onClick={() => handleTabClick("profile")}>
								<div className={personalCenterStyle.tab_icon}>
									<UserOutlined />
								</div>
								<div className={personalCenterStyle.tab_text}>个人资料</div>
							</div>
							<div
								className={`${personalCenterStyle.tab_item} ${activeTab === "articles" ? personalCenterStyle.tab_item_active : ""}`}
								onClick={() => handleTabClick("articles")}>
								<div className={personalCenterStyle.tab_icon}>
									<FileTextOutlined />
								</div>
								<div className={personalCenterStyle.tab_text}>我的文章</div>
							</div>
							<div
								className={`${personalCenterStyle.tab_item} ${activeTab === "collections" ? personalCenterStyle.tab_item_active : ""}`}
								onClick={() => handleTabClick("collections")}>
								<div className={personalCenterStyle.tab_icon}>
									<StarOutlined />
								</div>
								<div className={personalCenterStyle.tab_text}>我的收藏</div>
							</div>
						</div>
					</div>
				</div>

				{/* 中间内容区域 */}
				<div className={personalCenterStyle.middle_con}>{renderContent()}</div>

				{/* 右侧个人信息区域 */}
				<div className={personalCenterStyle.right_con}>
					<UserInfoSidebar ref={userInfoSidebarRef} />
				</div>
			</div>
		</div>
	);
}

export default withAuth(PersonalCenter);
