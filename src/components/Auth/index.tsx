import { Navigate, useDispatch, useSelector } from "umi";
import { getUserInfoApi } from "@/api/userInfo";
import Util from "@/utils/cookies";
const withAuth = (Component: any) => () => {
	// 使用封装的 getCookie 方法获取特定名称的 cookie
	const token = Util.getCookie("token");
	const dispatch = useDispatch();
	const NovaAuth = useSelector((state: any) => {
		return state.userModel.NovaAuth;
	});
	const isHasAuth = useSelector((state: any) => {
		return state.userModel.isHasAuth;
	});
	if (NovaAuth && !isHasAuth) {
		getUserInfoApi().then((res: any) => {
			console.log(res);
			if (res) {
				dispatch({
					type: "userModel/setUserInfo",
					payload: res
				});
			}
		});
	}

	return <Component />;
};

export default withAuth;
