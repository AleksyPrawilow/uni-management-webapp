/// <reference types="vite-plugin-svgr/client" />

import { AnimatePresence, backOut, motion } from 'framer-motion';
import { useState } from 'react';
import type { Course } from '../types/course';
import { InfoCard } from '../components/InfoCard';
import toast, { Toaster } from 'react-hot-toast';
import { CourseEditDrawer } from '../components/CourseEditDrawer';
import { CourseCreateDrawer } from '../components/CourseCreateDrawer';
import {
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { HeaderCard } from '../components/HeaderCard';
import { useCourses } from '../hooks/UseCourses';
import dayjs from 'dayjs';
import { ClockIcon } from '@mui/x-date-pickers';
import { LoadingBackdrop } from '../components/LoadingBackdrop';
import { FailedToLoad } from '../components/FailedToLoad';
import { CourseModal } from '../components/CourseModal';
import { ChevronRight, People } from '@mui/icons-material';

export function CoursesPage() {
  const [isCreationMenuOpened, setIsCreationMenuOpened] = useState(false);
  const [isEditMenuOpened, setIsEditMenuOpened] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);
  const [selectedParticipants, setSelectedParticipants] =
    useState<Course | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
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

      {selectedParticipants != null && (
        <CourseModal
          open={showStudents}
          onClose={() => setShowStudents(false)}
          courseId={selectedParticipants.id}
        />
      )}

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
                  <InfoCard
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
                    buttons={
                      <Stack direction="row" spacing={2}>
                        <Button
                          size="large"
                          variant="contained"
                          color="primary"
                          endIcon={<People />}
                          onClick={() => {
                            setSelectedParticipants(course);
                            setShowStudents(true);
                          }}
                        >
                          {!isSmall && 'Students'}
                        </Button>
                        <Button
                          size="large"
                          variant="contained"
                          color="primary"
                          endIcon={<ChevronRight />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditedCourse(course);
                            setIsEditMenuOpened(true);
                          }}
                        >
                          {!isSmall && 'Edit'}
                        </Button>
                      </Stack>
                    }
                    onClick={() => {
                      setSelectedParticipants(course);
                      setShowStudents(true);
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
