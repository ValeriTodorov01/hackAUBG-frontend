import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Battery, Sun } from 'lucide-react';

interface PowerStatusProps {
	batteryPercentage: number;
	solarPanelStatus: 'active' | 'inactive' | 'charging';
	powerConsumption: number;
}

export function PowerStatus({
	batteryPercentage,
	solarPanelStatus,
	powerConsumption,
}: PowerStatusProps) {
	const roundedBatteryPercentage = Math.round(batteryPercentage);

	const getBatteryColor = () => {
		if (roundedBatteryPercentage > 50) return 'bg-green-500';
		if (roundedBatteryPercentage > 20) return 'bg-yellow-500';
		return 'bg-red-500';
	};

	const getSolarStatusIndicator = () => {
		switch (solarPanelStatus) {
			case 'active':
				return {
					color: 'text-green-500',
					text: 'Active - Generating Power',
				};
			case 'charging':
				return { color: 'text-blue-500', text: 'Charging Battery' };
			case 'inactive':
				return {
					color: 'text-gray-400',
					text: 'Inactive - Night Side',
				};
			default:
				return { color: 'text-gray-400', text: 'Status Unknown' };
		}
	};

	const solarStatus = getSolarStatusIndicator();

	return (
		<Card className='bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'>
			<CardHeader className='pb-2'>
				<CardTitle className='text-gray-900 flex items-center text-xl'>
					<div className='bg-blue-50 p-2 rounded-full mr-3'>
						<Battery className='h-5 w-5 text-blue-600' />
					</div>
					Power Systems
				</CardTitle>
				<CardDescription>
					Battery and solar panel status
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-6 pt-4'>
				<div className='space-y-3'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<span className='font-medium'>Battery</span>
						</div>
						<span className='font-mono text-lg font-semibold'>
							{roundedBatteryPercentage}%
						</span>
					</div>
					<div className='relative h-2 w-full overflow-hidden rounded-full bg-gray-100'>
						<Progress
							value={roundedBatteryPercentage}
							className={`h-full [&>div]:${getBatteryColor()}`}
						/>
					</div>
					<p className='text-xs text-gray-500'>
						Estimated runtime:{' '}
						{Math.round((roundedBatteryPercentage / 100) * 24)}{' '}
						hours at current consumption
					</p>
				</div>

				<div className='space-y-3 pt-2'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<div className='bg-yellow-50 p-2 rounded-full mr-3'>
								<Sun className='h-5 w-5 text-yellow-500' />
							</div>
							<span className='font-medium'>Solar Panels</span>
						</div>
						<span
							className={`text-sm font-medium ${solarStatus.color}`}
						>
							{solarPanelStatus === 'active' && '●'}{' '}
							{solarStatus.text}
						</span>
					</div>

					{solarPanelStatus === 'active' && (
						<div className='bg-green-50 rounded-lg p-3 border border-green-100'>
							<p className='text-sm text-green-700 font-medium'>
								Generating {powerConsumption * 1.2}W (120% of
								consumption)
							</p>
						</div>
					)}
				</div>

				<div className='pt-4 border-t border-gray-200'>
					<div className='flex justify-between items-center'>
						<span className='font-medium'>Power Consumption</span>
						<span className='font-mono font-semibold text-gray-700'>
							{powerConsumption}W
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
