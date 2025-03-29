'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
	value: number;
	maxValue: number;
	label: string;
	unit: string;
	textColor: string;
	bgColor: string;
	size?: number;
	thickness?: number;
	animated?: boolean;
	precision?: number;
}

export function AnimatedCounter({
	value,
	maxValue,
	label,
	unit,
	textColor,
	bgColor,
	size = 150,
	thickness = 10,
	animated = true,
	precision = 1,
}: AnimatedCounterProps) {
	const [displayValue, setDisplayValue] = useState(0);
	const [progress, setProgress] = useState(0);
	const prevValueRef = useRef(value);
	const animationRef = useRef<number | null>(null);

	const radius = (size - thickness) / 2;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	const formattedValue = displayValue.toFixed(precision);

	useEffect(() => {
		if (!animated) {
			setDisplayValue(value);
			setProgress((value / maxValue) * 100);
			return;
		}

		const prevValue = prevValueRef.current;
		const duration = 1500;
		const startTime = performance.now();

		const targetProgress = (value / maxValue) * 100;
		const startProgress = (prevValue / maxValue) * 100;

		const animateValue = (timestamp: number) => {
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const easeProgress = 1 - (1 - progress) * (1 - progress);

			const currentValue = prevValue + (value - prevValue) * easeProgress;
			const currentProgress =
				startProgress + (targetProgress - startProgress) * easeProgress;

			setDisplayValue(currentValue);
			setProgress(currentProgress);

			if (progress < 1) {
				animationRef.current = requestAnimationFrame(animateValue);
			} else {
				prevValueRef.current = value;
			}
		};

		animationRef.current = requestAnimationFrame(animateValue);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [value, maxValue, animated]);

	const [isPulsing, setIsPulsing] = useState(false);

	useEffect(() => {
		const pulseInterval = setInterval(() => {
			setIsPulsing(true);
			setTimeout(() => setIsPulsing(false), 500);
		}, 5000);

		return () => clearInterval(pulseInterval);
	}, []);

	return (
		<div className='flex flex-col items-center justify-center'>
			<div
				className={`relative flex items-center justify-center rounded-full ${bgColor} transition-transform duration-500 ${
					isPulsing ? 'scale-105' : 'scale-100'
				}`}
				style={{ width: size, height: size }}
			>
				<svg width={size} height={size} className='absolute'>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						strokeWidth={thickness}
						stroke='#e6e6e6'
						fill='none'
					/>
				</svg>

				<svg
					width={size}
					height={size}
					className='absolute transform -rotate-90'
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						strokeWidth={thickness}
						stroke='currentColor'
						fill='none'
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						className={`${textColor} transition-all duration-300`}
						strokeLinecap='round'
					/>
				</svg>

				<div className='text-center z-10'>
					<div
						className={`text-2xl font-bold ${textColor} transition-all duration-300`}
					>
						{formattedValue}
						<span className='text-sm font-normal ml-1'>{unit}</span>
					</div>
					<div className='mt-1 text-xs font-medium text-gray-500'>
						{label}
					</div>
				</div>

				<div className='absolute inset-0 w-full h-full'>
					{[...Array(8)].map((_, i) => {
						const angle = (i * 45 * Math.PI) / 180;
						const dotX =
							size / 2 +
							Math.cos(angle) * (radius + thickness / 2);
						const dotY =
							size / 2 +
							Math.sin(angle) * (radius + thickness / 2);
						const isActive = (i / 8) * 100 <= progress;

						return (
							<div
								key={i}
								className={`absolute h-2 w-2 rounded-full transition-all duration-500 ${
									isActive ? textColor : 'bg-gray-200'
								}`}
								style={{
									left: dotX - 4,
									top: dotY - 4,
									opacity: isActive ? 1 : 0.5,
									transform: `scale(${isActive ? 1 : 0.8})`,
								}}
							/>
						);
					})}
				</div>
			</div>

			<div className='mt-2 text-xs text-gray-400'>Updated just now</div>
		</div>
	);
}
