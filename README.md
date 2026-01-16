**PawSense – AI Powered Pet Monitoring & Safety System**

PawSense is an AI-powered monitoring system designed to analyze pet behavior and emotions in real time.
It uses deep learning models to detect emotions and health issues through images and audio provides safety alerts through an interactive web dashboard.
The system also helps pet owners locate nearby veterinary services using map integration.

📌 Features
Real-time pet emotion detection using deep learning

AI models: CNN, LSTM, MFCC, MobileNetV2

Interactive web dashboard built with React.js

Live alerts and activity logging system

Nearby veterinary suggestions using Google Maps API

Multi-species support (dogs, cats, cows)

Secure backend with Flask/FastAPI

Cloud database integration using Supabase

🛠 Tech Stack
**Frontend**

React.js

HTML5, Tailwind Css JavaScript

**Backend**

Flask

FastAPI

**AI / Machine Learning**

CNN

LSTM

MFCC feature extraction

MobileNetV2

**Database**

Supabase (PostgreSQL)

**APIs & Tools**

Google Maps API

Git & GitHub

Google Maps API

📂 Project Structure
PawSense/
│
├── frontend/        # React dashboard
├── backend/         # Flask / FastAPI backend
├── ml-models/       # Trained models
├── notebooks/       # Google Colab notebooks
├── screenshots/     # UI images
├── requirements.txt
└── README.md


⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/yourusername/PawSense-AI-Monitoring-System.git
cd PawSense-AI-Monitoring-System

2. Backend Setup
cd backend
pip install -r requirements.txt
python app.py

3. Frontend Setup
cd frontend
npm install
npm start

🗄 Supabase Setup

Create project at: https://supabase.com

Copy:

Project URL

API Key

Create .env file

SUPABASE_URL=your_project_url
SUPABASE_KEY=your_api_key


Create tables:

users

pet_data

alerts

activity_logs

🧪 Model Training

Model training done using Google Colab

MFCC used for feature extraction

Accuracy & loss evaluated

Training notebooks available in /notebooks


🎯 Use Cases

Monitor pet emotional states

Detect abnormal behavior

Send emergency alerts

Find nearby veterinary services

Maintain pet activity history


🔮Future Enhancements

Mobile app integration

Push notifications

Cloud deployment (AWS / Vercel)

Improve model accuracy

Add more animal categories

