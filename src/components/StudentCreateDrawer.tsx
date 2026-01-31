import { useState } from 'react';
import { Send } from '@mui/icons-material';

import { Drawer, Button, Stack, Typography, TextField } from '@mui/material';
import type { Student } from '../types/student';

interface Prop {
  open: boolean;
  nextId: number;
  onClose: () => void;
  onError: (message: string) => void;
  onSubmit: (newCourse: Student) => void;
}

export function StudentCreateDrawer({
  open,
  nextId,
  onClose,
  onError,
  onSubmit,
}: Prop) {
  const [studentName, setStudentName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentAge, setStudentAge] = useState(18);

  return (
    <div>
      <Drawer anchor="right" open={open} onClose={() => onClose()}>
        <Stack
          direction="column"
          sx={{ minWidth: 400, padding: 1 }}
          spacing={2}
        >
          <Typography variant="h4" sx={{ padding: 2, textAlign: 'center' }}>
            Add a student
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
              if (!studentName || !studentLastName) {
                onError('Please fill out all the forms!');
                return;
              }
              onSubmit({
                id: nextId,
                first_name: studentName,
                last_name: studentLastName,
                age: studentAge,
              });
              setStudentName('');
              setStudentLastName('');
              setStudentAge(18);
            }}
          >
            Add this student
          </Button>
        </Stack>
      </Drawer>
    </div>
  );
}
