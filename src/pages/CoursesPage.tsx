/// <reference types="vite-plugin-svgr/client" />

import { backOut, motion } from 'framer-motion';
import { useState } from 'react';
import type { Course } from '../types/course';
import { InfoCard } from '../components/InfoCard';
import toast, { Toaster } from 'react-hot-toast';
import { CourseEditDrawer } from '../components/CourseEditDrawer';
import { CourseCreateDrawer } from '../components/CourseCreateDrawer';
import { Stack } from '@mui/material';
import { HeaderCard } from '../components/HeaderCard';

const validateCourse = (newCourse: Course, prevCourses: Course[]) => {
  console.log(prevCourses.map((item) => item.courseName));
  if (
    prevCourses.map((item) => item.courseName).includes(newCourse.courseName)
  ) {
    return { result: false, message: 'Course name must be unique.' };
  }
  return { result: true, message: '' };
};

export function CoursesPage() {
  const [isCreationMenuOpened, setIsCreationMenuOpened] = useState(false);
  const [isEditMenuOpened, setIsEditMenuOpened] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState([
    {
      courseId: 1,
      courseName: 'Test course 1',
      courseDescription: 'Description',
      startTime: '10:00',
      courseClassDuration: 45,
    },
    {
      courseId: 2,
      courseName: 'Test course 2',
      courseDescription: 'Description',
      startTime: '12:00',
      courseClassDuration: 45,
    },
    {
      courseId: 3,
      courseName: 'Test course 3',
      courseDescription: 'Description',
      startTime: '12:00',
      courseClassDuration: 45,
    },
  ]);

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3, backOut } },
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <CourseCreateDrawer
        open={isCreationMenuOpened}
        nextId={Math.max(
          Math.max(...courses.map((item: Course) => item.courseId)) + 1,
          1
        )}
        onClose={() => setIsCreationMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onSubmit={(newCourse: Course) => {
          if (!validateCourse(newCourse, courses).result) {
            toast.error(validateCourse(newCourse, courses).message);
            return;
          }
          setIsCreationMenuOpened(false);
          setCourses((prev) => [...prev, newCourse]);
          toast.success('Added a course!');
        }}
      />
      <CourseEditDrawer
        open={isEditMenuOpened}
        course={editedCourse}
        onClose={() => setIsEditMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onDelete={(courseId: number) => {
          setCourses((prev) =>
            prev.filter((course) => course.courseId !== courseId)
          );
          setIsEditMenuOpened(false);
          toast.success('Deleted a course!');
        }}
        onSubmit={(updatedCourse: Course) => {
          setCourses((prev) =>
            prev.map((c) =>
              c.courseId === updatedCourse.courseId ? updatedCourse : c
            )
          );
          toast.success('Updated a course!');
        }}
      />
      <HeaderCard
        text="Courses"
        buttonTitle="Create a new course"
        buttonAction={() => setIsCreationMenuOpened(true)}
      />

      <motion.div variants={container} initial="hidden" animate="show">
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          {courses.map((course) => {
            return (
              <motion.div key={course.courseId} variants={item}>
                <InfoCard<Course>
                  object={course}
                  title={course.courseName}
                  caption={course.courseDescription}
                  onClick={(newEditedCourse: Course) => {
                    setEditedCourse(newEditedCourse);
                    setIsEditMenuOpened(true);
                  }}
                />
              </motion.div>
            );
          })}
        </Stack>
      </motion.div>
    </>
  );
}
