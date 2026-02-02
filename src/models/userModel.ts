import Util from "@/utils/cookies";
export default {
	state: {
		isHasAuth: false,
		NovaAuth: Util.getCookie("token") || null,
		userInfo: {}
	},
	reducers: {
		setUserInfo(state: any, { payload }: any) {
			return {
				...state,
				userInfo: payload
			};
		},
		logOut(state: any) {
			// 清除cookie
			Util.delCookie("token", "");
			return {
				...state,
				isHasAuth: false,
				NovaAuth: null,
				userInfo: {}
			};
		}
	},
	effects: {
		// *queryUser({ payload }: any, { call, put }: any) {
		// 	const { data } = yield call(queryUser, payload);
		// 	yield put({ type: "queryUserSuccess", payload: data });
		// }
	}
};
