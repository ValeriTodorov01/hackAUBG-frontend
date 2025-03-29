'use client';

import { useEffect, useState } from 'react';
import { fetchSatelliteData } from '@/lib/api';
import type { SatelliteData } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { EventsFeed } from './EventFeed';
import { PowerStatus } from './PowerStatus';
import { SatelliteControls } from './SatelliteControls';
import { SatelliteMap } from './SatelliteMap';

export default function Dashboard() {
	const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = await fetchSatelliteData();
				setSatelliteData(data);
				setError(null);
			} catch (err) {
				setError('Failed to fetch satellite data');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		// Set up polling for new data every 30 seconds
		const intervalId = setInterval(fetchData, 30000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		// Check for new events and show notifications
		if (satelliteData?.events) {
			const newEvents = satelliteData.events.filter(
				(event) => event.isNew
			);

			newEvents.forEach((event) => {
				toast.info(`New ${event.type} Detected!`, {
					description: `${event.location}: ${event.description}`,
				});
			});
		}
	}, [satelliteData?.events]);

	if (loading && !satelliteData) {
		return (
			<div className='flex items-center justify-center h-screen bg-white'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4'></div>
					<p className='text-gray-700 font-medium'>
						Loading satellite data...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='p-6'>
				<Alert variant='destructive'>
					<AlertCircle className='h-4 w-4' />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='container mx-auto p-4 space-y-6'>
			<header className='flex items-center justify-between py-4 border-b border-gray-200'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						Satellite Monitoring System
					</h1>
					<p className='text-gray-500 text-sm'>
						Real-time natural disaster detection and monitoring
					</p>
				</div>
				<div className='flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full'>
					<div
						className={`h-3 w-3 rounded-full ${
							satelliteData?.status === 'online'
								? 'bg-green-500'
								: 'bg-red-500'
						} animate-pulse`}
					></div>
					<span className='text-sm font-medium'>
						{satelliteData?.status === 'online'
							? 'Online'
							: 'Offline'}
					</span>
				</div>
			</header>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='md:col-span-2'>
					<SatelliteMap
						position={
							satelliteData?.position || {
								latitude: 0,
								longitude: 0,
								altitude: 0,
							}
						}
						events={satelliteData?.events || []}
					/>
				</div>
				<div className='space-y-6'>
					<PowerStatus
						batteryPercentage={
							satelliteData?.power.batteryPercentage || 0
						}
						solarPanelStatus={
							satelliteData?.power.solarPanelStatus || 'inactive'
						}
						powerConsumption={
							satelliteData?.power.powerConsumption || 0
						}
					/>
					<SatelliteControls
						sunAxisRotation={
							satelliteData?.orientation.sunAxisRotation || 0
						}
						earthAxisRotation={
							satelliteData?.orientation.earthAxisRotation || 0
						}
					/>
				</div>
			</div>

			<div className='mt-6'>
				<EventsFeed events={satelliteData?.events || []} />
			</div>
		</div>
	);
}
