import pandas as pd
import pickle
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained models, scaler, and columns
with open('logistic_model.pkl', 'rb') as f:
    logistic_model = pickle.load(f)

with open('kmeans_model.pkl', 'rb') as f:
    kmeans_model = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('model_columns.pkl', 'rb') as f:
    model_columns = pickle.load(f)

@app.route('/')
def home():
    """Renders the main HTML page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Receives customer data and returns a churn prediction."""
    data = request.json
    
    # Convert the single dictionary to a DataFrame
    input_df = pd.DataFrame([data])
    
    # Ensure numerical columns are the correct type
    for col in ['tenure', 'monthly_charges', 'total_charges', 'senior_citizen']:
        if col in input_df.columns:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce')

    # One-Hot Encode the DataFrame
    input_df_processed = pd.get_dummies(input_df)
    
    # Align columns with the training data, filling missing columns with 0
    input_df_aligned = input_df_processed.reindex(columns=model_columns, fill_value=0)
    
    # Make prediction
    try:
        prediction = logistic_model.predict(input_df_aligned)
        probability = logistic_model.predict_proba(input_df_aligned)
        
        churn_status = 'Yes' if prediction[0] == 1 else 'No'
        churn_probability = f"{probability[0][1]*100:.2f}%"
        
        return jsonify({'churn': churn_status, 'probability': churn_probability})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/segment', methods=['POST'])
def segment():
    """Receives customer data and returns a customer segment."""
    data = request.json
    
    # Extract features for clustering
    features = [[data['tenure'], data['MonthlyCharges']]]
    
    # Scale the features
    scaled_features = scaler.transform(features)
    
    # Predict the cluster
    cluster = kmeans_model.predict(scaled_features)[0]
    
    # Map cluster number to a meaningful name
    segment_names = {
        0: "High-Value Loyalist",
        1: "New & At-Risk",
        2: "Stable Core Customer"
    }
    # Note: These mappings might need to be adjusted based on your train_models script output
    segment = segment_names.get(cluster, "Unknown Segment")
    
    return jsonify({'segment': segment})

@app.route('/dashboard')
def dashboard():
    """Renders the Tableau dashboard page."""
    return render_template('dashboard.html')

if __name__ == '__main__':
    app.run(debug=True)