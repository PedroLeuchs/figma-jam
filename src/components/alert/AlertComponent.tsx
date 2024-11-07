import Alert from '@mui/material/Alert';
import { FC } from 'react';
import Collapse from '@mui/material/Collapse';

interface AlertComponentProps {
  show: boolean;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

const AlertComponent: FC<AlertComponentProps> = ({
  severity,
  message,
  show,
}) => {
  return (
    <div className="fixed z-50 bottom-5 lg:left-5 left-5 max-lg:right-5  ">
      <Collapse in={show}>
        <Alert variant="filled" severity={severity}>
          {message}
        </Alert>
      </Collapse>
    </div>
  );
};

export default AlertComponent;
