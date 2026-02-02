import { useEffect } from 'react';
import { useCourseParticipants } from '../hooks/UseCourseParticipants';
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  DialogActions,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material';
import { AnimatePresence, backOut, motion } from 'framer-motion';
import { FailedToLoad } from './FailedToLoad';

interface Prob {
  open: boolean;
  courseId: number;
  onClose: () => void;
}

export function CourseModal({ open, courseId, onClose }: Prob) {
  const { participants, loading, error, refreshParticipants } =
    useCourseParticipants();

  useEffect(() => {
    refreshParticipants(courseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, courseId]);

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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Students
          </Typography>
        </DialogTitle>

        <DialogContent>
          {!loading && error === null && (
            <>
              {participants.length === 0 && (
                <Typography textAlign="center" color="text.secondary">
                  No students found
                </Typography>
              )}
              <motion.div variants={container} initial="hidden" animate="show">
                <List>
                  {participants.map((student) => (
                    <motion.div key={student.id} variants={item}>
                      <ListItem
                        key={student.id}
                        sx={{
                          mb: 1,
                          borderRadius: 3,
                          boxShadow: 2,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {student.first_name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={student.first_name + ' ' + student.last_name}
                          secondary={'Age: ' + student.age + ' years old'}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </motion.div>
            </>
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
                  refresh={() => refreshParticipants(courseId)}
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
        </DialogContent>

        <DialogActions>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            width="100%"
          >
            <Button onClick={onClose} variant="contained">
              Close
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
