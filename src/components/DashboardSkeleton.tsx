import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
	return (
		<div className='container mx-auto p-4 space-y-6'>
			<header className='flex items-center justify-between py-4 border-b border-gray-200'>
				<div className='space-y-2'>
					<Skeleton className='h-8 w-64 bg-gray-200' />
					<Skeleton className='h-4 w-48 bg-gray-200' />
				</div>
				<Skeleton className='h-8 w-24 bg-gray-200 rounded-full' />
			</header>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='md:col-span-2'>
					<Skeleton className='h-[500px] w-full bg-gray-200 rounded-lg' />
				</div>
				<div className='space-y-6'>
					<Skeleton className='h-[220px] w-full bg-gray-200 rounded-lg' />
					<Skeleton className='h-[220px] w-full bg-gray-200 rounded-lg' />
				</div>
			</div>

			<Skeleton className='h-[500px] w-full bg-gray-200 rounded-lg' />
		</div>
	);
}
