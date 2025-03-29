'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	AlertTriangle,
	Flame,
	Waves,
	Wind,
	Cloud,
	Activity,
} from 'lucide-react';
import type { NaturalEvent } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface EventsFeedProps {
	events: NaturalEvent[];
}

export function EventsFeed({ events }: EventsFeedProps) {
	const [activeTab, setActiveTab] = useState('all');

	const filteredEvents =
		activeTab === 'all'
			? events
			: events.filter((event) => event.type.toLowerCase() === activeTab);

	const sortedEvents = [...filteredEvents].sort(
		(a, b) =>
			new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
	);

	const getEventIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'wildfire':
				return <Flame className='h-5 w-5 text-orange-500' />;
			case 'flood':
				return <Waves className='h-5 w-5 text-blue-500' />;
			case 'hurricane':
				return <Wind className='h-5 w-5 text-teal-500' />;
			case 'storm':
				return <Cloud className='h-5 w-5 text-gray-400' />;
			default:
				return <AlertTriangle className='h-5 w-5 text-yellow-500' />;
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity.toLowerCase()) {
			case 'high':
				return 'bg-red-500 hover:bg-red-600';
			case 'medium':
				return 'bg-orange-500 hover:bg-orange-600';
			case 'low':
				return 'bg-yellow-500 hover:bg-yellow-600';
			default:
				return 'bg-gray-500 hover:bg-gray-600';
		}
	};

	const eventCounts = events.reduce((acc, event) => {
		const type = event.type.toLowerCase();
		acc[type] = (acc[type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return (
		<Card className='bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'>
			<CardHeader className='pb-2'>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center text-gray-900 text-xl'>
							<div className='bg-red-50 p-2 rounded-full mr-3'>
								<Activity className='h-5 w-5 text-red-600' />
							</div>
							Natural Events Feed
						</CardTitle>
						<CardDescription>
							Real-time natural disaster monitoring
						</CardDescription>
					</div>
					<Badge
						variant='outline'
						className='font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded-full'
					>
						{events.length} Events
					</Badge>
				</div>
			</CardHeader>
			<CardContent className='pt-4'>
				<Tabs
					defaultValue='all'
					value={activeTab}
					onValueChange={setActiveTab}
				>
					<TabsList className='grid grid-cols-5 mb-4 bg-gray-100 p-1 rounded-lg'>
						<TabsTrigger
							value='all'
							className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'
						>
							All
							<Badge
								variant='secondary'
								className='ml-2 bg-gray-200 text-gray-700'
							>
								{events.length}
							</Badge>
						</TabsTrigger>
						<TabsTrigger
							value='wildfire'
							className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'
						>
							Wildfires
							<Badge
								variant='secondary'
								className='ml-2 bg-gray-200 text-gray-700'
							>
								{eventCounts.wildfire || 0}
							</Badge>
						</TabsTrigger>
						<TabsTrigger
							value='flood'
							className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'
						>
							Floods
							<Badge
								variant='secondary'
								className='ml-2 bg-gray-200 text-gray-700'
							>
								{eventCounts.flood || 0}
							</Badge>
						</TabsTrigger>
						<TabsTrigger
							value='hurricane'
							className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'
						>
							Hurricanes
							<Badge
								variant='secondary'
								className='ml-2 bg-gray-200 text-gray-700'
							>
								{eventCounts.hurricane || 0}
							</Badge>
						</TabsTrigger>
						<TabsTrigger
							value='storm'
							className='rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm'
						>
							Storms
							<Badge
								variant='secondary'
								className='ml-2 bg-gray-200 text-gray-700'
							>
								{eventCounts.storm || 0}
							</Badge>
						</TabsTrigger>
					</TabsList>

					<ScrollArea className='h-[400px] pr-4'>
						{sortedEvents.length > 0 ? (
							<div className='space-y-4'>
								{sortedEvents.map((event) => (
									<div
										key={event.id}
										className={`p-4 rounded-lg border ${
											event.isNew
												? 'bg-blue-50 border-blue-200 shadow-sm'
												: 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
										} transition-all duration-200`}
									>
										<div className='flex items-start gap-4'>
											<div className='mt-1 bg-white p-2 rounded-full shadow-sm'>
												{getEventIcon(event.type)}
											</div>
											<div className='flex-1'>
												<div className='flex items-center justify-between mb-2'>
													<h3 className='font-medium flex items-center text-gray-900'>
														{event.type} in{' '}
														{event.location}
														{event.isNew && (
															<Badge className='ml-2 bg-blue-600 text-white px-2 py-0.5 text-xs rounded-full'>
																New
															</Badge>
														)}
													</h3>
													<Badge
														className={`${getSeverityColor(
															event.severity
														)} text-white px-2 py-0.5 rounded-full`}
													>
														{event.severity}{' '}
														Severity
													</Badge>
												</div>
												<p className='text-sm text-gray-600 mb-3'>
													{event.description}
												</p>

												{event.imageUrl && (
													<div className='mb-3 rounded-lg overflow-hidden shadow-sm'>
														<Image
															src={
																event.imageUrl ||
																'/placeholder.svg'
															}
															alt={`${event.type} in ${event.location}`}
															width={400}
															height={200}
															className='w-full h-32 object-cover'
														/>
													</div>
												)}

												<div className='flex items-center justify-between text-xs text-gray-500'>
													<span className='flex items-center'>
														<span className='inline-block w-2 h-2 rounded-full bg-gray-300 mr-1'></span>
														Detected{' '}
														{formatDistanceToNow(
															new Date(
																event.timestamp
															)
														)}{' '}
														ago
													</span>
													<span className='font-mono'>
														ID:{' '}
														{event.id.substring(
															0,
															8
														)}
													</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='flex items-center justify-center h-32 text-gray-500'>
								No events found for this category
							</div>
						)}
					</ScrollArea>
				</Tabs>
			</CardContent>
		</Card>
	);
}
