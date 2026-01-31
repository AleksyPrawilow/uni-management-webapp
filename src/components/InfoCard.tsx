/// <reference types="vite-plugin-svgr/client" />

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

interface Prop {
  title: string;
  caption: string;
  caption2: React.ReactNode | null;
  buttons: React.ReactNode;
  onClick: () => void;
}

export function InfoCard({ title, caption, caption2, buttons, onClick }: Prop) {
  return (
    <>
      <Card elevation={2} sx={{ borderRadius: 3 }} onClick={onClick}>
        <CardActionArea onClick={() => {}}>
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

              {buttons}
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
    </>
  );
}
