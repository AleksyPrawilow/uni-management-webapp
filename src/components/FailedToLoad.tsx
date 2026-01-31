import { IconButton } from '@mui/material';
import { InfoCard } from './InfoCard';
import { ChevronRight, Error } from '@mui/icons-material';

interface Prop {
  message: string;
  caption: string;
  refresh: () => void;
}

export function FailedToLoad({ message, caption, refresh }: Prop) {
  return (
    <>
      <InfoCard
        title={message}
        caption={caption}
        caption2={
          <Error color="secondary" sx={{ width: 32, height: 32, p: 1 }} />
        }
        buttons={
          <IconButton
            size="large"
            onClick={() => {
              refresh();
            }}
          >
            <ChevronRight />
          </IconButton>
        }
        onClick={refresh}
      />
    </>
  );
}
