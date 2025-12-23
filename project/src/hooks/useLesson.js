import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonAPI } from '../lib/api';

export const useLesson = (dayId, options = {}) => {
    const queryClient = useQueryClient();
    const dayIdInt = parseInt(dayId);

    // Query for fetching lesson data
    const lessonQuery = useQuery({
        queryKey: ['lesson', dayIdInt],
        queryFn: () => lessonAPI.getLesson(dayIdInt),
        enabled: !!dayId, // Only run if dayId is provided
        staleTime: Infinity, // Data never expires naturally (as requested)
        ...options
    });

    // Mutation for completing a lesson
    const completeLessonMutation = useMutation({
        mutationFn: ({ score, timeSpent }) => lessonAPI.completeLesson(dayIdInt, score, timeSpent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
    });

    // Mutation for saving progress
    const saveProgressMutation = useMutation({
        mutationFn: (answers) => lessonAPI.saveProgress(dayIdInt, answers),
    });

    return {
        ...lessonQuery,
        data: lessonQuery.data?.data,
        completeLesson: completeLessonMutation.mutateAsync,
        isCompleting: completeLessonMutation.isPending,
        saveProgress: saveProgressMutation.mutateAsync,
        isSaving: saveProgressMutation.isPending
    };
};
