import { Button, Card, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

interface Props {
  text: string;
  buttonTitle: string | null;
  buttonAction: () => void;
}

export function HeaderCard({ text, buttonTitle, buttonAction }: Props) {
  return (
    <>
      <Card
        sx={{
          width: '100%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          boxShadow: 5,
        }}
      >
        <Stack
          direction="row"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4" fontWeight="bold" textAlign={'center'}>
            {text}
          </Typography>
          {buttonTitle != null && (
            <Button
              variant="contained"
              color="secondary"
              endIcon={<Add />}
              onClick={() => buttonAction()}
            >
              {buttonTitle}
            </Button>
          )}
        </Stack>
      </Card>
    </>
  );
}
