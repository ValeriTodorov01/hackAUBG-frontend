'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCw, Sun, Globe } from 'lucide-react';
import { sendSatelliteCommand } from '@/lib/api';
import { toast } from 'sonner';

interface SatelliteControlsProps {
	sunAxisRotation: number;
	earthAxisRotation: number;
}

export function SatelliteControls({
	sunAxisRotation,
	earthAxisRotation,
}: SatelliteControlsProps) {
	const [sunAxis, setSunAxis] = useState(sunAxisRotation);
	const [earthAxis, setEarthAxis] = useState(earthAxisRotation);
	const [isAdjusting, setIsAdjusting] = useState(false);

	const handleApplyChanges = async () => {
		setIsAdjusting(true);
		try {
			await sendSatelliteCommand({
				type: 'adjust_orientation',
				params: {
					sunAxisRotation: sunAxis,
					earthAxisRotation: earthAxis,
				},
			});

			toast.success('Orientation Updated', {
				description:
					'Satellite orientation commands sent successfully.',
			});
		} catch (error) {
			toast.warning('Command Failed', {
				description:
					'Failed to send orientation commands to satellite.',
			});
			console.error(error);
		} finally {
			setIsAdjusting(false);
		}
	};

	return (
		<Card className='bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'>
			<CardHeader className='pb-2'>
				<CardTitle className='flex items-center text-gray-900 text-xl'>
					<div className='bg-purple-50 p-2 rounded-full mr-3'>
						<RotateCw className='h-5 w-5 text-purple-600' />
					</div>
					Satellite Orientation
				</CardTitle>
				<CardDescription>
					Adjust the satellite rotation axes
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6 pt-4'>
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<div className='bg-yellow-50 p-1.5 rounded-full mr-2'>
								<Sun className='h-4 w-4 text-yellow-500' />
							</div>
							<span className='font-medium'>Sun Axis</span>
						</div>
						<span className='text-sm font-mono bg-gray-100 px-2 py-1 rounded-md'>
							{sunAxis.toFixed(1)}°
						</span>
					</div>
					<Slider
						value={[sunAxis]}
						min={0}
						max={360}
						step={0.1}
						onValueChange={(value) => setSunAxis(value[0])}
						className='cursor-pointer'
					/>
				</div>

				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<div className='bg-blue-50 p-1.5 rounded-full mr-2'>
								<Globe className='h-4 w-4 text-blue-500' />
							</div>
							<span className='font-medium'>Earth Axis</span>
						</div>
						<span className='text-sm font-mono bg-gray-100 px-2 py-1 rounded-md'>
							{earthAxis.toFixed(1)}°
						</span>
					</div>
					<Slider
						value={[earthAxis]}
						min={0}
						max={360}
						step={0.1}
						onValueChange={(value) => setEarthAxis(value[0])}
						className='cursor-pointer'
					/>
				</div>

				<Button
					onClick={handleApplyChanges}
					disabled={isAdjusting}
					className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300'
				>
					{isAdjusting ? (
						<>
							<span className='animate-pulse mr-2'>●</span>
							Sending Commands...
						</>
					) : (
						'Apply Changes'
					)}
				</Button>
			</CardContent>
		</Card>
	);
}
