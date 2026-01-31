// useUsersViewModel.ts
import { useEffect, useState } from 'react';
import type { Course } from '../types/course';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const validateCourse = (newCourse: Course, prevCourses: Course[]) => {
  console.log(prevCourses.map((item) => item.course_name));
  if (
    prevCourses.map((item) => item.course_name).includes(newCourse.course_name)
  ) {
    return { result: false, message: 'Course name must be unique.' };
  }
  return { result: true, message: '' };
};

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCourses() {
    setError(null);
    setLoading(true);
    const { error, data } = await supabase.from('courses').select('*');
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setCourses(data);
    setLoading(false);
  }

  async function updateCourse(
    newCourse: Course,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const { error } = await supabase
      .from('courses')
      .update(newCourse)
      .eq('id', newCourse.id);
    if (error) {
      onError(error.message);
      return;
    }
    setCourses((prev) =>
      prev.map((c) => (c.id === newCourse.id ? newCourse : c))
    );
    onSuccess();
  }

  async function createCourse(
    newCourse: Course,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const validationResult = validateCourse(newCourse, courses);
    if (!validationResult.result) {
      onError(validationResult.message);
      return;
    }
    const { error } = await supabase.from('courses').insert(newCourse);
    if (error) {
      onError(error.message);
      return;
    }
    setCourses((prev) => [...prev, newCourse]);
    onSuccess();
  }

  async function deleteCourse(
    courseId: number,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    if (error) {
      onError(error.message);
      return;
    }
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
    onSuccess();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    refreshCourses: fetchCourses,
    updateCourse: updateCourse,
    createCourse: createCourse,
    deleteCourse: deleteCourse,
  };
}
