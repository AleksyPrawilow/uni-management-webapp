import { useState } from 'react';
import type { Course } from '../types/course';
import type { Student } from '../types/student';
import { createClient } from '@supabase/supabase-js';
import type { Enrollment } from '../types/enrollment';
import dayjs from 'dayjs';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const validateEnrollment = (
  newCourse: Course,
  prevCourses: Course[],
  enrollments: Enrollment[]
) => {
  const filteredCourses = prevCourses.filter((item) =>
    enrollments.map((en) => en.course_id).includes(item.id)
  );

  const startTime1 = dayjs(newCourse.start_time, 'HH:mm');
  const endTime1 = startTime1.add(newCourse.class_duration, 'minutes');

  for (const course of filteredCourses) {
    const startTime2 = dayjs(course.start_time, 'HH:mm');
    const endTime2 = startTime2.add(course.class_duration, 'minutes');
    if (
      (startTime1.isAfter(startTime2) && startTime1.isBefore(endTime2)) ||
      (startTime1.isBefore(startTime2) && endTime1.isAfter(startTime2))
    ) {
      return {
        result: false,
        message:
          "The courses: '" +
          newCourse.course_name +
          "' and '" +
          course.course_name +
          "' overlap. Cannot enroll.",
      };
    }
  }
  return { result: true, message: '' };
};

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEnrollments(studentId: number) {
    setError(null);
    setLoading(true);
    const { error, data } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', studentId);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setEnrollments(data);
    setLoading(false);
  }

  async function createEnrollment(
    course: Course,
    student: Student,
    courses: Course[],
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const validationResult = validateEnrollment(course, courses, enrollments);
    if (!validationResult.result) {
      onError(validationResult.message);
      return;
    }
    const { error, data } = await supabase
      .from('enrollments')
      .insert({ course_id: course.id, student_id: student.id })
      .select('*');
    if (error) {
      onError(error.message);
      return;
    }
    setEnrollments((prev) => [
      ...prev,
      { id: data[0].id, student_id: student.id, course_id: course.id },
    ]);
    onSuccess();
  }

  async function deleteEnrollment(
    enrollmentId: number,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId);
    if (error) {
      onError(error.message);
      return;
    }
    setEnrollments((prev) =>
      prev.filter((enrollment) => enrollment.id !== enrollmentId)
    );
    onSuccess();
  }

  return {
    enrollments,
    loading,
    error,
    refreshEnrollments: fetchEnrollments,
    createEnrollment: createEnrollment,
    deleteEnrollment: deleteEnrollment,
  };
}
