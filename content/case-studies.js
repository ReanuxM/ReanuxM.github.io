// Case-study content — restructured only from facts already stated on the
// site (see content/other-projects.js history / original FEATURED_PROJECTS).
// No invented metrics, dates, or outcomes.

module.exports = [
  {
    slug: 'nlp-text-classification',
    name: 'NLP Text Classification System',
    gradProject: true,
    tagline: 'Multi-class text classification with BERT + LSTM, deployed as a real-time Flask API.',
    problem: "Manually sorting large volumes of text — support tickets, documents, reviews — doesn't scale. Teams need automated classification that's both accurate and fast enough to run in production.",
    approach: 'Designed and trained a deep learning NLP pipeline combining BERT and LSTM architectures for multi-class text classification, then wrapped the trained model in a production-ready Flask REST API for real-time inference.',
    results: [
      '96% accuracy on the test set',
      'Real-time inference via a deployed Flask REST API',
    ],
    stack: ['BERT', 'LSTM', 'Flask API', 'NLP'],
  },
  {
    slug: 'customer-churn-prediction',
    name: 'Customer Churn Prediction',
    gradProject: false,
    tagline: 'End-to-end churn prediction pipeline with ensemble models and class-imbalance handling.',
    problem: "Losing customers is expensive, and by the time churn is obvious it's often too late to act. Predicting who's at risk early gives a business room to intervene.",
    approach: 'Built an end-to-end ML pipeline using ensemble methods (Random Forest, XGBoost), ran feature importance analysis to surface the strongest churn signals, applied SMOTE to correct for class imbalance, and tuned hyperparameters with GridSearchCV.',
    results: [
      'Ensemble comparison across Random Forest and XGBoost',
      'Class imbalance corrected via SMOTE before training',
      'Hyperparameters tuned systematically with GridSearchCV',
    ],
    stack: ['XGBoost', 'Random Forest', 'SMOTE', 'GridSearchCV'],
  },
  {
    slug: 'image-classification-cnn',
    name: 'Image Classification with CNN',
    gradProject: false,
    tagline: 'Custom CNN architecture for image classification, trained with data augmentation.',
    problem: "Manually reviewing and tagging large image datasets doesn't scale. An automated classifier needs to generalize beyond its training set, not just memorize it.",
    approach: 'Designed a custom Convolutional Neural Network with convolutional, pooling, and dropout layers in TensorFlow/Keras, and trained it with data augmentation to improve generalization.',
    results: [
      'Achieved strong generalization on unseen data',
    ],
    stack: ['TensorFlow', 'CNN', 'Keras'],
  },
  {
    slug: 'sentiment-analysis-system',
    name: 'Sentiment Analysis System',
    gradProject: false,
    tagline: 'Sentiment classifier for customer reviews, benchmarking three supervised models.',
    problem: 'Customer reviews carry signal that is expensive to read one by one. Teams need an automated way to gauge sentiment at volume.',
    approach: 'Built an NLP preprocessing pipeline (tokenization, TF-IDF, stemming) and trained supervised models, benchmarking Naive Bayes, SVM, and Logistic Regression against each other with comprehensive evaluation metrics.',
    results: [
      'Compared Naive Bayes, SVM, and Logistic Regression head-to-head',
      'Evaluated with a full metrics suite rather than accuracy alone',
    ],
    stack: ['NLP', 'Scikit-learn', 'TF-IDF', 'SVM'],
  },
  {
    slug: 'recommendation-engine',
    name: 'Recommendation Engine',
    gradProject: false,
    tagline: 'Collaborative filtering recommender combining content-based and hybrid approaches.',
    problem: 'Users facing too many choices need relevant items surfaced automatically, not buried in an unfiltered catalog.',
    approach: 'Built a collaborative filtering recommendation system using matrix factorization and cosine similarity, then extended it with content-based and hybrid approaches for more personalized recommendations.',
    results: [
      'Delivered both collaborative-filtering and hybrid recommendation approaches',
    ],
    stack: ['Python', 'NumPy', 'Collaborative Filtering'],
  },
  {
    slug: 'credit-card-fraud-detection',
    name: 'Credit Card Fraud Detection',
    gradProject: false,
    tagline: 'Fraud detection on a highly imbalanced dataset, benchmarking an SVM against a Decision Tree with ROC-AUC.',
    problem: "Fraud is rare — often well under 1% of transactions — so a model that labels everything \"legitimate\" still scores high accuracy while catching zero fraud. Detecting the rare positive class needs imbalance-aware training and a metric that the majority class can't game.",
    approach: 'Built a full pipeline on PCA-anonymized transaction features: standardized and L1-normalized the inputs, corrected the class imbalance with per-sample weights (compute_sample_weight) instead of naive resampling, and trained a DecisionTreeClassifier and a LinearSVC head-to-head. Evaluated on ROC-AUC rather than accuracy, then studied how keeping only the most correlated features shifts each model differently.',
    results: [
      'Benchmarked Decision Tree vs LinearSVC on ROC-AUC — the metric that stays honest under extreme class imbalance',
      'Handled imbalance with sample weighting rather than resampling',
      'Quantified how top-correlated-feature selection changes each model',
    ],
    stack: ['SVM', 'Decision Tree', 'ROC-AUC', 'Imbalanced Data', 'Scikit-learn'],
    repoUrl: 'https://github.com/ReanuxM/Machine-Learning-with-Python/blob/main/Machine%20Learning%20with%20Python/Lab7_SVM/Credit_Card_Fraud_SVM_vs_DecisionTree.ipynb',
  },
];
