import { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Delete } from '@mui/icons-material';
import { Send } from '@mui/icons-material';

import {
  Drawer,
  Button,
  Stack,
  Typography,
  TextField,
  Box,
} from '@mui/material';
import type { Course } from '../types/course';
import ConfirmDialog from './ConfirmDialog';

interface Prop {
  open: boolean;
  course: Course | null;
  onClose: () => void;
  onError: (message: string) => void;
  onSubmit: (newCourse: Course) => void;
  onDelete: (courseId: number) => void;
}

export function CourseEditDrawer({
  open,
  course,
  onClose,
  onError,
  onSubmit,
  onDelete,
}: Prop) {
  const [courseName, setCourseName] = useState(course?.course_name);
  const [courseDescription, setCourseDescription] = useState(
    course?.course_description
  );
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [classDuration, setClassDuration] = useState(course?.class_duration);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCourseName(course?.course_name);
      setCourseDescription(course?.course_description);
      setStartTime(
        course?.start_time ? dayjs(course?.start_time, 'HH:mm') : null
      );
      setClassDuration(course?.class_duration);
    }
  }, [
    open,
    course?.course_description,
    course?.course_name,
    course?.start_time,
    course?.class_duration,
  ]);

  return (
    <div>
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete this course"
        message="Are you sure you want to delete this course?"
        option1="Yes"
        option2="No"
        onOption1={() => {
          setShowDeleteConfirm(false);
          onDelete(course?.id ? course.id : -1);
        }}
        onOption2={() => setShowDeleteConfirm(false)}
        onClose={() => setShowDeleteConfirm(false)}
      />

      <Drawer anchor="right" open={open} onClose={() => onClose()}>
        <Stack
          direction="column"
          sx={{ minWidth: 400, padding: 1 }}
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
                Edit Course
              </Typography>
              <TextField
                label="Course name"
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                }}
                variant="outlined"
                fullWidth
              />

              <TextField
                label="Course description"
                value={courseDescription}
                onChange={(e) => {
                  setCourseDescription(e.target.value);
                }}
                multiline
                minRows={3}
                maxRows={6}
                variant="outlined"
                fullWidth
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Select time"
                  value={startTime}
                  onChange={setStartTime}
                  ampm={false}
                />
              </LocalizationProvider>

              <TextField
                label="Duration (minutes)"
                type="number"
                value={classDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 15 && val <= 180) {
                    setClassDuration(val);
                  }
                }}
                inputProps={{
                  min: 15,
                  max: 180,
                  step: 15, // optional: increment by 5
                }}
                fullWidth
              />
            </Stack>
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={() => {
                if (
                  course == null ||
                  courseName == null ||
                  courseDescription == null ||
                  startTime == null ||
                  classDuration == null
                ) {
                  onError('Please fill out all the forms!');
                  return;
                }
                const formattedTime: string = startTime.format('HH:mm');
                onSubmit({
                  id: course.id,
                  course_name: courseName,
                  course_description: courseDescription,
                  start_time: formattedTime,
                  class_duration: classDuration,
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
