import React, { useEffect, useRef } from "react";
import canvasRainStyle from "./index.less";

export default function CanvasRain() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas: any = canvasRef.current;
		if (!canvas) return;

		const ctx: any = canvas.getContext("2d");
		if (!ctx) return;

		// 设置canvas尺寸
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// 雨滴类
		class Raindrop {
			x: number;
			y: number;
			size: number;
			speed: number;
			opacity: number;
			angle: number;
			trailLength: number;

			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * -canvas.height;
				this.size = Math.random() * 1.5 + 0.8;
				this.speed = Math.random() * 15 + 8;
				this.opacity = Math.random() * 0.4 + 0.1;
				this.angle = Math.random() * 10 - 5; // 雨滴下落角度
				this.trailLength = this.size * 15;
			}

			update() {
				this.y += this.speed;
				this.x += Math.sin((this.angle * Math.PI) / 180) * this.speed * 0.2;
				if (this.y > canvas.height) {
					// 创建溅起效果
					createSplash(this.x, this.y);
					// 重置雨滴位置
					this.y = Math.random() * -50;
					this.x = Math.random() * canvas.width;
					this.speed = Math.random() * 15 + 8;
					this.angle = Math.random() * 10 - 5;
				}
			}

			draw() {
				// 绘制雨滴尾迹（在移动方向的反方向）
				const gradient = ctx.createLinearGradient(
					this.x,
					this.y,
					this.x - Math.sin((this.angle * Math.PI) / 180) * this.trailLength,
					this.y - this.trailLength
				);
				// 使用更接近真实雨点的颜色：透明的灰色，带有轻微的反光效果，确保在白色背景下可见
				gradient.addColorStop(0, `rgba(150, 180, 220, ${this.opacity * 0.8})`);
				gradient.addColorStop(1, `rgba(150, 180, 220, 0)`);

				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(
					this.x - Math.sin((this.angle * Math.PI) / 180) * this.trailLength,
					this.y - this.trailLength
				);
				ctx.strokeStyle = gradient;
				ctx.lineWidth = this.size;
				ctx.stroke();

				// 绘制雨滴头部
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size * 1.2, 0, Math.PI * 2);
				// 使用更接近真实雨点的颜色：透明的灰色，确保在白色背景下可见
				ctx.fillStyle = `rgba(130, 160, 200, ${this.opacity * 0.6})`;
				ctx.fill();
			}
		}

		// 创建溅起效果
		const splashes: any[] = [];

		const createSplash = (x: number, y: number) => {
			// 创建6-8个溅起的小水滴，增加数量使效果更明显
			const splashCount = Math.floor(Math.random() * 3) + 6;
			for (let i = 0; i < splashCount; i++) {
				const angle = ((Math.PI * 2) / splashCount) * i + Math.random() * 0.2; // 添加随机角度偏移
				const speed = Math.random() * 8 + 3; // 增加速度
				const size = Math.random() * 1 + 0.5; // 增加大小

				splashes.push({
					x,
					y,
					size,
					speed,
					angle,
					opacity: 1.0, // 增加透明度
					life: 1.2 // 增加生命值，延长显示时间
				});
			}
		};

		// 更新和绘制溅起效果
		const updateAndDrawSplashes = () => {
			for (let i = splashes.length - 1; i >= 0; i--) {
				const splash = splashes[i];

				// 更新溅起的水滴位置，增加向上的速度，使效果更明显
				splash.x += Math.cos(splash.angle) * splash.speed;
				splash.y += Math.sin(splash.angle) * splash.speed - splash.life * 3; // 增加向上的速度

				// 减少生命值和透明度，减慢减少速度，延长显示时间
				splash.life -= 0.03;
				splash.opacity = splash.life * 0.9;

				// 绘制溅起的水滴，使用更亮的颜色使其更明显
				ctx.beginPath();
				ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(180, 200, 255, ${splash.opacity})`;
				ctx.fill();

				// 移除生命值为0的溅起效果
				if (splash.life <= 0) {
					splashes.splice(i, 1);
				}
			}
		};

		// 创建雨滴数组
		const raindrops: Raindrop[] = [];
		for (let i = 0; i < 200; i++) {
			raindrops.push(new Raindrop());
		}

		// 动画循环
		const animate = () => {
			// 清除画布，不绘制背景颜色，让雨滴直接叠加在网站内容上
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// 更新和绘制雨滴
			raindrops.forEach((raindrop) => {
				raindrop.update();
				raindrop.draw();
			});

			// 更新和绘制溅起效果
			updateAndDrawSplashes();

			requestAnimationFrame(animate);
		};

		animate();

		// 清理函数
		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	return (
		<div className={canvasRainStyle.canvas_rain_container}>
			<canvas ref={canvasRef} className={canvasRainStyle.canvas_rain} />
		</div>
	);
}
