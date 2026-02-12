import React from "react";
import dayjs from "dayjs";
import indexStyle from "../index.less";

interface WelcomeCardProps {
	// 可以添加其他属性
}

const WelcomeCard: React.FC<WelcomeCardProps> = () => {
	// 获取当前时间
	const now = dayjs();
	const currentDate = now.format("YYYY年MM月DD日");

	// 判断上下午晚上
	const hour = now.hour();
	let timeOfDay = "";
	if (hour < 6) {
		timeOfDay = "凌晨";
	} else if (hour < 12) {
		timeOfDay = "上午";
	} else if (hour < 14) {
		timeOfDay = "中午";
	} else if (hour < 18) {
		timeOfDay = "下午";
	} else {
		timeOfDay = "晚上";
	}

	return (
		<div className={indexStyle.welcome_card}>
			<div className={indexStyle.welcome_title}>{timeOfDay}好！</div>
			<div className={indexStyle.welcome_subtitle}>写下你的 idea，我来倾听你的感想</div>
			<div className={indexStyle.welcome_date}>{currentDate}</div>
			<div className={indexStyle.welcome_time}>开始你的创作之旅吧</div>
		</div>
	);
};

export default WelcomeCard;
