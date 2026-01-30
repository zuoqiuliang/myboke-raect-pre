import React, { useState, useEffect } from "react";
import indexStyle from "../index.less";
import { getArticleType } from "@/api";
import classNames from "classnames";
import Icon, { HomeOutlined } from "@ant-design/icons";
import { blogTypeIconMap } from "@/utils/icon";

export default function ArticleType({
	currentType,
	setCurrentType
}: {
	currentType: string;
	setCurrentType: (type: string) => void;
}) {
	const [types, setTypes] = useState([]);
	const getTypesCom = (types: any) => {
		return types.map((item: any) => {
			return (
				<div
					key={item.id}
					className={classNames({
						[indexStyle.active]: currentType == item.id + "",
						[indexStyle.types_item]: true
					})}
					onClick={() => setCurrentType(item.id + "")}>
					<Icon component={blogTypeIconMap[item.path]} />
					<span className={indexStyle.types_item_name}>{item.name}</span>
				</div>
			);
		});
	};
	useEffect(() => {
		getArticleType().then((res) => {
			console.log(res);
			if (res.rows.length > 0) {
				setTypes(res.rows);
				setCurrentType(res.rows[0].id + "");
			}
		});
		// .catch((err) => {
		// 	console.log(err);
		// });
	}, []);
	return <div>{getTypesCom(types)}</div>;
}
