import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

print("Starting model training script...")

# 1. Load Data
df = pd.read_csv('telecom_analysis_complete.csv')

# 2. Preprocessing for Prediction Model
df_pred = df.drop(['customerID', 'Cluster'], axis=1)
df_pred = pd.get_dummies(df_pred, drop_first=True)

# Separate features and target
X = df_pred.drop('Churn_Yes', axis=1)
y = df_pred['Churn_Yes']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Logistic Regression Model
logistic_model = LogisticRegression(max_iter=1000)
logistic_model.fit(X_train, y_train)
print("Logistic Regression model trained.")

# 3. Preprocessing for Clustering Model
features_for_clustering = df[['tenure', 'MonthlyCharges']]
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features_for_clustering)

# Train KMeans Model
kmeans_model = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans_model.fit(scaled_features)
print("KMeans clustering model trained.")

# 4. Save Everything
with open('logistic_model.pkl', 'wb') as f:
    pickle.dump(logistic_model, f)

with open('kmeans_model.pkl', 'wb') as f:
    pickle.dump(kmeans_model, f)

with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
    
# Save the column order for the prediction model
model_columns = X.columns
with open('model_columns.pkl', 'wb') as f:
    pickle.dump(model_columns, f)

print("Models and scaler have been saved successfully!")