'use client';

import { useState } from 'react';
import {
	ArrowUp,
	ArrowLeft,
	Crosshair,
	ArrowRight,
	ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SatelliteControlsProps {
	onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
	onRotate: (direction: 'clockwise' | 'counterclockwise') => void;
	isMoving: boolean;
	onCenter: (direction: 'center') => void;
}

export function SatelliteControls({
	onMove,
	onRotate,
	onCenter,
	isMoving,
}: SatelliteControlsProps) {
	const [activeButton, setActiveButton] = useState<string | null>(null);

	const handleButtonPress = (action: string, callback: () => void) => {
		setActiveButton(action);
		callback();

		// Add a small delay before resetting the active state for visual feedback
		setTimeout(() => {
			setActiveButton(null);
		}, 300);
	};

	return (
		<div className='flex flex-col items-center'>
			{/* Directional Controls */}
			<div className='grid grid-cols-3 gap-3 mb-5'>
				{/* Top row */}
				<div></div>
				<Button
					variant='outline'
					size='icon'
					className={`h-16 w-16 rounded-xl border-2 cursor-pointer ${
						activeButton === 'up'
							? 'bg-blue-100 border-blue-500 text-blue-600'
							: 'hover:bg-blue-50 hover:text-blue-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() => handleButtonPress('up', () => onMove('up'))}
				>
					<ArrowUp className='h-7 w-7' />
				</Button>
				<div></div>

				{/* Middle row */}
				<Button
					variant='outline'
					size='icon'
					className={`h-16 w-16 rounded-xl border-2 cursor-pointer ${
						activeButton === 'left'
							? 'bg-blue-100 border-blue-500 text-blue-600'
							: 'hover:bg-blue-50 hover:text-blue-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() =>
						handleButtonPress('left', () => onMove('left'))
					}
				>
					<ArrowLeft className='h-7 w-7' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className={`h-16 w-16 rounded-xl border-2 cursor-pointer ${
						activeButton === 'center'
							? 'bg-blue-100 border-blue-500 text-blue-600'
							: 'hover:bg-blue-50 hover:text-blue-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() =>
						handleButtonPress('center', () => onCenter('center'))
					}
				>
					<Crosshair className='h-7 w-7' />
				</Button>
				<Button
					variant='outline'
					size='icon'
					className={`h-16 w-16 rounded-xl border-2 cursor-pointer ${
						activeButton === 'right'
							? 'bg-blue-100 border-blue-500 text-blue-600'
							: 'hover:bg-blue-50 hover:text-blue-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() =>
						handleButtonPress('right', () => onMove('right'))
					}
				>
					<ArrowRight className='h-7 w-7' />
				</Button>

				{/* Bottom row */}
				<div></div>
				<Button
					variant='outline'
					size='icon'
					className={`h-16 w-16 rounded-xl border-2 cursor-pointer ${
						activeButton === 'down'
							? 'bg-blue-100 border-blue-500 text-blue-600'
							: 'hover:bg-blue-50 hover:text-blue-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() =>
						handleButtonPress('down', () => onMove('down'))
					}
				>
					<ArrowDown className='h-7 w-7' />
				</Button>
				<div></div>
			</div>
			<div className='text-xs text-gray-400 mb-4'>
				Use the arrows above to move the satellite
			</div>

			{/* Rotation Controls */}
			<div className='flex justify-center space-x-6'>
				<Button
					variant='outline'
					className={`h-12 px-4 rounded-xl border-2 cursor-pointer ${
						activeButton === 'rotate-ccw'
							? 'bg-purple-100 border-purple-500 text-purple-600'
							: 'hover:bg-purple-50 hover:text-purple-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() =>
						handleButtonPress('rotate-ccw', () =>
							onRotate('counterclockwise')
						)
					}
				>
					<ArrowLeft className='h-7 w-7' />
				</Button>
				<Button
					variant='outline'
					className={`h-12 px-4 rounded-xl border-2 cursor-pointer ${
						activeButton === 'rotate-cw'
							? 'bg-purple-100 border-purple-500 text-purple-600'
							: 'hover:bg-purple-50 hover:text-purple-600'
					} transition-all duration-200`}
					disabled={isMoving}
					onClick={() =>
						handleButtonPress('rotate-cw', () =>
							onRotate('clockwise')
						)
					}
				>
					<ArrowRight className='h-7 w-7' />
				</Button>
			</div>
			<div className='mt-2 text-xs text-gray-400'>
				Use the arrows to rotate arm
			</div>
		</div>
	);
}
