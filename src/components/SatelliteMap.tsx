'use client';

import { useEffect, useRef, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Satellite, MapPin, X } from 'lucide-react';
import type { NaturalEvent, SatellitePosition } from '@/lib/types';
import Image from 'next/image';

interface SatelliteMapProps {
	position: SatellitePosition;
	events: NaturalEvent[];
}

export function SatelliteMap({ position, events }: SatelliteMapProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<NaturalEvent | null>(
		null
	);

	// Draw the map and satellite position
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const drawMap = () => {
			// Load world map image
			const mapImage = new window.Image();
			mapImage.crossOrigin = 'anonymous';
			mapImage.src = 'placeholder.svg';

			mapImage.onload = () => {
				// Clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Fill with light blue background for oceans
				ctx.fillStyle = '#f0f7ff';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Draw map
				ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

				// Draw grid lines
				ctx.strokeStyle = 'rgba(200, 220, 240, 0.5)';
				ctx.lineWidth = 1;

				// Draw latitude lines
				for (let lat = -90; lat <= 90; lat += 15) {
					const y = (90 - lat) * (canvas.height / 180);
					ctx.beginPath();
					ctx.moveTo(0, y);
					ctx.lineTo(canvas.width, y);
					ctx.stroke();
				}

				// Draw longitude lines
				for (let lng = -180; lng <= 180; lng += 15) {
					const x = (lng + 180) * (canvas.width / 360);
					ctx.beginPath();
					ctx.moveTo(x, 0);
					ctx.lineTo(x, canvas.height);
					ctx.stroke();
				}

				// Draw satellite position
				const x = (position.longitude + 180) * (canvas.width / 360);
				const y = (90 - position.latitude) * (canvas.height / 180);

				// Satellite orbit path (simplified as an ellipse)
				ctx.beginPath();
				ctx.ellipse(
					canvas.width / 2,
					canvas.height / 2,
					canvas.width * 0.4,
					canvas.height * 0.25,
					0,
					0,
					2 * Math.PI
				);
				ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)';
				ctx.stroke();

				// Satellite glow effect
				const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
				gradient.addColorStop(0, 'rgba(59, 130, 246, 0.6)');
				gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(x, y, 30, 0, 2 * Math.PI);
				ctx.fill();

				// Satellite marker
				ctx.beginPath();
				ctx.arc(x, y, 6, 0, 2 * Math.PI);
				ctx.fillStyle = '#3b82f6';
				ctx.fill();
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 2;
				ctx.stroke();

				// Satellite "signal" rings
				ctx.beginPath();
				ctx.arc(x, y, 12, 0, 2 * Math.PI);
				ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(x, y, 18, 0, 2 * Math.PI);
				ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
				ctx.stroke();

				// Draw event markers
				events.forEach((event) => {
					// Convert event coordinates to canvas position
					// This is a simplified example - in a real app, you'd use proper geo coordinates
					const eventX =
						(Number.parseFloat(event.coordinates.longitude) + 180) *
						(canvas.width / 360);
					const eventY =
						(90 - Number.parseFloat(event.coordinates.latitude)) *
						(canvas.height / 180);

					// Event glow for new events
					if (event.isNew) {
						const eventGlow = ctx.createRadialGradient(
							eventX,
							eventY,
							0,
							eventX,
							eventY,
							20
						);
						eventGlow.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
						eventGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
						ctx.fillStyle = eventGlow;
						ctx.beginPath();
						ctx.arc(eventX, eventY, 20, 0, 2 * Math.PI);
						ctx.fill();
					}

					// Draw event marker
					ctx.beginPath();
					ctx.arc(eventX, eventY, 5, 0, 2 * Math.PI);

					// Color based on event type
					switch (event.type.toLowerCase()) {
						case 'wildfire':
							ctx.fillStyle = '#ef4444';
							break;
						case 'flood':
							ctx.fillStyle = '#3b82f6';
							break;
						case 'hurricane':
							ctx.fillStyle = '#8b5cf6';
							break;
						case 'storm':
							ctx.fillStyle = '#6b7280';
							break;
						default:
							ctx.fillStyle = '#f59e0b';
					}

					ctx.fill();
					ctx.strokeStyle = '#ffffff';
					ctx.lineWidth = 1;
					ctx.stroke();

					// Highlight new events
					if (event.isNew) {
						ctx.beginPath();
						ctx.arc(eventX, eventY, 10, 0, 2 * Math.PI);
						ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
						ctx.setLineDash([2, 2]);
						ctx.stroke();
						ctx.setLineDash([]);
					}
				});

				setMapLoaded(true);
			};
		};

		drawMap();

		// Redraw map when window is resized
		const handleResize = () => {
			if (canvas) {
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
				drawMap();
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [position, events]);

	// Handle canvas click to select events
	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Check if click is near any event
		for (const event of events) {
			const eventX =
				(Number.parseFloat(event.coordinates.longitude) + 180) *
				(canvas.width / 360);
			const eventY =
				(90 - Number.parseFloat(event.coordinates.latitude)) *
				(canvas.height / 180);

			// Calculate distance between click and event
			const distance = Math.sqrt(
				Math.pow(x - eventX, 2) + Math.pow(y - eventY, 2)
			);

			// If click is within 15px of event, select it
			if (distance <= 15) {
				setSelectedEvent(event);
				return;
			}
		}

		// If click is not near any event, deselect
		setSelectedEvent(null);
	};

	return (
		<Card className='bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'>
			<CardHeader className='pb-2'>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center text-gray-900 text-xl'>
							<div className='bg-blue-50 p-2 rounded-full mr-3'>
								<Satellite className='h-5 w-5 text-blue-600' />
							</div>
							Satellite Tracking
						</CardTitle>
						<CardDescription>
							Live position and event monitoring
						</CardDescription>
					</div>
					<Badge
						variant='outline'
						className='font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded-full'
					>
						Alt: {position.altitude.toFixed(1)} km
					</Badge>
				</div>
			</CardHeader>
			<CardContent className='p-0 relative'>
				<div className='relative w-full h-[500px] overflow-hidden rounded-lg'>
					<canvas
						ref={canvasRef}
						className='w-full h-full bg-blue-50'
						width={1200}
						height={600}
						onClick={handleCanvasClick}
					/>

					{!mapLoaded && (
						<div className='absolute inset-0 flex items-center justify-center bg-blue-50/80 backdrop-blur-sm'>
							<div className='text-center'>
								<div className='animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-3'></div>
								<p className='text-gray-700 font-medium'>
									Loading satellite map...
								</p>
							</div>
						</div>
					)}

					{/* Satellite info overlay */}
					<div className='absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-lg text-xs text-gray-800'>
						<div className='grid grid-cols-2 gap-x-6 gap-y-2'>
							<div className='text-gray-500'>Latitude:</div>
							<div className='font-mono font-medium'>
								{position.latitude.toFixed(4)}°
							</div>
							<div className='text-gray-500'>Longitude:</div>
							<div className='font-mono font-medium'>
								{position.longitude.toFixed(4)}°
							</div>
							<div className='text-gray-500'>Altitude:</div>
							<div className='font-mono font-medium'>
								{position.altitude.toFixed(1)} km
							</div>
							<div className='text-gray-500'>Speed:</div>
							<div className='font-mono font-medium'>
								7.8 km/s
							</div>
						</div>
					</div>

					{/* Selected event info */}
					{selectedEvent && (
						<div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-lg border border-gray-200 shadow-lg max-w-xs'>
							<div className='flex items-start justify-between mb-3'>
								<h3 className='font-medium flex items-center text-gray-900 text-lg'>
									<MapPin className='h-5 w-5 mr-2 text-red-500' />
									{selectedEvent.type} in{' '}
									{selectedEvent.location}
								</h3>
								<button
									onClick={() => setSelectedEvent(null)}
									className='text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors'
								>
									<X className='h-4 w-4' />
								</button>
							</div>
							<p className='text-sm text-gray-600 mb-3 leading-relaxed'>
								{selectedEvent.description}
							</p>
							{selectedEvent.imageUrl && (
								<div className='mb-3 rounded-lg overflow-hidden shadow-sm border border-gray-200'>
									<Image
										src={selectedEvent.imageUrl}
										alt={selectedEvent.type}
										width={300}
										height={200}
										className='w-full h-32 object-cover'
									/>
								</div>
							)}
							<div className='flex justify-between text-xs'>
								<Badge
									className={getSeverityBadgeColor(
										selectedEvent.severity
									)}
								>
									{selectedEvent.severity} Severity
								</Badge>
								<span className='text-gray-500 font-mono'>
									ID: {selectedEvent.id.substring(0, 8)}
								</span>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// Helper function to get severity badge color
function getSeverityBadgeColor(severity: string) {
	switch (severity.toLowerCase()) {
		case 'high':
			return 'bg-red-500 text-white';
		case 'medium':
			return 'bg-orange-500 text-white';
		case 'low':
			return 'bg-yellow-500 text-white';
		default:
			return 'bg-gray-500 text-white';
	}
}
