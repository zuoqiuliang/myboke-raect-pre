import React, { useState, useEffect, useRef } from "react";
import headerStyle from "./header.less";
import { useRequest, history } from "umi";
import {
	PlusOutlined,
	UserOutlined,
	LogoutOutlined,
	SettingOutlined
} from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch, useSelector } from "dva";
import Wrapper from "@/components/Auth/index";

function index() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
	const headerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();
	const userInfo = useSelector((state: any) => {
		return state.userModel.userInfo;
	});

	// 监听滚动事件，控制header的显示和隐藏
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			// 当滚动距离大于100px时开始控制显示/隐藏
			if (scrollTop > 100) {
				// 向上滚动时显示header
				if (scrollTop < lastScrollTop - 10) {
					setIsVisible(true);
				}
				// 向下滚动时隐藏header
				else if (scrollTop > lastScrollTop + 10) {
					setIsVisible(false);
				}
			}
			// 滚动距离小于100px时始终显示header
			else {
				setIsVisible(true);
			}

			setLastScrollTop(scrollTop);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [lastScrollTop]);

	const addArtice = () => {
		history.push("/addArticle");
	};

	const toLogin = () => {
		dispatch({
			type: "loginModel/setIsShowLoginModal",
			payload: true
		});
	};

	// 显示下拉菜单
	const showDropdown = () => {
		setIsDropdownVisible(true);
	};

	// 隐藏下拉菜单
	const hideDropdown = () => {
		setIsDropdownVisible(false);
	};

	// 点击个人中心
	const toPersonalCenter = () => {
		history.push("/personalCenter");
		hideDropdown();
	};

	// 显示退出登录确认弹窗
	const showLogoutModal = () => {
		setIsLogoutModalVisible(true);
		hideDropdown();
	};

	// 确认退出登录
	const confirmLogout = () => {
		dispatch({
			type: "userModel/logOut",
			payload: {}
		});
		// 退出登录后，跳转到登录页
		history.push("/");
		setIsLogoutModalVisible(false);
	};

	// 取消退出登录
	const cancelLogout = () => {
		setIsLogoutModalVisible(false);
	};

	// 点击外部区域隐藏下拉菜单
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				hideDropdown();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<div
				ref={headerRef}
				className={`${headerStyle.header_container} ${isVisible ? headerStyle.header_visible : headerStyle.header_hidden}`}>
				<div className={headerStyle.main}>
					<div className={headerStyle.left_con}>
						<div className={headerStyle.logo_con}>
							<img src={require("@/assets/logo.png")} className="" alt="" />
						</div>
						<div className={headerStyle.tab_con}>
							<div className={headerStyle.tab_item} onClick={() => history.push("/")}>
								首页
							</div>
						</div>
					</div>
					<div className={headerStyle.right_con}>
						<div className={headerStyle.create_con}>
							<Button
								className={headerStyle.ant_btn}
								type="primary"
								icon={<PlusOutlined />}
								size={"default"}
								onClick={addArtice}>
								创作者中心
							</Button>
						</div>
						{userInfo.userName ? (
							<div className={headerStyle.user_con} ref={dropdownRef}>
								<div
									className={headerStyle.user_info}
									onMouseEnter={showDropdown}
									onMouseLeave={hideDropdown}>
									<div className={headerStyle.user_name}>你好，{userInfo.userName}</div>
									<img
										className={headerStyle.avatar}
										src={
											userInfo.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
										}
										alt="avatar"
									/>
								</div>
								<div
									className={`${headerStyle.dropdown} ${isDropdownVisible ? headerStyle.dropdown_visible : ""}`}
									onMouseEnter={showDropdown}
									onMouseLeave={hideDropdown}>
									<div className={headerStyle.dropdown_item} onClick={toPersonalCenter}>
										<div className={headerStyle.icon}>
											<UserOutlined />
										</div>
										<div>个人中心</div>
									</div>
									<div className={headerStyle.divider}></div>
									<div className={headerStyle.dropdown_item} onClick={showLogoutModal}>
										<div className={headerStyle.icon}>
											<LogoutOutlined />
										</div>
										<div>退出登录</div>
									</div>
								</div>
							</div>
						) : (
							<div className={headerStyle.login_con} onClick={toLogin}>
								登录/注册
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 退出登录确认弹窗 */}
			{isLogoutModalVisible && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0, 0, 0, 0.3)",
						backdropFilter: "blur(8px)",
						WebkitBackdropFilter: "blur(8px)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 2000,
						margin: 0,
						padding: 0
					}}>
					<div
						style={{
							background: "rgba(255, 255, 255, 0.85)",
							backdropFilter: "blur(32px)",
							WebkitBackdropFilter: "blur(32px)",
							border: "1px solid rgba(24, 144, 255, 0.3)",
							borderRadius: "20px",
							boxShadow: "0 16px 40px rgba(24, 144, 255, 0.25)",
							width: "320px",
							overflow: "hidden",
							animation: "modalFadeIn 0.3s ease-out"
						}}>
						{/* 标题栏 */}
						<div
							style={{
								background: "rgba(255, 255, 255, 0.9)",
								padding: "16px 20px",
								borderBottom: "1px solid rgba(24, 144, 255, 0.2)",
								textAlign: "center"
							}}>
							<div
								style={{
									color: "#1890ff",
									fontSize: "16px",
									fontWeight: "600"
								}}>
								确认退出登录
							</div>
						</div>

						{/* 内容区 */}
						<div
							style={{
								padding: "24px 20px",
								textAlign: "center",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							}}>
							<p
								style={{
									color: "#333333",
									margin: 0,
									fontSize: "14px",
									lineHeight: "1.5"
								}}>
								您确定要退出登录吗？
							</p>
						</div>

						{/* 按钮区 */}
						<div
							style={{
								padding: "0 20px 20px",
								display: "flex",
								gap: "12px",
								justifyContent: "center"
							}}>
							<Button
								onClick={cancelLogout}
								style={{
									background: "rgba(255, 255, 255, 0.8)",
									border: "1px solid rgba(24, 144, 255, 0.3)",
									borderRadius: "8px",
									boxShadow: "inset 0 2px 0 rgba(255, 255, 255, 0.95)",
									padding: "8px 20px",
									fontSize: "14px",
									flex: 1
								}}>
								取消
							</Button>
							<Button
								type="primary"
								onClick={confirmLogout}
								style={{
									background: "rgba(24, 144, 255, 0.9)",
									border: "1px solid rgba(24, 144, 255, 0.4)",
									borderRadius: "8px",
									boxShadow: "inset 0 2px 0 rgba(255, 255, 255, 0.3)",
									padding: "8px 20px",
									fontSize: "14px",
									flex: 1
								}}>
								确认退出
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default Wrapper(index);
