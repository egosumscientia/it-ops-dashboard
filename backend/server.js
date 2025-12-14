import app from './src/app.js';
import { info } from './src/utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
