import { createClient } from '@supabase/supabase-js';
import type { Student } from '../types/student';
import { useState } from 'react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export function useEnrollmentParticipants() {
  const [participants, setParticipants] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchParticipants(courseId: number) {
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.rpc('get_enrollments_by_course', {
      p_course_id: courseId,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setParticipants(data);
  }

  return {
    participants,
    loading,
    error,
    refreshParticipants: fetchParticipants,
  };
}
