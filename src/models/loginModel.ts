export default {
	state: {
		isShowLoginModal: false
	},
	reducers: {
		setIsShowLoginModal(state: any, { payload }: any) {
			return {
				...state,
				isShowLoginModal: payload
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
