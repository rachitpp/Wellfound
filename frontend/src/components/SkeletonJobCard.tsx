import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonJobCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 overflow-hidden animate-pulse-slow">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <Skeleton width={250} height={28} />
          <div className="flex gap-2 items-center">
            <Skeleton width={120} height={20} />
          </div>
        </div>
        <Skeleton width={100} height={40} borderRadius={8} />
      </div>
      <div className="mt-4">
        <Skeleton count={3} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton width={60} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={70} height={24} borderRadius={12} />
      </div>
    </div>
  );
}
