const express = require('express');
const cors = require('cors');
const userAccountController = require('./controllers/userAccountController'); // Import user account routes
const loginController = require('./controllers/loginController');
const userProfileController = require('./controllers/userProfileController'); // Import user profile routes
const categoryController = require('./controllers/categoryController');
const serviceController = require('./controllers/serviceController');
const viewController = require('./controllers/viewController');
const shortlistController = require('./controllers/shortlistController');
const logController = require('./controllers/logController');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Controllers
app.use(userAccountController); 
app.use(loginController);
app.use(userProfileController); 
app.use(categoryController);
app.use(serviceController);
app.use(viewController);
app.use(shortlistController);
app.use(logController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
