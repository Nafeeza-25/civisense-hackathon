"""
Civisense Model Training Script
Trains TF-IDF + Logistic Regression classifier for complaint categorization
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import json
from datetime import datetime

class CivisenseModel:
    """
    Civisense ML Model for complaint classification
    Uses TF-IDF for feature extraction and Logistic Regression for classification
    """
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=500,
            ngram_range=(1, 2),  # Unigrams and bigrams
            min_df=2,
            stop_words='english',
            lowercase=True
        )
        
        self.classifier = LogisticRegression(
            max_iter=1000,
            solver='lbfgs',
            random_state=42,
            C=1.0
        )

        
        self.categories = None
        self.feature_names = None
        
    def train(self, X_train, y_train):
        """Train the model"""
        print("Training TF-IDF vectorizer...")
        X_train_tfidf = self.vectorizer.fit_transform(X_train)
        self.feature_names = self.vectorizer.get_feature_names_out()
        
        print(f"Feature space: {X_train_tfidf.shape[1]} features")
        
        print("\nTraining Logistic Regression classifier...")
        self.classifier.fit(X_train_tfidf, y_train)
        
        self.categories = self.classifier.classes_
        print(f"Categories: {', '.join(self.categories)}")
        
    def predict(self, X):
        """Predict categories for new complaints"""
        X_tfidf = self.vectorizer.transform(X)
        predictions = self.classifier.predict(X_tfidf)
        probabilities = self.classifier.predict_proba(X_tfidf)
        return predictions, probabilities
    
    def get_top_features_per_category(self, n=10):
        """Get top N features for each category"""
        feature_importance = {}
        
        for idx, category in enumerate(self.categories):
            # Get coefficients for this category
            coef = self.classifier.coef_[idx]
            
            # Get top positive coefficients (most indicative)
            top_indices = np.argsort(coef)[-n:][::-1]
            top_features = [(self.feature_names[i], coef[i]) for i in top_indices]
            
            feature_importance[category] = top_features
            
        return feature_importance
    
    def save(self, model_path='model.joblib', metadata_path='model_metadata.json'):
        """Save model and metadata"""
        # Save model components
        model_data = {
            'vectorizer': self.vectorizer,
            'classifier': self.classifier,
            'categories': self.categories.tolist() if self.categories is not None else None,
            'feature_names': self.feature_names.tolist() if self.feature_names is not None else None
        }
        joblib.dump(model_data, model_path)
        
        # Save metadata
        metadata = {
            'trained_at': datetime.now().isoformat(),
            'categories': self.categories.tolist() if self.categories is not None else None,
            'num_features': len(self.feature_names) if self.feature_names is not None else 0,
            'model_type': 'TF-IDF + Logistic Regression'
        }
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\nModel saved to {model_path}")
        print(f"Metadata saved to {metadata_path}")
    
    @classmethod
    def load(cls, model_path='model.joblib'):
        """Load trained model"""
        model_data = joblib.load(model_path)
        
        model = cls()
        model.vectorizer = model_data['vectorizer']
        model.classifier = model_data['classifier']
        model.categories = np.array(model_data['categories'])
        model.feature_names = np.array(model_data['feature_names'])
        
        return model


def train_model(data_path='training_data.csv', test_size=0.2, random_state=42):
    """
    Complete training pipeline
    """
    print("="*60)
    print("CIVISENSE MODEL TRAINING")
    print("="*60)
    
    # Load data
    print(f"\nLoading training data from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} samples")
    
    # Display data info
    print("\nCategory distribution:")
    print(df['category'].value_counts())
    
    # Prepare features and labels
    X = df['complaint_text'].values
    y = df['category'].values
    
    # Split data
    print(f"\nSplitting data (test_size={test_size})...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")
    
    # Train model
    print("\n" + "="*60)
    model = CivisenseModel()
    model.train(X_train, y_train)
    
    # Evaluate on training set
    print("\n" + "="*60)
    print("TRAINING SET PERFORMANCE")
    print("="*60)
    train_predictions, train_probs = model.predict(X_train)
    train_accuracy = accuracy_score(y_train, train_predictions)
    print(f"Training Accuracy: {train_accuracy:.4f}")
    
    # Evaluate on test set
    print("\n" + "="*60)
    print("TEST SET PERFORMANCE")
    print("="*60)
    test_predictions, test_probs = model.predict(X_test)
    test_accuracy = accuracy_score(y_test, test_predictions)
    print(f"Test Accuracy: {test_accuracy:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, test_predictions))
    
    print("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, test_predictions, labels=model.categories)
    print(pd.DataFrame(cm, index=model.categories, columns=model.categories))
    
    # Show top features per category
    print("\n" + "="*60)
    print("TOP FEATURES PER CATEGORY")
    print("="*60)
    feature_importance = model.get_top_features_per_category(n=8)
    for category, features in feature_importance.items():
        print(f"\n{category}:")
        for feature, score in features:
            print(f"  {feature:30s} {score:8.4f}")
    
    # Save model
    print("\n" + "="*60)
    model.save()
    
    # Show some example predictions
    print("\n" + "="*60)
    print("EXAMPLE PREDICTIONS")
    print("="*60)
    
    num_examples = min(5, len(X_test))
    for i in range(num_examples):
        complaint = X_test[i]
        true_category = y_test[i]
        pred_category = test_predictions[i]
        confidence = test_probs[i].max()
        
        status = "✓" if true_category == pred_category else "✗"
        print(f"\n{status} Example {i+1}:")
        print(f"  Complaint: {complaint[:80]}...")
        print(f"  True: {true_category:15s} | Predicted: {pred_category:15s} | Confidence: {confidence:.3f}")
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    
    return model


if __name__ == '__main__':
    model = train_model('training_data.csv')
