
# Panel Template Project

This project serves as a template for a panel application with both an API and frontend setup. Below is a detailed guide on the required dependencies, environment setup, and configurations needed for both the API and frontend.

## Backend Setup (API)

To set up the backend, the following npm packages are required:

```bash
npm i express dotenv mysql axios cors jsonwebtoken path bcrypt body-parser cookie-parser express-session @google-cloud/storage nodemon
```

### Environment Variables
You need to configure an `.env` file in the root of your API project with the following details:

```
PROJECT_ID=your_google_project_id
KEYFILENAME=path_to_your_google_cloud_keyfile.json
BUCKET_NAME=your_google_cloud_storage_bucket_name
```

### Google Cloud Storage Setup

1. Go to the Google Cloud Console.
2. Create a project and get your **PROJECT_ID**.
3. Download the JSON key file for your project and store it securely.
4. Set the **KEYFILENAME** in the `.env` file as the path to the downloaded JSON key file.
5. Set your **BUCKET_NAME** to the name of your Google Cloud Storage bucket.

### Running the API

To run the API, you can use `nodemon` for automatic restarts during development:

```bash
nodemon server.js
```

Make sure to set up your MySQL database according to your application requirements.

## Frontend Setup

To set up the frontend, you will need the following npm packages:

```bash
npm i primeicons react-toastify sweetalert2 js-cookie formik yup axios
```

These packages are used for:

- **PrimeIcons**: UI icons
- **React-Toastify**: Toast notifications
- **SweetAlert2**: Alert messages
- **js-cookie**: Cookie management
- **Formik & Yup**: Form validation
- **Axios**: HTTP client for making API requests

### Running the Frontend

To start the frontend, use the following command in the project root:

```bash
npm start
```

Make sure to configure the API endpoints correctly in the frontend for communication with the backend.

## Project Structure

```
.
├── api                 # Backend (API) folder
├── public              # Public assets for the frontend
├── src                 # React source code for the frontend
├── .gitignore          # Files and folders to be ignored by Git
├── package.json        # NPM configuration file
├── package-lock.json   # NPM lock file for versioning
└── README.md           # Project documentation
```

## Additional Notes

- Ensure that both the backend and frontend are properly connected, particularly regarding the API endpoints and storage solutions.
- You can extend this template according to your project requirements.

## License

This project is licensed under the MIT License.
