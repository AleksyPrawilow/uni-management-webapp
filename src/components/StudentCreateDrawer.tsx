import { useState } from 'react';
import { Send } from '@mui/icons-material';

import {
  Drawer,
  Button,
  Stack,
  Typography,
  TextField,
  Box,
} from '@mui/material';
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
            Create
          </Button>
        </Stack>
      </Drawer>
    </div>
  );
}
