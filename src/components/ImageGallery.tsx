'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchLatestReadings, sendCommand } from '@/lib/api';
import {
	type Reading,
	PROPERTY_UNITS,
	PROPERTY_COLORS,
	PROPERTY_MAX_VALUES,
} from '@/lib/types';
import { AnimatedCounter } from './AnimatedCounter';
import CameraStream from './CameraStream';
import { SatelliteControls } from './SatelliteControls';

export function ImageGallery() {
	const [readings, setReadings] = useState<Record<string, Reading>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
	const [isMoving, setIsMoving] = useState(false);

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

	const formatLastUpdated = () => {
		return lastUpdated.toLocaleTimeString();
	};

	const getReadingValue = (property: string): number => {
		// console.log(`Reading for ${property}:`, readings[property]);
		if (!readings[property]) return 0;
		return readings[property].Value;
	};

	const getPrecision = (property: string): number => {
		if (property === 'lat' || property === 'long') return 4;
		return 1;
	};

	// Handle satellite movement
	const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
		setIsMoving(true);

		const command =
			direction === 'up'
				? 1
				: direction === 'down'
				? 3
				: direction === 'left'
				? 4
				: 2;

		sendCommand(command);

		// Update lat/long based on direction
		const latChange =
			direction === 'up' ? 0.01 : direction === 'down' ? -0.01 : 0;
		const longChange =
			direction === 'right' ? 0.01 : direction === 'left' ? -0.01 : 0;

		// Create updated readings
		const updatedReadings = { ...readings };

		if (updatedReadings.lat) {
			updatedReadings.lat = {
				...updatedReadings.lat,
				Value: updatedReadings.lat.Value + latChange,
			};
		}

		if (updatedReadings.long) {
			updatedReadings.long = {
				...updatedReadings.long,
				Value: updatedReadings.long.Value + longChange,
			};
		}

		// Update readings
		setReadings(updatedReadings);
		setLastUpdated(new Date());

		// Reset moving state after a delay
		setTimeout(() => {
			setIsMoving(false);
		}, 500);
	};

	// Handle satellite rotation
	const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
		// In a real application, this would send commands to rotate the satellite
		console.log(`Rotating satellite ${direction}`);
	};

	// Handle centering the satellite
	const handleCenter = () => {
		// Reset to default position
		const updatedReadings = { ...readings };

		if (updatedReadings.lat) {
			updatedReadings.lat = {
				...updatedReadings.lat,
				Value: 0,
			};
		}

		if (updatedReadings.long) {
			updatedReadings.long = {
				...updatedReadings.long,
				Value: 0,
			};
		}

		// Update readings
		setReadings(updatedReadings);
		setLastUpdated(new Date());
	};

	return (
		<div className='max-w-5xl mx-auto'>
			<Card className='relative overflow-hidden rounded-xl shadow-lg bg-white pt-0'>
				<div className='relative'>
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
								className='flex items-center space-x-1 cursor-pointer'
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

				{/* Satellite Controls Section */}
				<div className='p-6 border-t border-gray-100'>
					<h3 className='text-lg font-semibold text-gray-800 mb-4'>
						Satellite Controls
					</h3>
					<div className='flex justify-center'>
						<div className='max-w-md w-full'>
							<SatelliteControls
								onMove={handleMove}
								onRotate={handleRotate}
								onCenter={handleCenter}
								isMoving={isMoving}
							/>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
