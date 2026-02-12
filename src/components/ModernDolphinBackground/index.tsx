import React, { useEffect, useRef } from "react";
import styles from "./index.less";

export default function ModernDolphinBackground() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// 创建海豚元素
		const createDolphin = (delay: number, speed: number, height: number) => {
			const dolphin = document.createElement("div");
			dolphin.className = "dolphin";
			dolphin.style.bottom = `${height}px`;
			dolphin.style.animationDelay = `${delay}s`;
			dolphin.style.animationDuration = `${speed}s`;
			container.appendChild(dolphin);
			return dolphin;
		};

		// 创建多个海豚，在不同高度游动
		const dolphins = [
			createDolphin(0, 18, 120),
			createDolphin(4, 22, 160),
			createDolphin(8, 20, 140),
			createDolphin(12, 24, 180)
		];

		// 创建波浪元素
		const createWave = (className: string) => {
			const wave = document.createElement("div");
			wave.className = `wave ${className}`;
			container.appendChild(wave);
			return wave;
		};

		// 创建波浪
		const waves = [createWave("wave1"), createWave("wave2"), createWave("wave3")];

		// 创建气泡元素
		const createBubbles = () => {
			const bubbles = [];
			for (let i = 0; i < 20; i++) {
				const bubble = document.createElement("div");
				bubble.className = "bubble";
				bubble.style.left = `${Math.random() * 100}%`;
				bubble.style.bottom = `${Math.random() * 200 + 50}px`;
				bubble.style.width = `${Math.random() * 15 + 5}px`;
				bubble.style.height = bubble.style.width;
				bubble.style.animationDuration = `${Math.random() * 6 + 6}s`;
				bubble.style.animationDelay = `${Math.random() * 4}s`;
				container.appendChild(bubble);
				bubbles.push(bubble);
			}
			return bubbles;
		};

		// 创建气泡
		const bubbles = createBubbles();

		// 清理函数
		return () => {
			dolphins.forEach((dolphin) => {
				if (dolphin.parentNode) {
					dolphin.parentNode.removeChild(dolphin);
				}
			});
			waves.forEach((wave) => {
				if (wave.parentNode) {
					wave.parentNode.removeChild(wave);
				}
			});
			bubbles.forEach((bubble) => {
				if (bubble.parentNode) {
					bubble.parentNode.removeChild(bubble);
				}
			});
		};
	}, []);

	return (
		<div className={styles.modern_dolphin_background} ref={containerRef}>
			{/* 海豚、波浪和气泡将通过 JS 动态创建 */}
		</div>
	);
}
