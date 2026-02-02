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
  CircularProgress,
} from '@mui/material';
import type { Student } from '../types/student';
import { AnimatePresence, motion } from 'framer-motion';
import type { Course } from '../types/course';
import { useEnrollments } from '../hooks/UseEnrollments';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingBackdrop } from './LoadingBackdrop';
import ConfirmDialog from './ConfirmDialog';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this student"
        message="Are you sure you want to delete this student?"
        option1="Yes"
        option2="No"
        onOption1={() => {
          setShowDeleteConfirm(false);
          onDelete(student?.id ? student.id : -1);
        }}
        onOption2={() => setShowDeleteConfirm(false)}
        onClose={() => setShowDeleteConfirm(false)}
      />

      <LoadingBackdrop open={showBackdrop} />

      <Toaster position="bottom-center" />

      <Drawer anchor="right" open={open} onClose={() => onClose()}>
        <Stack
          direction="column"
          sx={{ maxWidth: 400, minWidth: 400, padding: 1 }}
          spacing={2}
        >
          <Box
            sx={{
              p: 1,
              mb: 2,
              bgcolor: '#f6f6f6',
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight="bold">
                Basic Info
              </Typography>
              <TextField
                label="First Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={studentLastName}
                onChange={(e) => setStudentLastName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Age"
                type="number"
                value={studentAge}
                onChange={(e) => setStudentAge(Number(e.target.value))}
                fullWidth
              />
            </Stack>
          </Box>

          <Box
            sx={{
              p: 1,
              mb: 2,
              bgcolor: '#f6f6f6',
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight="bold">
                Enrollments
              </Typography>
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
                    <List
                      dense={false}
                      sx={{ width: '100%', overflow: 'hidden' }}
                    >
                      {enrollments?.map((enrollment) => {
                        return (
                          <>
                            <ListItem
                              sx={{
                                mb: 1,
                                borderRadius: 2,
                                bgcolor: 'background.paper',
                                boxShadow: 2,
                              }}
                              secondaryAction={
                                <IconButton
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
                                  edge="end"
                                  color="primary"
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
                          </>
                        );
                      })}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box
                sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}
              >
                <Autocomplete
                  value={courseToEnrollIn}
                  onChange={(_, newValue) => setCourseToEnrollIn(newValue)}
                  inputValue={inputValue}
                  onInputChange={(_, newInputValue) =>
                    setInputValue(newInputValue)
                  }
                  options={
                    courses
                      ?.filter(
                        (c) =>
                          !enrollments.map((e) => e.course_id).includes(c.id)
                      )
                      .map((c) => c.course_name) ?? []
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Enroll in course" fullWidth />
                  )}
                  sx={{ flex: 1 }}
                />
                {courseToEnrollIn && student != null && courses != null && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setShowBackdrop(true);
                      createEnrollment(
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
                )}
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={() => {
                if (
                  !student ||
                  !studentName ||
                  !studentLastName ||
                  !studentAge
                ) {
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
              Update
            </Button>
            <Button
              variant="outlined"
              color="error"
              endIcon={<Delete />}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </div>
  );
}
