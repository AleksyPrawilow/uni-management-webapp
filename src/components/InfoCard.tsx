/// <reference types="vite-plugin-svgr/client" />

import { ChevronRight } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

interface Prop<T> {
  object: T;
  title: string;
  caption: string;
  onClick: (newEdited: T) => void;
}

export function InfoCard<T>({ object, title, caption, onClick }: Prop<T>) {
  return (
    <>
      <Card elevation={2}>
        <CardActionArea
          onClick={() => {
            onClick(object);
          }}
        >
          <CardContent
            sx={{
              p: 2,
              height: 64,
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
        </CardActionArea>
      </Card>
    </>
  );
}
