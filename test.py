# import os
# import boto3
# from transformers import AutoModelForSequenceClassification, AutoTokenizer
# import torch
# import torch.nn.functional as F

# # Initialize S3 client outside the handler for efficiency
# s3 = boto3.client('s3')
# BUCKET_NAME = "trained-bert-model-storage"
# MODEL_DIR = "/mnt/efs/model"  # Make sure this matches your EFS mount path

# MODEL_FILES = [
#     "tokenizer.json",
#     "model.safetensors",
#     "config.json",
#     "vocab.txt",
#     "tokenizer_config.json",
#     "special_tokens_map.json"
# ]

# # Lambda function handler
# def lambda_handler(event, context):
#     # Download model from S3 if not already present
#     download_model_from_s3()

#     # Load model and tokenizer from local directory (EFS)
#     tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
#     model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

#     # Example text from event or default
#     text = event.get('text', "I am feeling great today!")
    
#     # Get prediction
#     result = predict_emotion(text)

#     return result


# def download_model_from_s3():
#     # Check if model files already exist to avoid re-downloading on every request
#     if not all(os.path.exists(os.path.join(MODEL_DIR, file)) for file in MODEL_FILES):
#         print("✅ Model not found in EFS, downloading from S3...")
#         os.makedirs(MODEL_DIR, exist_ok=True)
        
#         for file in MODEL_FILES:
#             s3.download_file(BUCKET_NAME, f"bert_emotion_model/{file}", os.path.join(MODEL_DIR, file))

#         print("✅ Model downloaded successfully.")
#     else:
#         print("✅ Model already exists in EFS.")

# def predict_emotion(text):
#     # Process the text and predict the emotion
#     inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

#     with torch.no_grad():
#         outputs = model(**inputs)
#         logits = outputs.logits

#     probs = F.softmax(logits, dim=1)
#     predicted_label_idx = torch.argmax(probs, dim=1).item()
#     predicted_emotion = ["admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion", "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness", "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise", "neutral"][predicted_label_idx]
#     confidence_score = probs[0][predicted_label_idx].item()

#     # Scale confidence score from (0-1) to (1-10)
#     scaled_score = round(confidence_score * 10, 1)

#     return {
#         "text": text,
#         "predicted_emotion": predicted_emotion,
#         "score": scaled_score
#     }

import boto3
import os
import zipfile
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
# Initialize S3 client
s3 = boto3.client('s3')

MODEL_BUCKET = 'trained-bert-model-storage'
DEPENDENCY_BUCKET_1 = 'https://mydependencies-python.s3.eu-west-2.amazonaws.com/dependencies1.zip'  # For one set of dependencies (boto3, transformers)
DEPENDENCY_BUCKET_2 = 'https://mydependencies-python.s3.eu-west-2.amazonaws.com/dependencies2.zip'  # For another set of dependencies (torch, torchvision)

MODEL_DIR = '/mnt/efs/model'  # Directory for model files (EFS)
DEPENDENCY_DIR = '/tmp'  # Temporary directory for dependencies in Lambda

MODEL_FILES = [
    'tokenizer.json',
    'model.safetensors',
    'config.json',
    'vocab.txt',
    'tokenizer_config.json',
    'special_tokens_map.json'
]

def lambda_handler(event, context):
    # Download model files from S3 to EFS
    download_model_from_s3()

    # Download and install dependencies from S3
    install_dependencies_from_s3()

    # Load model and tokenizer from EFS
    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    
    # Example text from event or default
    text = event.get('text', "I am feeling great today!")
    
    # Get prediction
    result = predict_emotion(text)

    return result

def download_model_from_s3():
    # Download model files if not already present in EFS
    if not all(os.path.exists(os.path.join(MODEL_DIR, file)) for file in MODEL_FILES):
        print("Downloading model files...")
        os.makedirs(MODEL_DIR, exist_ok=True)
        
        for file in MODEL_FILES:
            s3.download_file(MODEL_BUCKET, f"bert_emotion_model/{file}", os.path.join(MODEL_DIR, file))
        print("Model files downloaded.")

def install_dependencies_from_s3():
    # Download and extract dependencies from S3 Bucket 1 (boto3, transformers)
    dependency_zip_1 = '/tmp/dependencies_1.zip'
    s3.download_file(DEPENDENCY_BUCKET_1, 'dependencies/boto3_transformers.zip', dependency_zip_1)
    
    # Extract the dependencies
    with zipfile.ZipFile(dependency_zip_1, "r") as zip_ref:
        zip_ref.extractall(path=DEPENDENCY_DIR)
    print("Dependencies from bucket 1 extracted.")

    # Download and extract dependencies from S3 Bucket 2 (torch, torchvision)
    dependency_zip_2 = '/tmp/dependencies_2.zip'
    s3.download_file(DEPENDENCY_BUCKET_2, 'dependencies/torch_vision.zip', dependency_zip_2)
    
    # Extract the dependencies
    with zipfile.ZipFile(dependency_zip_2, "r") as zip_ref:
        zip_ref.extractall(path=DEPENDENCY_DIR)
    print("Dependencies from bucket 2 extracted.")

def predict_emotion(text):
    # Process the text and predict the emotion
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits

    probs = F.softmax(logits, dim=1)
    predicted_label_idx = torch.argmax(probs, dim=1).item()
    predicted_emotion = ["admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion", "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness", "optimism", "pride", "realization", "relief", "remorse", "sadness", "surprise", "neutral"][predicted_label_idx]
    confidence_score = probs[0][predicted_label_idx].item()

    # Scale confidence score from (0-1) to (1-10)
    scaled_score = round(confidence_score * 10, 1)

    return {
        "text": text,
        "predicted_emotion": predicted_emotion,
        "score": scaled_score
    }

