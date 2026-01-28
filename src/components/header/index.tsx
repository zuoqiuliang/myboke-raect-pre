import React, { useState, useEffect, useRef } from "react";
import headerStyle from "./header.less";
import { useRequest, history } from "umi";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch, useSelector } from "dva";
import Wrapper from "@/components/Auth/index";
function index() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const headerRef = useRef<HTMLDivElement>(null);

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

	return (
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
						<div className={headerStyle.user_con}>
							<div className={headerStyle.user_info}>
								<div className={headerStyle.user_name}>你好，{userInfo.userName}</div>
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
	);
}

export default Wrapper(index);
