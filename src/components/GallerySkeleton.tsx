import { Skeleton } from '@/components/ui/skeleton';

export function GallerySkeleton() {
	return (
		<div className='container mx-auto p-4 py-8'>
			<Skeleton className='h-10 w-64 mx-auto mb-8' />

			<div className='max-w-5xl mx-auto'>
				<div className='rounded-xl overflow-hidden shadow-lg bg-white'>
					<Skeleton className='h-[500px] w-full' />

					<div className='p-6 border-t border-gray-100'>
						<div className='flex justify-between mb-4'>
							<Skeleton className='h-6 w-48' />
							<Skeleton className='h-6 w-32' />
						</div>

						<div className='flex flex-wrap justify-center gap-8'>
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className='flex flex-col items-center'
								>
									<Skeleton className='h-[150px] w-[150px] rounded-full' />
									<Skeleton className='h-4 w-20 mt-2' />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
