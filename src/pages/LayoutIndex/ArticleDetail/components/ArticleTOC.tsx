import React, { useState, useEffect } from "react";
import articleStyle from "../article.less";

interface TocItem {
	slug: string;
	content: string;
	children?: TocItem[];
	level: number;
}

interface ArticleTOCProps {
	article: any;
}

const ArticleTOC: React.FC<ArticleTOCProps> = ({ article }) => {
	const [selectedSlug, setSelectedSlug] = useState<string>("");

	// 监听滚动事件，更新目录选中状态
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 100;

			// 获取所有标题元素
			const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
			let currentSlug = "";

			// 找到当前滚动位置对应的标题
			headingElements.forEach((heading) => {
				const element = heading as HTMLElement;
				if (element.offsetTop <= scrollPosition) {
					currentSlug = element.id;
				}
			});

			if (currentSlug && currentSlug !== selectedSlug) {
				setSelectedSlug(currentSlug);
			}
		};

		// 添加滚动监听
		window.addEventListener("scroll", handleScroll);

		// 初始检查
		handleScroll();

		// 清理函数
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [selectedSlug]);

	// 递归渲染目录项
	const renderTocItem = (item: TocItem, index: number) => {
		const handleClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			setSelectedSlug(item.slug);

			// 平滑滚动到对应位置
			const smoothScroll = (targetPosition: number) => {
				const startPosition = window.pageYOffset;
				const distance = targetPosition - startPosition;
				const duration = 800;
				let startTime: number | null = null;

				const animation = (currentTime: number) => {
					if (startTime === null) startTime = currentTime;
					const timeElapsed = currentTime - startTime;
					const progress = Math.min(timeElapsed / duration, 1);

					// 缓动函数
					const easeProgress =
						progress < 0.5
							? 4 * Math.pow(progress, 4)
							: 1 - Math.pow(-2 * progress + 2, 4) / 2;

					const currentPosition = startPosition + distance * easeProgress;
					window.scrollTo(0, currentPosition);

					if (timeElapsed < duration) {
						requestAnimationFrame(animation);
					}
				};

				requestAnimationFrame(animation);
			};

			// 找到目标元素并滚动
			const targetElement = document.getElementById(item.slug);
			if (targetElement) {
				const targetPosition = targetElement.offsetTop - 80;
				smoothScroll(targetPosition);
			} else {
				smoothScroll(0);
			}
		};

		const isSelected = selectedSlug === item.slug;

		return (
			<li
				key={`${item.slug}-${index}`}
				className={articleStyle.toc_item}
				style={{
					paddingLeft: `${(item.level - 1) * 12}px`
				}}
				data-selected={isSelected}
				onClick={handleClick}>
				{item.content}
				{item.children && item.children.length > 0 && (
					<ul className={articleStyle.toc_list}>
						{item.children.map((child, childIndex) => renderTocItem(child, childIndex))}
					</ul>
				)}
			</li>
		);
	};

	// 检查article.toc是否存在且为数组
	const tocItems: TocItem[] = Array.isArray(article.toc) ? article.toc : [];

	return (
		<div className={articleStyle.toc}>
			<div className={articleStyle.toc_header}>文章目录</div>
			{tocItems.length > 0 ? (
				<ul className={articleStyle.toc_list}>
					{tocItems.map((item, index) => renderTocItem(item, index))}
				</ul>
			) : (
				<ul className={articleStyle.toc_list}>
					<li className={articleStyle.toc_item}>暂无目录</li>
				</ul>
			)}
		</div>
	);
};

export default ArticleTOC;
