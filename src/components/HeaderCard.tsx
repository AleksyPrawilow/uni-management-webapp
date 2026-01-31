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
          borderRadius: 3,
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
              sx={{ borderRadius: 3 }}
            >
              {buttonTitle}
            </Button>
          )}
        </Stack>
      </Card>
    </>
  );
}
