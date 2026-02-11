type utilFn = {
	getCookie: (name: string) => string | null;
	setCookie: (c_name: string, value: string, expiredays: number) => void;
	delCookie: (name: string, domain: string) => void;
};

const Util: utilFn = {
	getCookie: (name) => {
		// 修复：确保 name 参数存在
		if (!name) return null;
		// 更可靠的 cookie 获取实现，处理各种边缘情况
		const nameEQ = name + "=";
		const ca = document.cookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			// 移除开头的空格
			while (c.charAt(0) === " ") {
				c = c.substring(1, c.length);
			}
			// 检查是否找到目标 cookie
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	},
	setCookie: (c_name, value, expiredays) => {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie =
			c_name +
			"=" +
			escape(value) +
			(expiredays == null ? "" : ";expires=" + exdate.toUTCString());
	},
	delCookie: (name: string, domain?: string, path?: string) => {
		const cookieParts = [
			`${name}=`,
			"expires=Thu, 01 Jan 1970 00:00:00 UTC",
			`path=${path || "/"}`,
			domain ? `domain=${domain}` : "",
			"secure",
			"SameSite=Lax"
		]
			.filter(Boolean)
			.join("; ");

		document.cookie = cookieParts;
	}
};

export default Util;
