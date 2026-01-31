import { useEffect, useState } from 'react';
import { Send } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';

import { Drawer, Button, Stack, Typography, TextField } from '@mui/material';
import type { Student } from '../types/student';

interface Prop {
  open: boolean;
  student: Student | null;
  onClose: () => void;
  onError: (message: string) => void;
  onSubmit: (newCourse: Student) => void;
  onDelete: (courseId: number) => void;
}

export function StudentEditDrawer({
  open,
  student,
  onClose,
  onError,
  onSubmit,
  onDelete,
}: Prop) {
  const [studentName, setStudentName] = useState(student?.first_name);
  const [studentLastName, setStudentLastName] = useState(student?.last_name);
  const [studentAge, setStudentAge] = useState(student?.age);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStudentName(student?.first_name);
      setStudentLastName(student?.last_name);
      setStudentAge(student?.age);
    }
  }, [open, student?.first_name, student?.last_name, student?.age]);

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={() => onClose()}>
        <Stack
          direction="column"
          sx={{ minWidth: 400, padding: 1 }}
          spacing={2}
        >
          <Typography variant="h4" sx={{ padding: 2, textAlign: 'center' }}>
            Update student's data
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
