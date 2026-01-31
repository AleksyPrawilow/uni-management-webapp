/// <reference types="vite-plugin-svgr/client" />

import { AnimatePresence, backOut, motion } from 'framer-motion';
import { useState } from 'react';
import { InfoCard } from '../components/InfoCard';
import toast, { Toaster } from 'react-hot-toast';
import { CircularProgress, Stack } from '@mui/material';
import { HeaderCard } from '../components/HeaderCard';
import type { Student } from '../types/student';
import { StudentCreateDrawer } from '../components/StudentCreateDrawer';
import { StudentEditDrawer } from '../components/StudentEditDrawer';
import { Person } from '@mui/icons-material';
import { useStudents } from '../hooks/UseStudents';
import { LoadingBackdrop } from '../components/LoadingBackdrop';
import { FailedToLoad } from '../components/FailedToLoad';

export function StudentsPage() {
  const [isCreationMenuOpened, setIsCreationMenuOpened] = useState(false);
  const [isEditMenuOpened, setIsEditMenuOpened] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student | null>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const {
    students,
    loading,
    error,
    refreshStudents,
    updateStudent,
    createStudent,
    deleteStudent,
  } = useStudents();

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

      <StudentCreateDrawer
        open={isCreationMenuOpened}
        nextId={Math.max(
          Math.max(...students.map((item: Student) => item.id)) + 1,
          1
        )}
        onClose={() => setIsCreationMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onSubmit={(newStudent: Student) => {
          setIsCreationMenuOpened(false);
          setShowBackdrop(true);
          createStudent(
            newStudent,
            (message: string) => {
              toast.error(message);
              setShowBackdrop(false);
            },
            () => {
              toast.success('Added a new student!');
              setShowBackdrop(false);
            }
          );
        }}
      />
      <StudentEditDrawer
        open={isEditMenuOpened}
        student={editedStudent}
        onClose={() => setIsEditMenuOpened(false)}
        onError={(message: string) => toast.error(message)}
        onDelete={(studentId: number) => {
          setIsEditMenuOpened(false);
          setShowBackdrop(true);
          deleteStudent(
            studentId,
            (message: string) => {
              toast.error(message);
              setShowBackdrop(false);
            },
            () => {
              toast.success('Deleted a student!');
              setShowBackdrop(false);
            }
          );
        }}
        onSubmit={(updatedStudent: Student) => {
          setShowBackdrop(true);
          updateStudent(
            updatedStudent,
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
        text="Students"
        buttonTitle="Add a new student"
        buttonAction={() => setIsCreationMenuOpened(true)}
      />

      {/* <Box display="flex" justifyContent="center" width="100%">
        <Pagination count={10} color="primary" size="large" sx={{ p: 2 }} />
      </Box> */}

      {!loading && error === null && (
        <motion.div variants={container} initial="hidden" animate="show">
          <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
            {students.map((student) => {
              return (
                <motion.div key={student.id} variants={item}>
                  <InfoCard<Student>
                    object={student}
                    title={student.first_name + ' ' + student.last_name}
                    caption={'Age: ' + student.age.toString() + ' years old'}
                    caption2={
                      <Person
                        color="secondary"
                        sx={{ width: 32, height: 32, p: 1 }}
                      />
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
            <FailedToLoad
              message={error}
              caption=""
              refresh={refreshStudents}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
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
            <CircularProgress size="3rem" color="primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
