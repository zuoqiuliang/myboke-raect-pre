import React, { useState } from "react";
import { Outlet } from "umi";
import Header from "../components/header";
import "@/less/reset.less";
import layoutStyle from "./LayoutIndex/less/layout.less";
import Login from "@/components/Login/index";
import { useDispatch, useSelector } from "umi";
import "@/less/AlibabaPuHuiTi-2.less";
export default function LayoutIndex() {
	const dispatch = useDispatch();
	const isShowLoginModal = useSelector((state: any) => {
		return state.loginModel.isShowLoginModal;
	});

	const closeLoginModal = () => {
		dispatch({
			type: "loginModel/setIsShowLoginModal",
			payload: false
		});
	};

	const confirmLogin = () => {};

	return (
		<div className={layoutStyle.layout_container}>
			<Header />
			<div className={layoutStyle.child_routes}>
				<Outlet />
			</div>
			<Login
				isModalOpen={isShowLoginModal}
				confirm={confirmLogin}
				close={closeLoginModal}
			/>
		</div>
	);
}
