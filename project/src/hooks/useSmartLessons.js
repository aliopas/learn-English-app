import { useQuery, useQueryClient } from '@tanstack/react-query';
import { lessonAPI } from '../lib/api';
import { useEffect } from 'react';

export const useSmartLessons = (currentDay) => {
    const queryClient = useQueryClient();

    // Determine the "Smart Chunk" to fetch
    // We want the current day + next 2 days (Total 3 days)
    const daysToFetch = currentDay ? [currentDay, currentDay + 1, currentDay + 2] : [];

    // Query for fetching the batch
    const batchQuery = useQuery({
        queryKey: ['lessonsNodes', currentDay], // Cache key based on current position
        queryFn: async () => {
            if (daysToFetch.length === 0) return [];
            console.log('🚀 Smart Fetching Lessons Batch:', daysToFetch);
            const response = await lessonAPI.getLessonsBatch(daysToFetch);
            return response.data;
        },
        enabled: !!currentDay,
        staleTime: 1000 * 60 * 5, // Check for updates every 5 minutes (Smart Sync)
        refetchInterval: 1000 * 60 * 5, // Background polling for new content
    });

    // Hydrate Individual Lesson Cache
    // This is the magic part: We take the batch and populate 'lesson' cache queries
    // so unrelated components (like LessonView) find the data instantly.
    useEffect(() => {
        if (batchQuery.data && Array.isArray(batchQuery.data)) {
            batchQuery.data.forEach(lesson => {
                if (lesson && lesson.day) {
                    // Update cache for ['lesson', day]
                    // We must match the structure returned by getLesson ( { success: true, data: lesson } )
                    queryClient.setQueryData(['lesson', lesson.day], {
                        success: true,
                        data: lesson
                    });
                    console.log(`✅ Hydrated Cache for Day ${lesson.day}`);
                }
            });
        }
    }, [batchQuery.data, queryClient]);

    return {
        isLoading: batchQuery.isLoading,
        error: batchQuery.error,
        lessons: batchQuery.data || []
    };
};
