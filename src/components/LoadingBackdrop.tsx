import { Backdrop, CircularProgress } from '@mui/material';

interface Prop {
  open: boolean;
}

export function LoadingBackdrop({ open }: Prop) {
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
    </>
  );
}
