import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Student } from '../types/student';
import type { Course } from '../types/course';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export function useStudents() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchStudents() {
    setError(null);
    setLoading(true);

    {
      const { error, data } = await supabase.from('courses').select('*');
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setCourses(data);
    }

    const { error, data } = await supabase.from('students').select('*');
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setStudents(data);
    setLoading(false);
  }

  async function updateStudent(
    newStudent: Student,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const { error } = await supabase
      .from('students')
      .update(newStudent)
      .eq('id', newStudent.id);
    if (error) {
      onError(error.message);
      return;
    }
    setStudents((prev) =>
      prev.map((c) => (c.id === newStudent.id ? newStudent : c))
    );
    onSuccess();
  }

  async function createStudent(
    newStudent: Student,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const { error, data } = await supabase
      .from('students')
      .insert({
        first_name: newStudent.first_name,
        last_name: newStudent.last_name,
        age: newStudent.age,
      })
      .select('*');
    if (error) {
      onError(error.message);
      return;
    }
    newStudent.id = data[0].id;
    setStudents((prev) => [...prev, newStudent]);
    onSuccess();
  }

  async function deleteStudent(
    studentId: number,
    onError: (message: string) => void,
    onSuccess: () => void
  ) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);
    if (error) {
      onError(error.message);
      return;
    }
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
    onSuccess();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
  }, []);

  return {
    students,
    courses,
    loading,
    error,
    refreshStudents: fetchStudents,
    updateStudent: updateStudent,
    createStudent: createStudent,
    deleteStudent: deleteStudent,
  };
}
