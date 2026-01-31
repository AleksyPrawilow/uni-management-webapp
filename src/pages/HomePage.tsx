import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Basic university management system
        </Typography>
        <Typography variant="h6" color="text.secondary">
          A simple web app which allows the admins to add, edit, and delete
          courses, students, and enrollments
        </Typography>
      </Box>
    </Box>
  );
}
