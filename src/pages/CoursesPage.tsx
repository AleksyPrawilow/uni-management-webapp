/// <reference types="vite-plugin-svgr/client" />

import { AnimatePresence, backOut, motion } from 'framer-motion';
import { useState } from 'react';
import type { Course } from '../types/course';
import { InfoCard } from '../components/InfoCard';
import toast, { Toaster } from 'react-hot-toast';
import { CourseEditDrawer } from '../components/CourseEditDrawer';
import { CourseCreateDrawer } from '../components/CourseCreateDrawer';
import { CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { HeaderCard } from '../components/HeaderCard';
import { useCourses } from '../hooks/UseCourses';
import dayjs from 'dayjs';
import { ClockIcon } from '@mui/x-date-pickers';
import { LoadingBackdrop } from '../components/LoadingBackdrop';
import { FailedToLoad } from '../components/FailedToLoad';

export function CoursesPage() {
  const [isCreationMenuOpened, setIsCreationMenuOpened] = useState(false);
  const [isEditMenuOpened, setIsEditMenuOpened] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const {
    courses,
    loading,
    error,
    refreshCourses,
    updateCourse,
    createCourse,
    deleteCourse,
  } = useCourses();

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

      <LoadingBackdrop open={showBackdrop} />

      <CourseCreateDrawer
        open={isCreationMenuOpened}
        nextId={Math.max(
          Math.max(...courses.map((item: Course) => item.id)) + 1,
          1
        )}
        onClose={() => setIsCreationMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onSubmit={(newCourse: Course) => {
          setIsCreationMenuOpened(false);
          setShowBackdrop(true);
          createCourse(
            newCourse,
            (message) => {
              toast.error(message);
              setShowBackdrop(false);
            },
            () => {
              toast.success('Added a course!');
              setShowBackdrop(false);
            }
          );
        }}
      />
      <CourseEditDrawer
        open={isEditMenuOpened}
        course={editedCourse}
        onClose={() => setIsEditMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onDelete={(courseId: number) => {
          setIsEditMenuOpened(false);
          setShowBackdrop(true);
          deleteCourse(
            courseId,
            (message: string) => {
              toast.error(message);
              setShowBackdrop(false);
            },
            () => {
              toast.success('Deleted a course!');
              setShowBackdrop(false);
            }
          );
        }}
        onSubmit={(updatedCourse: Course) => {
          setShowBackdrop(true);
          updateCourse(
            updatedCourse,
            (message: string) => {
              toast.error(message);
              setShowBackdrop(false);
            },
            () => {
              toast.success('Updated a course!');
              setShowBackdrop(false);
            }
          );
        }}
      />
      <HeaderCard
        text="Courses"
        buttonTitle="Create a new course"
        buttonAction={() => setIsCreationMenuOpened(true)}
      />

      {/* <Box display="flex" justifyContent="center" width="100%">
        <Pagination count={10} color="primary" size="large" sx={{ p: 2 }} />
      </Box> */}

      {!loading && error === null && (
        <motion.div variants={container} initial="hidden" animate="show">
          <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
            {courses.map((course) => {
              return (
                <motion.div key={course.id} variants={item}>
                  <InfoCard<Course>
                    object={course}
                    title={course.course_name}
                    caption={course.course_description}
                    caption2={
                      <Stack
                        direction="row"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <ClockIcon
                          color="secondary"
                          sx={{ width: 32, height: 32, ml: 1 }}
                        />
                        <Typography
                          variant="body1"
                          color="secondary.main"
                          textAlign="center"
                          sx={{ p: 0, mr: 1, ml: 1 }}
                        >
                          {course.start_time}
                          <Divider sx={{ borderColor: 'secondary.main' }} />
                          {dayjs(course.start_time, 'HH:mm')
                            .add(course.class_duration, 'minutes')
                            .format('HH:mm')
                            .toString()}
                        </Typography>
                      </Stack>
                    }
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
      )}

      <AnimatePresence>
        {error != null && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FailedToLoad message={error} caption="" refresh={refreshCourses} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size="3rem" color="primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
