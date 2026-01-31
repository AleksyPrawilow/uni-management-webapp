/// <reference types="vite-plugin-svgr/client" />

import { ChevronRight } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

interface Prop<T> {
  object: T;
  title: string;
  caption: string;
  caption2: React.ReactNode | null;
  onClick: (newEdited: T) => void;
}

export function InfoCard<T>({
  object,
  title,
  caption,
  caption2,
  onClick,
}: Prop<T>) {
  return (
    <>
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardActionArea onClick={() => onClick(object)}>
          <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
            {caption2 != null && (
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px 0 0 4px',
                }}
              >
                {caption2}
              </Box>
            )}
            <CardContent
              sx={{
                p: 2,
                height: 64,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack>
                <Typography variant="h6" fontWeight="bold">
                  {title}
                </Typography>
                <Typography variant="body2">{caption}</Typography>
              </Stack>

              <IconButton size="large">
                <ChevronRight />
              </IconButton>
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
    </>
  );
}
