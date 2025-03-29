'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageSliderProps {
	images: {
		src: string;
		alt: string;
		title?: string;
		description?: string;
	}[];
	autoPlayInterval?: number;
	showControls?: boolean;
	showIndicators?: boolean;
}

export function ImageSlider({
	images,
	autoPlayInterval = 5000,
	showControls = true,
	showIndicators = true,
}: ImageSliderProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	const goToNext = useCallback(() => {
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		);
	}, [images.length]);

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	const toggleAutoPlay = () => {
		setIsPlaying((prev) => !prev);
	};

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		if (isPlaying) {
			intervalId = setInterval(goToNext, autoPlayInterval);
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [isPlaying, autoPlayInterval, goToNext]);

	return (
		<Card className='relative overflow-hidden rounded-xl shadow-lg bg-white py-0'>
			<div className='relative h-[400px] w-full'>
				{images.map((image, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
							index === currentIndex
								? 'opacity-100 z-10'
								: 'opacity-0 z-0'
						}`}
					>
						<Image
							src={image.src || '/placeholder.svg'}
							alt={image.alt}
							className='h-full w-full object-cover'
							width={800}
							height={400}
						/>
						{(image.title || image.description) && (
							<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white'>
								{image.title && (
									<h3 className='text-xl font-bold mb-2'>
										{image.title}
									</h3>
								)}
								{image.description && (
									<p className='text-sm opacity-90'>
										{image.description}
									</p>
								)}
							</div>
						)}
					</div>
				))}

				{showControls && (
					<>
						<Button
							variant='outline'
							size='icon'
							className='absolute left-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md border-none'
							onClick={goToPrevious}
							aria-label='Previous slide'
						>
							<ChevronLeft className='h-6 w-6' />
						</Button>
						<Button
							variant='outline'
							size='icon'
							className='absolute right-4 top-1/2 z-20 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md border-none'
							onClick={goToNext}
							aria-label='Next slide'
						>
							<ChevronRight className='h-6 w-6' />
						</Button>
						<Button
							variant='outline'
							size='icon'
							className='absolute right-4 bottom-4 z-20 h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-md border-none'
							onClick={toggleAutoPlay}
							aria-label={
								isPlaying ? 'Pause slideshow' : 'Play slideshow'
							}
						>
							{isPlaying ? (
								<Pause className='h-4 w-4' />
							) : (
								<Play className='h-4 w-4' />
							)}
						</Button>
					</>
				)}

				{showIndicators && (
					<div className='absolute bottom-3 left-0 right-0 z-20 flex justify-center space-x-2'>
						{images.map((_, index) => (
							<button
								key={index}
								className={`h-2 w-8 rounded-full transition-all ${
									index === currentIndex
										? 'bg-white'
										: 'bg-white/50 hover:bg-white/70'
								}`}
								onClick={() => goToSlide(index)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</Card>
	);
}
