import { InfoCard } from './InfoCard';
import { Error } from '@mui/icons-material';

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
        onClick={() => refresh()}
        object={undefined}
        caption2={
          <Error color="secondary" sx={{ width: 32, height: 32, p: 1 }} />
        }
      />
    </>
  );
}
