# %%
import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F
from tqdm import tqdm  # For progress bar
from transformers import pipeline

# %%
df = pd.read_csv('user_responses_final.csv', usecols=[
    'employeeID',
    'salary_response',
    'manager_response',
    'benefits_response',
    'career_response',
    'environment_response',
    'communication_response',
    'support_response',
    'recognition_response',
    'leadership_response',
    'remote_response',
    'worklife_balance'
])


# %%
# Check if GPU is available and set the device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Using device: {device}')

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment-latest')
model = AutoModelForSequenceClassification.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment-latest')

# Move the model to the device (GPU or CPU)
model.to(device)


# %%
def compute_normalized_sentiment_score(text):
    if not str(text).strip():
        # Handle empty strings by assigning neutral sentiment
        return 0.5  # Normalized score for neutral sentiment
    
    try:
        # Tokenize the input text and move tensors to the device
        inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512).to(device)
        
        # Get the model outputs
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Apply softmax to get probabilities
        probs = F.softmax(outputs.logits, dim=-1)
        
        # Convert probabilities to numpy array
        probs = probs.detach().cpu().numpy()[0]
        
        # Verify that probabilities sum to 1
        prob_sum = probs.sum()
        if not 0.99 <= prob_sum <= 1.01:
            print(f"Warning: Probabilities do not sum to 1. Sum = {prob_sum}")
            probs = probs / prob_sum  # Normalize to sum to 1
        
        # Map probabilities to labels using indices
        Pnegative = probs[0]  # Corresponds to Negative
        Pneutral = probs[1]   # Corresponds to Neutral
        Ppositive = probs[2]  # Corresponds to Positive
        
        # Compute Sentiment Score
        sentiment_score = (Pnegative * 1) + (Pneutral * 2) + (Ppositive * 3)
        
        # Compute Normalized Sentiment Score
        normalized_sentiment_score = (sentiment_score - 1) / 2  # Should be between 0 and 1
        
        # Ensure the normalized score is within [0,1]
        normalized_sentiment_score = max(0, min(1, normalized_sentiment_score))
        
        return normalized_sentiment_score
    except Exception as e:
        print(f"Error processing text: {text}\nException: {e}")
        # Assign neutral score in case of error
        return 0.5


# %%
# Initialize empty lists to store normalized sentiment scores
salary_sentiment_scores = []
manager_sentiment_scores = []
benefits_sentiment_scores = []
career_sentiment_scores = []
environment_sentiment_scores = []
communication_sentiment_scores = []
support_sentiment_scores = []
recognition_sentiment_scores = []
leadership_sentiment_scores = []
remote_sentiment_scores = []
worlife_balance_sentiment_scores = []


# Iterate over each row with a progress bar
for index, row in tqdm(df.iterrows(), total=df.shape[0], desc="Processing Responses"):
    # Get each response
    salary_response = row['salary_response']
    manager_response = row['manager_response']
    benefits_response = row['benefits_response']
    career_response = row['career_response']
    environment_response = row['environment_response']
    communication_response = row['communication_response']
    support_response = row['support_response']
    recognition_response = row['recognition_response']
    leadership_response = row['leadership_response']
    remote_response = row['remote_response']
    worklife_balance_response = row['worklife_balance']
    
    # Compute normalized sentiment scores for each response
    salary_normalized = compute_normalized_sentiment_score(salary_response)
    manager_normalized = compute_normalized_sentiment_score(manager_response)
    benefits_normalized = compute_normalized_sentiment_score(benefits_response)
    career_normalized = compute_normalized_sentiment_score(career_response)
    environment_normalized = compute_normalized_sentiment_score(environment_response)
    communication_normalized = compute_normalized_sentiment_score(communication_response)
    support_normalized = compute_normalized_sentiment_score(support_response)
    recognition_normalized = compute_normalized_sentiment_score(recognition_response)
    leadership_normalized = compute_normalized_sentiment_score(leadership_response)
    remote_normalized = compute_normalized_sentiment_score(remote_response)
    worklife_balance_normalized = compute_normalized_sentiment_score(worklife_balance_response)

    salary_sentiment_scores.append(salary_normalized)
    manager_sentiment_scores.append(manager_normalized)
    benefits_sentiment_scores.append(benefits_normalized)
    career_sentiment_scores.append(career_normalized)
    environment_sentiment_scores.append(environment_normalized)
    communication_sentiment_scores.append(communication_normalized)
    support_sentiment_scores.append(support_normalized)
    recognition_sentiment_scores.append(recognition_normalized)
    leadership_sentiment_scores.append(leadership_normalized)
    remote_sentiment_scores.append(remote_normalized)
    worlife_balance_sentiment_scores.append(worklife_balance_normalized)


# %%
# Create a new DataFrame with the sentiment scores
sentiments_df = pd.DataFrame({
    'employeeID': df['employeeID'],
    'salary_sentiment': salary_sentiment_scores,
    'manager_sentiment': manager_sentiment_scores,
    'benefits_sentiment': benefits_sentiment_scores,
    'career_sentiment': career_sentiment_scores,
    'environment_sentiment': environment_sentiment_scores,
    'communication_sentiment': communication_sentiment_scores,
    'support_sentiment': support_sentiment_scores,
    'recognition_sentiment': recognition_sentiment_scores,
    'leadership_sentiment': leadership_sentiment_scores,
    'remote_sentiment': remote_sentiment_scores,
    'worklife_balance_sentiment': worlife_balance_sentiment_scores
})

# Display the first few rows to verify
sentiments_df.head()

# %%
sentiments_df['avg_sentiment'] = sentiments_df[
    [
        'salary_sentiment', 'manager_sentiment', 'benefits_sentiment', 'career_sentiment', 'environment_sentiment',
        'communication_sentiment', 'support_sentiment', 'recognition_sentiment', 'leadership_sentiment',
        'remote_sentiment', 'worklife_balance_sentiment'
    ]
].mean(axis=1)

# %%
# Save the sentiments DataFrame to a CSV file
sentiments_df.to_csv('sentiments_changed.csv', index=False)

print("Sentiment scores have been saved to 'sentiments.csv'.")

# %%
for col in [
        'salary_sentiment', 'manager_sentiment', 'benefits_sentiment', 'career_sentiment', 'environment_sentiment',
        'communication_sentiment', 'support_sentiment', 'recognition_sentiment', 'leadership_sentiment',
        'remote_sentiment', 'worklife_balance_sentiment', 'avg_sentiment'
    ]:
    if (sentiments_df[col] < 0).any() or (sentiments_df[col] > 1).any():
        print(f"Warning: {col} has values outside the [0, 1] range.")
    else:
        print(f"All values in {col} are within the [0, 1] range.")
        print(f"All values in {col} are within the [0, 1] range.")


