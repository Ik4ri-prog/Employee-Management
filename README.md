# Employee-Management
"You need to install MongoDB and Node.js"



# Install backend dependencies: Go to backend folder and do the commands below


npm install express mongoose bcryptjs jsonwebtoken cors dotenv

npm install nodemon --save-dev

# Install frontend dependencies: Go to frontend folder and do the commands below


cd ..


npx create-react-app frontend


cd frontend


npm install axios react-router-dom


# Create .env file in backend folder and add the code below in the .env file:


PORT=5000


MONGO_URI=mongodb://127.0.0.1:27017/employeeDB


JWT_SECRET=your_secret_key


# Account Admin "

email: admin@gmail.com
password: admin123

If you have done all of this, then the you can run the system now.
