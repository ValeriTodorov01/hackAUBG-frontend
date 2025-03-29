import { GallerySkeleton } from '@/components/GallerySkeleton';
import { ImageGallery } from '@/components/ImageGallery';
import { Suspense } from 'react';

export default function Home() {
	return (
		<main className='min-h-screen bg-white text-gray-900'>
			<Suspense fallback={<GallerySkeleton />}>
				<div className='container mx-auto p-4 py-8'>
					{/* <h1 className='text-3xl font-bold text-center mb-8'>
						Satellite Monitoring Dashboard
					</h1> */}
					<ImageGallery />
				</div>
			</Suspense>
		</main>
	);
}
