End-to-End Customer Churn Prediction System
A full-stack machine learning application that predicts customer churn in real-time. This project demonstrates an end-to-end data pipeline, from user input and database storage to live model training and prediction, all deployed as a live web service.

Live Demo Link 🚀
(https://churn-deployment.onrender.com/)

📋 Core Features
Live Prediction API: A RESTful API built with Flask serves real-time churn predictions from a trained Scikit-learn model.

Dynamic Database Integration: New customer records submitted via the UI are stored in an SQLite database, simulating a real-world data persistence layer.

Automatic Model Retraining: The machine learning model automatically retrains on the entire dataset whenever a new customer is added to the database, ensuring the model adapts to new data.

Interactive Web UI: A clean and professional frontend built with HTML and Tailwind CSS for intuitive data entry and clear visualization of results.

Cloud Deployment: The application is deployed on Render, using a Git-based CI/CD workflow for seamless, zero-downtime updates.

🛠️ Tech Stack
Backend: Python, Flask

Machine Learning: Scikit-learn, Pandas

Database: SQLite

Frontend: HTML, Tailwind CSS, JavaScript

Deployment: Gunicorn, Render, Git

⚙️ Architectural Workflow
The project follows a complete data lifecycle every time a user interacts with it, demonstrating a cohesive system architecture.

Startup: The Flask application initializes, creating an SQLite database file (customer_churn.db) and populating it with a baseline dataset. The RandomForestClassifier model is then trained on this initial data.

Prediction Request: A user fills out the form on the frontend, which sends a JSON payload to the /predict API endpoint. The live model processes this data and returns a churn prediction.

Data Persistence & Retraining: A user adds a new customer record. The data is sent to the /add_customer endpoint, which runs an INSERT SQL command to save the new record to the customer_churn.db file.

Live Model Update: Immediately after the database insertion, the train_model() function is triggered again. It runs a SELECT * FROM customers query to pull the entire updated dataset from the database and retrains the model from scratch.

The Machine Learning (ML) Component
The core of this project is a live, adaptive machine learning model.

Model: A RandomForestClassifier from Scikit-learn is used for its robustness and performance on this type of classification task.

Live Training: The model is not pre-trained and loaded from a file. Instead, it is trained live in memory when the application server starts. This is achieved by the train_model() function, which reads directly from the SQL database.

Dynamic Retraining Loop: This is the project's key feature. The add_customer API endpoint creates a powerful feedback loop: UI ➔ API ➔ Database Write ➔ Database Read ➔ Model Retraining. This ensures the model's intelligence is not static but evolves as new data is collected, a critical concept in production MLOps.

The SQL Database Component
The SQLite database acts as the single source of truth for all customer data.

Technology: SQLite was chosen for its serverless, file-based nature, making it perfect for a self-contained, easily deployable demonstration project.

Data Persistence: The database is responsible for all Create, Read, Update, Delete (CRUD) operations. The init_db() function uses a CREATE TABLE SQL command to define the customers schema.

Data Pipeline: The database is the central hub of the data pipeline.

Data Ingestion: The /add_customer API endpoint executes a parameterized INSERT INTO customers (...) VALUES (...) SQL query to securely add new data.

Data Retrieval for ML: The train_model() function executes a SELECT * FROM customers SQL query to load the entire dataset into a Pandas DataFrame, which then serves as the training data for the Scikit-learn model.

🚀 How to Run Locally
Clone the repository:

git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

Create and activate a virtual environment:

python3 -m venv venv
source venv/bin/activate

Install the dependencies:

pip install -r requirements.txt

Run the Flask application:

python app.py
