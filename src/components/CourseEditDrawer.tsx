import { useEffect, useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Delete } from '@mui/icons-material';
import { Send } from '@mui/icons-material';

import { Drawer, Button, Stack, Typography, TextField } from '@mui/material';
import type { Course } from '../types/course';

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
  const [startTime, setStartTime] = useState<Dayjs | null>(
    course?.start_time ? dayjs(course.start_time, 'HH:mm') : null
  );
  const [classDuration, setClassDuration] = useState(course?.class_duration);

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
            Edit Course
          </Typography>

          <TextField
            label="Course name"
            value={courseName}
            onChange={(e) => {
              setCourseName(e.target.value);
            }}
            variant="outlined"
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
          />

          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={() => {
              if (
                course == null ||
                courseName == null ||
                courseDescription == null ||
                startTime == null ||
                classDuration == null
              ) {
                onError('Something went wrong :(');
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
            variant="contained"
            endIcon={<Delete />}
            onClick={() => onDelete(course?.id ? course.id : -1)}
          >
            Delete this course
          </Button>
        </Stack>
      </Drawer>
    </div>
  );
}
