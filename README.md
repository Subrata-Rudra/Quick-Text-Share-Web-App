---

# Quick Text Share Web App

A lightweight and efficient web application designed for instant text sharing. Whether it's code snippets, notes, or any textual content, share it seamlessly with others via unique 4 digit code.

## 💻 Demo
<img src="./Readme Media/demo.gif" alt="Demo GIF" width="300" height="660">

## 🚀 Live Demo
Access the live application here: [quiktext.vercel.app](https://quiktext.vercel.app)

## 🛠️ Tech Stack

- **Frontend:** React.s
- **Backend:** Node.js, Express.s
- **Object Storage:** Cloudinary (for storing text files)
- **Database:** MongoDB, Redis (for server side caching)
- **Deployment:** Vercel (Frontend), Render (Backend), Cloudinary (Object storage), Render (Redis), MongoDB Cloud (MongoDB)

## ✨ Features

- Instantly share text with a unique 4 digit code
- Clean and intuitive user interface
- No authentication required for quick sharing
- Responsive design for all devices

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Subrata-Rudra/Quick-Text-Share-Web-App.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd Quick-Text-Share-Web-App
   ```
3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
4. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Configuration

1. **Set up environment variables for backend:**
   - Create a `.env` file in the `backend` directory.
   - Add the following:
     ```bash
     MONGO_URI=your_mongodb_connection_string
     REDIS_URL=your_redis_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```
2. **Set up environment variables for frontend:**
   - Create a `.env` file in the `frontend` directory.
   - Add the following:
     ```bash
     VITE_CLOUDINARY_URL=your_cloudinary_url
     VITE_BACKEND_SERVER_URL=your_backend_server_url(i.e http://localhost:5000)
     ```
3. **Ensure MongoDB is running and accessible.**
4. **Ensure Redis Server is running and accessible.**

## 🧪 Running the Application Locally

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`.

2. **Start the frontend application:**
   ```bash
   cd ../frontend
   npm run dev
   ``
   The frontend will run on `http://localhost:5173`.

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🧑‍💻 Author

- **Subrata Rudra**
  - [GitHub](https://github.com/Subrata-Rudra)
  - [LinkedIn](https://www.linkedin.com/in/subrata-rudra-b481741b7/)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🌟 Support & Contributions

If you find this project helpful, please consider giving it a ⭐️ star — it really helps and motivates!

I welcome contributions of all kinds — whether it's bug fixes, feature suggestions, documentation improvements, or code enhancements.
Feel free to fork the repo and submit a pull request!

---
