import { useEffect, useState } from 'react';
import { Check, ChevronRight, Send } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';

import {
  Drawer,
  Button,
  Stack,
  Typography,
  TextField,
  Autocomplete,
  List,
  ListItem,
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Box,
} from '@mui/material';
import type { Student } from '../types/student';
import { AnimatePresence, motion } from 'framer-motion';
import type { Course } from '../types/course';
import { useEnrollments } from '../hooks/UseEnrollments';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingBackdrop } from './LoadingBackdrop';

interface Prop {
  open: boolean;
  student: Student | null;
  courses: Course[] | null;
  onClose: () => void;
  onError: (message: string) => void;
  onSubmit: (newCourse: Student) => void;
  onDelete: (courseId: number) => void;
}

export function StudentEditDrawer({
  open,
  student,
  courses,
  onClose,
  onError,
  onSubmit,
  onDelete,
}: Prop) {
  const [studentName, setStudentName] = useState(student?.first_name);
  const [studentLastName, setStudentLastName] = useState(student?.last_name);
  const [studentAge, setStudentAge] = useState(student?.age);
  const [courseToEnrollIn, setCourseToEnrollIn] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [showBackdrop, setShowBackdrop] = useState(false);
  const {
    enrollments,
    loading,
    error,
    refreshEnrollments,
    createEnrollment,
    deleteEnrollment,
  } = useEnrollments();

  useEffect(() => {
    if (!open || !student) return;
    setStudentName(student.first_name);
    setStudentLastName(student.last_name);
    setStudentAge(student.age);
    setCourseToEnrollIn(null);
    refreshEnrollments(student.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, student]);

  return (
    <div>
      <LoadingBackdrop open={showBackdrop} />
      <Toaster position="bottom-center" />
      <Drawer anchor="right" open={open} onClose={() => onClose()}>
        <Stack
          direction="column"
          sx={{ minWidth: 400, padding: 1 }}
          spacing={2}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ padding: 2, textAlign: 'center' }}
          >
            Update student's data
          </Typography>

          <Typography variant="h5" sx={{ padding: 2, textAlign: 'center' }}>
            Basic Info
          </Typography>

          <TextField
            label="Student First Name"
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
            }}
            variant="outlined"
          />

          <TextField
            label="Student Last Name"
            value={studentLastName}
            onChange={(e) => {
              setStudentLastName(e.target.value);
            }}
            variant="outlined"
          />

          <TextField
            label="Student Age"
            type="number"
            value={studentAge}
            onChange={(e) => {
              const val = Number(e.target.value);
              setStudentAge(val);
            }}
          />

          <Typography variant="h5" sx={{ padding: 2, textAlign: 'center' }}>
            Enrollments
          </Typography>

          <AnimatePresence>
            {courses != null && student != null && !loading && !error && (
              <motion.div
                key="loader"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.125 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <List dense={false} sx={{ width: '100%', overflow: 'hidden' }}>
                  {enrollments?.map((enrollment) => {
                    return (
                      <>
                        <ListItem
                          sx={{
                            bgcolor: '#f6f6f6',
                            borderRadius: 3,
                            boxShadow: 1,
                          }}
                          secondaryAction={
                            <IconButton
                              color="primary"
                              edge="end"
                              aria-label="delete"
                              onClick={() => {
                                setShowBackdrop(true);
                                deleteEnrollment(
                                  enrollment.id,
                                  (message: string) => {
                                    setShowBackdrop(false);
                                    toast.error(message);
                                  },
                                  () => {
                                    setShowBackdrop(false);
                                    toast.success(
                                      'Successfully removed from course!'
                                    );
                                  }
                                );
                              }}
                            >
                              <Delete />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Check />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              courses?.find(
                                (item) => item.id === enrollment.course_id
                              )?.course_name
                            }
                            secondary={
                              courses?.find(
                                (item) => item.id === enrollment.course_id
                              )?.course_description
                            }
                          />
                        </ListItem>
                        <Box sx={{ p: 0.5 }} />
                      </>
                    );
                  })}
                </List>
              </motion.div>
            )}
          </AnimatePresence>

          <Autocomplete
            value={courseToEnrollIn}
            onChange={(_event, newValue: string | null) => {
              setCourseToEnrollIn(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            options={
              courses
                ? courses
                    .filter(
                      (item) =>
                        !enrollments.map((en) => en.course_id).includes(item.id)
                    )
                    .map((item) => item.course_name)
                : []
            }
            renderInput={(params) => <TextField {...params} label="Enroll" />}
          />

          <AnimatePresence>
            {courseToEnrollIn != null &&
              courses != null &&
              student != null &&
              !loading &&
              !error && (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.125 }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ListItem
                    sx={{
                      bgcolor: '#f6f6f6',
                      borderRadius: 3,
                      boxShadow: 1,
                    }}
                    secondaryAction={
                      <Button
                        variant="contained"
                        color="primary"
                        aria-label="delete"
                        onClick={() => {
                          setShowBackdrop(true);
                          createEnrollment(
                            Math.max(
                              Math.max(...enrollments.map((item) => item.id)) +
                                1,
                              1
                            ),
                            courses.find(
                              (item) => item.course_name === courseToEnrollIn
                            ) ?? {
                              id: -1,
                              course_name: '',
                              course_description: '',
                              class_duration: -1,
                              start_time: '',
                            },
                            student,
                            courses,
                            (message: string) => {
                              setShowBackdrop(false);
                              toast.error(message);
                            },
                            () => {
                              setShowBackdrop(false);
                              setCourseToEnrollIn(null);
                              toast.success('Successfully enrolled!');
                            }
                          );
                        }}
                      >
                        Enroll
                        <ChevronRight />
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={courseToEnrollIn}
                      secondary={
                        courses?.find(
                          (item) => item.course_name === courseToEnrollIn
                        )?.course_description
                      }
                    />
                  </ListItem>
                </motion.div>
              )}
          </AnimatePresence>

          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={() => {
              if (!student || !studentName || !studentLastName || !studentAge) {
                onError('Please fill out all the forms!');
                return;
              }
              onSubmit({
                id: student?.id,
                first_name: studentName,
                last_name: studentLastName,
                age: studentAge,
              });
            }}
          >
            Update this student's data
          </Button>

          <Button
            variant="contained"
            endIcon={<Delete />}
            onClick={() => onDelete(student?.id ? student.id : -1)}
          >
            Delete this student
          </Button>
        </Stack>
      </Drawer>
    </div>
  );
}
