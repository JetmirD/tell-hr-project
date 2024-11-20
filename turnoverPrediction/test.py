import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
import joblib

# Load the sentiment analysis model and tokenizer
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
tokenizer = AutoTokenizer.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment-latest')
sentiment_model = AutoModelForSequenceClassification.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment-latest')
sentiment_model.to(device)

# Load the trained turnover prediction model
best_model = joblib.load('best_model.pkl')

# Function to compute normalized sentiment scores
def compute_normalized_sentiment_score(text):
    if not str(text).strip():
        return 0.5  # Neutral sentiment if empty
    try:
        inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512).to(device)
        with torch.no_grad():
            outputs = sentiment_model(**inputs)
        probs = F.softmax(outputs.logits, dim=-1).detach().cpu().numpy()[0]
        sentiment_score = (probs[0] * 1) + (probs[1] * 2) + (probs[2] * 3)
        normalized_score = (sentiment_score - 1) / 2
        return max(0, min(1, normalized_score))
    except Exception as e:
        print(f"Error processing text: {text}\nException: {e}")
        return 0.5

# Input features manually
tenure = float(input("Enter tenure (in years): "))
age = int(input("Enter age: "))
performance = float(input("Enter performance score: "))
dept_freq_encoded = float(input("Enter department frequency encoded value: "))
role_freq_encoded = float(input("Enter role frequency encoded value: "))
job_satisfaction = float(input("Enter job satisfaction score: "))
overtime = int(input("Enter overtime (0 for No, 1 for Yes): "))
distance_from_home = float(input("Enter distance from home (in km): "))
years_since_promotion = float(input("Enter years since last promotion: "))
training_times = int(input("Enter number of training times last year: "))
job_involvement = float(input("Enter job involvement score: "))

# Input textual responses for sentiment-based questions
salary_response = input("Enter salary sentiment response: ")
manager_response = input("Enter manager sentiment response: ")
benefits_response = input("Enter benefits sentiment response: ")
career_response = input("Enter career sentiment response: ")
environment_response = input("Enter environment sentiment response: ")
communication_response = input("Enter communication sentiment response: ")
support_response = input("Enter support sentiment response: ")
recognition_response = input("Enter recognition sentiment response: ")
leadership_response = input("Enter leadership sentiment response: ")
remote_response = input("Enter remote sentiment response: ")
worklife_response = input("Enter work-life balance sentiment response: ")

# Compute sentiment scores
sentiment_scores = [
    compute_normalized_sentiment_score(salary_response),
    compute_normalized_sentiment_score(manager_response),
    compute_normalized_sentiment_score(benefits_response),
    compute_normalized_sentiment_score(career_response),
    compute_normalized_sentiment_score(environment_response),
    compute_normalized_sentiment_score(communication_response),
    compute_normalized_sentiment_score(support_response),
    compute_normalized_sentiment_score(recognition_response),
    compute_normalized_sentiment_score(leadership_response),
    compute_normalized_sentiment_score(remote_response),
    compute_normalized_sentiment_score(worklife_response)
]
avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)

# Combine all inputs into a single feature vector
input_data = pd.DataFrame([[
    tenure, age, performance, dept_freq_encoded, role_freq_encoded, job_satisfaction, overtime,
    distance_from_home, years_since_promotion, training_times, job_involvement, avg_sentiment
]], columns=[
    'Tenure', 'Age', 'Performance', 'DeptFreqEncoded', 'RoleFreqEncoded', 'JobSatisfaction',
    'OverTime', 'DistanceFromHome', 'YearsSinceLastPromotion', 'TrainingTimesLastYear',
    'JobInvolvement', 'avg_sentiment'
])

# Predict turnover likelihood
turnover_probability = best_model.predict_proba(input_data)[:, 1][0]
turnover_prediction = best_model.predict(input_data)[0]

# Display the results
print(f"\nPredicted Turnover Likelihood: {turnover_probability:.2%}")
print(f"Predicted Turnover: {'Yes' if turnover_prediction == 1 else 'No'}")
