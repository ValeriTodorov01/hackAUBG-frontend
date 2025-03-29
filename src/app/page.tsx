import Dashboard from '@/components/Dashboard';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { ImageSlider } from '@/components/ImageSlider';
import { Suspense } from 'react';

// Sample images for the slider
const sliderImages = [
	{
		src: '/placeholder.svg?height=400&width=800&text=Satellite+Image+1',
		alt: 'Satellite imagery of Earth',
		title: 'Earth Observation',
		description:
			"High-resolution imagery captured by our satellite's primary camera system",
	},
	{
		src: '/placeholder.svg?height=400&width=800&text=Wildfire+Detection',
		alt: 'Wildfire detection imagery',
		title: 'Wildfire Detection',
		description:
			'Thermal imaging used to detect and monitor active wildfires across forest regions',
	},
	{
		src: '/placeholder.svg?height=400&width=800&text=Hurricane+Tracking',
		alt: 'Hurricane tracking visualization',
		title: 'Hurricane Tracking',
		description:
			'Advanced meteorological data visualization for hurricane prediction and tracking',
	},
	{
		src: '/placeholder.svg?height=400&width=800&text=Flood+Monitoring',
		alt: 'Flood monitoring system',
		title: 'Flood Monitoring',
		description:
			'Water level analysis for early detection of potential flooding events',
	},
	{
		src: '/placeholder.svg?height=400&width=800&text=Satellite+Systems',
		alt: 'Satellite systems overview',
		title: 'Satellite Systems',
		description:
			"Overview of our satellite's advanced monitoring and detection systems",
	},
];

export default function Home() {
	return (
		<main className='min-h-screen bg-gray-50 text-gray-900'>
			<Suspense fallback={<DashboardSkeleton />}>
				<div className='container mx-auto p-4 space-y-6'>
					<div className='py-4'>
						<h1 className='text-3xl font-bold text-center mb-6'>
							Satellite Imagery Gallery
						</h1>
						<ImageSlider images={sliderImages} />
					</div>
					<Dashboard />
				</div>
			</Suspense>
		</main>
	);
}
