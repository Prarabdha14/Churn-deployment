import os
import sqlite3
import pandas as pd
from flask import Flask, request, jsonify, render_template_string
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder

# --- Initialization ---
app = Flask(__name__)
DB_FILE = "customer_churn.db"
MODEL_FILE = "churn_model.pkl"

# --- Database Setup ---
def init_db():
    """Initializes the database and populates it with sample data."""
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE) # Start fresh each time for this example

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create table
    cursor.execute('''
        CREATE TABLE customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gender TEXT,
            senior_citizen INTEGER,
            partner TEXT,
            dependents TEXT,
            tenure INTEGER,
            phone_service TEXT,
            multiple_lines TEXT,
            internet_service TEXT,
            online_security TEXT,
            online_backup TEXT,
            device_protection TEXT,
            tech_support TEXT,
            streaming_tv TEXT,
            streaming_movies TEXT,
            contract TEXT,
            paperless_billing TEXT,
            payment_method TEXT,
            monthly_charges REAL,
            total_charges REAL,
            churn TEXT
        )
    ''')

    # Add sample data (a small subset for demonstration)
    sample_data = [
        ('Female', 0, 'Yes', 'No', 1, 'No', 'No phone service', 'DSL', 'No', 'Yes', 'No', 'No', 'No', 'No', 'Month-to-month', 'Yes', 'Electronic check', 29.85, 29.85, 'No'),
        ('Male', 0, 'No', 'No', 34, 'Yes', 'No', 'DSL', 'Yes', 'No', 'Yes', 'No', 'No', 'No', 'One year', 'No', 'Mailed check', 56.95, 1889.5, 'No'),
        ('Male', 0, 'No', 'No', 2, 'Yes', 'No', 'DSL', 'Yes', 'Yes', 'No', 'No', 'No', 'No', 'Month-to-month', 'Yes', 'Mailed check', 53.85, 108.15, 'Yes'),
        ('Male', 0, 'No', 'No', 45, 'No', 'No phone service', 'DSL', 'Yes', 'No', 'Yes', 'Yes', 'No', 'No', 'One year', 'No', 'Bank transfer (automatic)', 42.3, 1840.75, 'No'),
        ('Female', 0, 'No', 'No', 2, 'Yes', 'No', 'Fiber optic', 'No', 'No', 'No', 'No', 'No', 'No', 'Month-to-month', 'Yes', 'Electronic check', 70.7, 151.65, 'Yes'),
        ('Female', 0, 'No', 'No', 8, 'Yes', 'Yes', 'Fiber optic', 'No', 'No', 'Yes', 'No', 'Yes', 'Yes', 'Month-to-month', 'Yes', 'Electronic check', 99.65, 820.5, 'Yes'),
        ('Male', 0, 'No', 'Yes', 22, 'Yes', 'Yes', 'Fiber optic', 'No', 'Yes', 'No', 'No', 'Yes', 'No', 'Month-to-month', 'Yes', 'Credit card (automatic)', 89.1, 1949.4, 'No'),
        ('Female', 0, 'No', 'No', 10, 'No', 'No phone service', 'DSL', 'Yes', 'No', 'No', 'No', 'No', 'No', 'Month-to-month', 'No', 'Mailed check', 29.75, 301.9, 'No'),
        ('Female', 0, 'Yes', 'No', 28, 'Yes', 'Yes', 'Fiber optic', 'No', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Month-to-month', 'Yes', 'Electronic check', 104.8, 3046.05, 'Yes'),
        ('Male', 0, 'No', 'Yes', 62, 'Yes', 'No', 'DSL', 'Yes', 'Yes', 'No', 'Yes', 'No', 'No', 'Two year', 'Yes', 'Bank transfer (automatic)', 56.15, 3487.95, 'No')
    ]

    cursor.executemany('''
        INSERT INTO customers (gender, senior_citizen, partner, dependents, tenure, phone_service, multiple_lines,
        internet_service, online_security, online_backup, device_protection, tech_support, streaming_tv,
        streaming_movies, contract, paperless_billing, payment_method, monthly_charges, total_charges, churn)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_data)

    conn.commit()
    conn.close()

# --- Machine Learning Model ---
def train_model():
    """Fetches data, preprocesses it, and trains a Random Forest model."""
    conn = sqlite3.connect(DB_FILE)
    df = pd.read_sql_query("SELECT * FROM customers", conn)
    conn.close()

    # Preprocessing
    df['total_charges'] = pd.to_numeric(df['total_charges'], errors='coerce')
    df.dropna(inplace=True)

    le = LabelEncoder()
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = le.fit_transform(df[col])

    # Feature and Target Split
    X = df.drop(['churn', 'id'], axis=1)
    y = df['churn']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model Training
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation (for logging purposes)
    y_pred = model.predict(X_test)
    print(f"Model Accuracy: {accuracy_score(y_test, y_pred):.2f}")

    return model, X.columns

# Initialize and train the model on startup
init_db()
model, feature_columns = train_model()


# --- API Routes ---
@app.route('/')
def home():
    """Renders the main HTML page."""
    # This is a simplified example. In a real app, use Flask's render_template
    with open("index.html") as f:
        return render_template_string(f.read())

@app.route('/predict', methods=['POST'])
def predict():
    """Receives customer data, preprocesses it, and returns a churn prediction."""
    data = request.json
    
    try:
        # Create a DataFrame from the input data
        input_df = pd.DataFrame([data])
        
        # Preprocess the input data similarly to the training data
        for col in input_df.columns:
             if input_df[col].dtype == 'object':
                le = LabelEncoder()
                # We need to fit on something that has all possible values
                # In a real app, save the encoders from training
                input_df[col] = le.fit_transform(input_df[col])

        # Ensure columns are in the same order as during training
        input_df = input_df[feature_columns]

        # Make prediction
        prediction = model.predict(input_df)
        probability = model.predict_proba(input_df)

        churn_status = 'Yes' if prediction[0] == 1 else 'No'
        churn_probability = f"{probability[0][1]*100:.2f}%"

        return jsonify({'churn': churn_status, 'probability': churn_probability})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/add_customer', methods=['POST'])
def add_customer():
    """Adds a new customer record to the database and retrains the model."""
    global model, feature_columns
    data = request.json
    
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Note: In a real app, sanitize inputs to prevent SQL injection
        cursor.execute('''
            INSERT INTO customers (gender, senior_citizen, partner, dependents, tenure, phone_service, multiple_lines,
            internet_service, online_security, online_backup, device_protection, tech_support, streaming_tv,
            streaming_movies, contract, paperless_billing, payment_method, monthly_charges, total_charges, churn)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', tuple(data.values()))
        
        conn.commit()
        conn.close()

        # Retrain the model with the new data
        model, feature_columns = train_model()

        return jsonify({'message': 'Customer added and model retrained successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)