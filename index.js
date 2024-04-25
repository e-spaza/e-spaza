const config = require('./utils/config')
const app = require('./app')

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});