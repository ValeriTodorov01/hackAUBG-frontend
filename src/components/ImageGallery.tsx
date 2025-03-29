'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchLatestReadings } from '@/lib/api';
import {
	type Reading,
	PROPERTY_UNITS,
	PROPERTY_COLORS,
	PROPERTY_MAX_VALUES,
} from '@/lib/types';
import { AnimatedCounter } from './AnimatedCounter';
import CameraStream from './CameraStream';

// const galleryImages = [
// 	{
// 		id: 'img1',
// 		src: '/placeholder.svg?height=500&width=800&text=Satellite+Image+1',
// 		alt: 'Satellite imagery of Earth',
// 		title: 'Earth Observation',
// 		description:
// 			"High-resolution imagery captured by our satellite's primary camera system",
// 	},
// 	{
// 		id: 'img2',
// 		src: '/placeholder.svg?height=500&width=800&text=Wildfire+Detection',
// 		alt: 'Wildfire detection imagery',
// 		title: 'Wildfire Detection',
// 		description:
// 			'Thermal imaging used to detect and monitor active wildfires across forest regions',
// 	},
// 	{
// 		id: 'img3',
// 		src: '/placeholder.svg?height=500&width=800&text=Hurricane+Tracking',
// 		alt: 'Hurricane tracking visualization',
// 		title: 'Hurricane Tracking',
// 		description:
// 			'Advanced meteorological data visualization for hurricane prediction and tracking',
// 	},
// 	{
// 		id: 'img4',
// 		src: '/placeholder.svg?height=500&width=800&text=Flood+Monitoring',
// 		alt: 'Flood monitoring system',
// 		title: 'Flood Monitoring',
// 		description:
// 			'Water level analysis for early detection of potential flooding events',
// 	},
// 	{
// 		id: 'img5',
// 		src: '/placeholder.svg?height=500&width=800&text=Satellite+Systems',
// 		alt: 'Satellite systems overview',
// 		title: 'Satellite Systems',
// 		description:
// 			"Overview of our satellite's advanced monitoring and detection systems",
// 	},
// ];

export function ImageGallery() {
	// const [currentIndex, setCurrentIndex] = useState(0);
	const [readings, setReadings] = useState<Record<string, Reading>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

	// const currentImage = galleryImages[currentIndex];

	const fetchReadings = async () => {
		setIsLoading(true);
		try {
			const data = await fetchLatestReadings();
			setReadings(data);
			setLastUpdated(new Date());
		} catch (error) {
			console.error('Error fetching readings:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchReadings();

		const intervalId = setInterval(fetchReadings, 10000);

		return () => clearInterval(intervalId);
	}, []);

	// const goToNext = () => {
	// 	setCurrentIndex((prevIndex) =>
	// 		prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
	// 	);
	// };

	// const goToPrevious = () => {
	// 	setCurrentIndex((prevIndex) =>
	// 		prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
	// 	);
	// };

	// const goToSlide = (index: number) => {
	// 	setCurrentIndex(index);
	// };

	const formatLastUpdated = () => {
		return lastUpdated.toLocaleTimeString();
	};

	const getReadingValue = (property: string): number => {
		if (!readings[property]) return 0;
		return readings[property].Value;
	};

	const getPrecision = (property: string): number => {
		if (property === 'lat' || property === 'long') return 4;
		return 1;
	};

	return (
		<div className='max-w-5xl mx-auto'>
			<Card className='relative overflow-hidden rounded-xl shadow-lg bg-white pt-0'>
				<div className='relative'>
					{/* <Image
							src={currentImage.src || '/placeholder.svg'}
							alt={currentImage.alt}
							className='h-full w-full object-cover'
							width={800}
							height={500}
						/>
                         */}
					<CameraStream />

					<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white'>
						<h3 className='text-2xl font-bold mb-2'>
							Live Camera Stream
						</h3>
						<p className='text-sm opacity-90'>
							High-resolution imagery captured by our satellite
							primary camera system
						</p>
					</div>
					{/* 
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
					</Button> */}

					{/* <div className='absolute bottom-20 left-0 right-0 z-20 flex justify-center space-x-2'>
						{galleryImages.map((_, index) => (
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
					</div> */}
				</div>

				<div className='p-6 border-t border-gray-100'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-semibold text-gray-800'>
							Live Sensor Readings
						</h3>
						<div className='flex items-center'>
							<span className='text-sm text-gray-500 mr-2'>
								Last updated: {formatLastUpdated()}
							</span>
							<Button
								variant='outline'
								size='sm'
								className='flex items-center space-x-1'
								onClick={fetchReadings}
								disabled={isLoading}
							>
								<RefreshCw
									className={`h-4 w-4 ${
										isLoading ? 'animate-spin' : ''
									}`}
								/>
								<span>Refresh</span>
							</Button>
						</div>
					</div>

					<div className='flex flex-wrap justify-center gap-8'>
						<AnimatedCounter
							value={getReadingValue('temperature')}
							maxValue={PROPERTY_MAX_VALUES['temperature']}
							label='Temperature'
							unit={PROPERTY_UNITS['temperature']}
							textColor={PROPERTY_COLORS['temperature'].text}
							bgColor={PROPERTY_COLORS['temperature'].bg}
							precision={getPrecision('temperature')}
						/>

						<AnimatedCounter
							value={getReadingValue('humidity')}
							maxValue={PROPERTY_MAX_VALUES['humidity']}
							label='Humidity'
							unit={PROPERTY_UNITS['humidity']}
							textColor={PROPERTY_COLORS['humidity'].text}
							bgColor={PROPERTY_COLORS['humidity'].bg}
							precision={getPrecision('humidity')}
						/>

						<AnimatedCounter
							value={getReadingValue('lat')}
							maxValue={PROPERTY_MAX_VALUES['lat']}
							label='Latitude'
							unit={PROPERTY_UNITS['lat']}
							textColor={PROPERTY_COLORS['lat'].text}
							bgColor={PROPERTY_COLORS['lat'].bg}
							precision={getPrecision('lat')}
						/>

						<AnimatedCounter
							value={getReadingValue('long')}
							maxValue={PROPERTY_MAX_VALUES['long']}
							label='Longitude'
							unit={PROPERTY_UNITS['long']}
							textColor={PROPERTY_COLORS['long'].text}
							bgColor={PROPERTY_COLORS['long'].bg}
							precision={getPrecision('long')}
						/>
					</div>
				</div>
			</Card>
		</div>
	);
}
