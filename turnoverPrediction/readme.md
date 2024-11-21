# Employee Turnover Prediction System - Hackathon Project

## Overview

This model aims to build a **data-driven system to predict employee turnover** using logistic regression and sentiment analysis. It combines structured employee data (e.g., age, tenure, job satisfaction) with sentiment-based responses from employee surveys to calculate turnover risk. The model is divided into two main components:

1. **Sentiment Analysis**: Processes textual employee survey responses to compute sentiment scores.
2. **Turnover Prediction Model**: Uses these sentiment scores and other employee attributes to predict turnover likelihood and classify employees into risk levels.

The system outputs a dataset with **turnover likelihood (riskScore)** and **risk levels (low, medium, high)** for all employees, which can be used by HR teams to prioritize retention efforts.

---

## Project Structure

### Files and Modules

1. **`calculate_sentiment.py`**
   - Processes employee survey responses using a **pre-trained sentiment analysis model** (`cardiffnlp/twitter-roberta-base-sentiment-latest`).
   - Outputs normalized sentiment scores for 11 job-related aspects, such as:
     - Salary
     - Manager relationships
     - Benefits
     - Career progression
     - Work-life balance
   - Computes an **average sentiment score** for each employee and saves the results to `sentiments_changed.csv`.

2. **`turnover_model.py`**
   - Loads the structured dataset (including sentiment scores).
   - Preprocesses the data:
     - Handles missing values.
     - Scales numerical features.
     - One-hot encodes categorical features.
   - Trains a **logistic regression model** to predict turnover likelihood.
   - Exports results (`turnovers_full.csv`) with:
     - Turnover Likelihood (`riskScore` as a percentage).
     - Turnover Risk Level (`riskLevel`: low, medium, high).

---

## Setup Instructions

### Prerequisites

1. **Python Version**: Python 3.8 or higher.
2. **Required Libraries**:
   - `pandas`
   - `numpy`
   - `torch`
   - `transformers`
   - `scikit-learn`
   - `matplotlib`
   - `seaborn`
   - `statsmodels`
   - `joblib`
   - `tqdm`

Install dependencies using:
```bash
pip install -r requirements.txt
```

---

### **Synthetic Data Generation**

In this project, we used **synthetic data** to simulate employee attributes and survey responses, as real-world data was unavailable. The synthetic data was designed to mimic realistic patterns in employee behavior and sentiment, ensuring the model could be trained and tested effectively. 

#### **How the Synthetic Data Was Generated**

1. **Employee Attributes**:
   - Attributes like `Tenure`, `Age`, `Performance`, `Department`, `Role`, and `DistanceFromHome` were generated using random sampling within realistic ranges. For example:
     - `Tenure`: Random values between 0 and 30 years.
     - `Age`: Random values between 18 and 65.
     - `Performance`: Scores ranging from 1 (low) to 10 (high).

2. **Sentiment Responses**:
   - Textual responses for job-related aspects (e.g., salary, management, work-life balance) were created by using an ollama prompt, with random sampling over very low to very high satisfaction, and then prompting it on several aspects, such as salary, management, career progression etc. The prompt was akin to "As an employee that feels {sentiment}, answer the following question: {question}".

3. **Normalization and Encoding**:
   - Sentiment responses were processed using a pre-trained **RoBERTa-based sentiment analysis model**, which converted textual data into **normalized sentiment scores** (values between 0 and 1). Department and Role were encoded using frequency encoding.

4. **Turnover Labels**:
   - The `Turnover` target variable was generated based on a combination of attributes and random sampling, ensuring a balanced dataset for training.

#### **Why Synthetic Data Was Used**
- Ensures data privacy and compliance with ethical standards.
- Enables proof-of-concept development when access to real-world data is restricted.
- Allows controlled generation of specific patterns for testing model behavior.

This synthetic dataset serves as a placeholder for real employee data and can easily be replaced with actual data in a production environment.

### Usage

#### Step 1: Sentiment Analysis
Run `calculate_sentiment.py` to process survey responses and compute sentiment scores.

1. **Input**: `user_responses_final.csv` containing:
   - `employeeID`
   - Textual responses for 11 job-related aspects (e.g., salary, manager, benefits).
2. **Output**: `sentiments_changed.csv` containing:
   - Normalized sentiment scores (0 to 1) for each aspect.
   - Average sentiment score (`avg_sentiment`).

**Command**:
```bash
python calculate_sentiment.py
```

---

#### Step 2: Train and Evaluate Turnover Model
Run `turnover_model.py` to train a logistic regression model and predict employee turnover.

1. **Input**: `dataset_FINAL_avg.csv` containing:
   - Employee attributes (e.g., age, tenure, job satisfaction).
   - Average sentiment scores (`avg_sentiment`).
2. **Output**:
   - `turnovers_full.csv`: Includes turnover likelihood and predictions.
   - `processed_turnovers.csv`: Adds:
     - `riskScore`: Turnover likelihood (percentage).
     - `riskLevel`: Categorized as `low`, `medium`, or `high`.

**Command**:
```bash
python turnover_model.py
```

---

## Workflow Summary

1. **Data Collection**:
   - Gather employee survey responses (textual data) and structured data (e.g., tenure, performance).

2. **Sentiment Analysis**:
   - Use `calculate_sentiment.py` to process textual responses and compute normalized sentiment scores.
   - Compute an average sentiment score per employee.

3. **Turnover Prediction**:
   - Use `turnover_model.py` to train a logistic regression model with sentiment and structured data.
   - Predict turnover likelihood and classify employees into risk levels.

4. **Output**:
   - Results are saved to `processed_turnovers.csv` for further analysis.

---

## Outputs

### Final Output File: `processed_turnovers.csv`

| employeeID | riskScore | riskLevel |
|------------|-----------|-----------|
| 101        | 15        | Low       |
| 102        | 35        | Medium    |
| 103        | 70        | High      |

- **`riskScore`**: Turnover likelihood (percentage).
- **`riskLevel`**:
  - `Low`: 0–20%
  - `Medium`: 21–40%
  - `High`: Above 40%

---

## How It Works

### Sentiment Analysis (`calculate_sentiment.py`)
- **Input**: Textual survey responses from employees.
- **Processing**:
  - Uses a pre-trained RoBERTa model to classify sentiment as **positive**, **neutral**, or **negative**.
  - Maps sentiment probabilities to a normalized score between 0 and 1.
- **Output**: Normalized sentiment scores for each job-related aspect.

---

### Turnover Prediction (`turnover_model.py`)
- **Input**: Structured employee data and computed average sentiment scores.
- **Processing**:
  - Preprocesses data (e.g., imputation, scaling, encoding).
  - Trains a logistic regression model to predict turnover likelihood.
- **Output**:
  - Turnover likelihood (`riskScore`).
  - Risk level (`riskLevel`).

---

## Visualization and Insights

### Confusion Matrix
Visualizes the model's performance on the test set:
- **True Positives**: Correctly predicted turnover cases.
- **False Positives**: Predicted turnover for employees who stayed.

### Feature Importance
Shows which features contribute most to turnover prediction (e.g., `Tenure`, `avg_sentiment`).

---

## Potential Use Cases
1. **HR Dashboards**:
   - Visualize employee turnover risk at a company level.
   - Identify high-risk employees for proactive retention strategies.
2. **Real-Time Monitoring**:
   - Integrate with live employee feedback systems for continuous risk assessment.
3. **Training Improvements**:
   - Use feature importance to design targeted training programs for managers and employees.

---

## Future Enhancements
- Automate real-time data ingestion from surveys.
- Incorporate deep learning models for improved sentiment analysis.
- Add interactive dashboards for visualization using tools like Power BI or Streamlit.

---

## Contributors
This project was developed as part of a **Hackathon** by a team of five junior developers aiming to create an actionable employee retention system.