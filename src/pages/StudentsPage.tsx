/// <reference types="vite-plugin-svgr/client" />

import { backOut, motion } from 'framer-motion';
import { useState } from 'react';
import { InfoCard } from '../components/InfoCard';
import toast, { Toaster } from 'react-hot-toast';
import { Stack } from '@mui/material';
import { HeaderCard } from '../components/HeaderCard';
import type { Student } from '../types/student';
import { StudentCreateDrawer } from '../components/StudentCreateDrawer';
import { StudentEditDrawer } from '../components/StudentEditDrawer';

export function StudentsPage() {
  const [isCreationMenuOpened, setIsCreationMenuOpened] = useState(false);
  const [isEditMenuOpened, setIsEditMenuOpened] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState([
    {
      studentId: 1,
      studentFirstName: 'Jan',
      studentLastName: 'Kowalski',
      studentAge: 19,
    },
    {
      studentId: 2,
      studentFirstName: 'Adam',
      studentLastName: 'Nowacki',
      studentAge: 21,
    },
  ]);

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
      <StudentCreateDrawer
        open={isCreationMenuOpened}
        nextId={Math.max(
          Math.max(...students.map((item: Student) => item.studentId)) + 1,
          1
        )}
        onClose={() => setIsCreationMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onSubmit={(newStudent: Student) => {
          setIsCreationMenuOpened(false);
          setStudents((prev) => [...prev, newStudent]);
          toast.success('Added a new student!');
        }}
      />
      <StudentEditDrawer
        open={isEditMenuOpened}
        student={editedStudent}
        onClose={() => setIsEditMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onDelete={(studentId: number) => {
          setStudents((prev) =>
            prev.filter((student) => student.studentId !== studentId)
          );
          setIsEditMenuOpened(false);
          toast.success('Deleted a course!');
        }}
        onSubmit={(updatedStudent: Student) => {
          setStudents((prev) =>
            prev.map((c) =>
              c.studentId === updatedStudent.studentId ? updatedStudent : c
            )
          );
          toast.success('Updated a student!');
        }}
      />
      <HeaderCard
        text="Students"
        buttonTitle="Add a new student"
        buttonAction={() => setIsCreationMenuOpened(true)}
      />

      <motion.div variants={container} initial="hidden" animate="show">
        <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
          {students.map((student) => {
            return (
              <motion.div key={student.studentId} variants={item}>
                <InfoCard<Student>
                  object={student}
                  title={
                    student.studentFirstName + ' ' + student.studentLastName
                  }
                  caption={
                    'Age: ' + student.studentAge.toString() + ' years old'
                  }
                  onClick={(newEditedStudent: Student) => {
                    setEditedStudent(newEditedStudent);
                    setIsEditMenuOpened(true);
                  }}
                />
              </motion.div>
            );
          })}
        </Stack>
      </motion.div>
    </>
  );
}
