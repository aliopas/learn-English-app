import { useQuery } from '@tanstack/react-query';
import { lessonAPI } from '../lib/api';

/**
 * Hook to fetch and cache all initial app data in a single request
 * This reduces the number of API calls significantly
 */
export const useInitialAppData = () => {
    return useQuery({
        queryKey: ['initialAppData'],
        queryFn: async () => {
            const response = await lessonAPI.getBulkInitialData();
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
        cacheTime: 24 * 60 * 60 * 1000,
        refetchOnWindowFocus: true, // Check for updates when user returns
        refetchInterval: 1000 * 60 * 2, // Background poll every 2 minutes (Live Sync)
        refetchOnMount: true,
        retry: 2
    });
};

/**
 * Hook to get a specific lesson from the cached initial data
 * Avoids unnecessary network requests
 */
export const useLessonFromCache = (dayNumber) => {
    const { data: initialData } = useInitialAppData();

    if (!initialData || !initialData.lessons) {
        return { lesson: null, loading: true };
    }

    const lesson = initialData.lessons.find(l => l.day === parseInt(dayNumber));

    return {
        lesson,
        loading: false,
        availableDays: initialData.availableDays || []
    };
};
