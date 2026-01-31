import { useState } from 'react';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
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

interface Prop {
  open: boolean;
  nextId: number;
  onClose: () => void;
  onError: (message: string) => void;
  onSubmit: (newCourse: Course) => void;
}

export function CourseCreateDrawer({
  open,
  nextId,
  onClose,
  onError,
  onSubmit,
}: Prop) {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [classDuration, setClassDuration] = useState(45);

  return (
    <div>
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
                Create a Course
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
                  step: 15,
                }}
                fullWidth
              />
            </Stack>
          </Box>

          <Button
            variant="contained"
            endIcon={<Send />}
            onClick={() => {
              if (
                !courseName ||
                !courseDescription ||
                !startTime ||
                !classDuration
              ) {
                onError('Please fill out all the forms!');
                return;
              }
              const formattedTime: string = startTime.format('HH:mm');
              onSubmit({
                id: nextId,
                course_name: courseName,
                course_description: courseDescription,
                start_time: formattedTime,
                class_duration: classDuration,
              });
              setCourseName('');
              setCourseDescription('');
              setStartTime(dayjs('10:00', 'HH:mm'));
              setClassDuration(45);
            }}
          >
            Create
          </Button>
        </Stack>
      </Drawer>
    </div>
  );
}
