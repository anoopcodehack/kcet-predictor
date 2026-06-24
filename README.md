# 🎓 KCET College Predictor

AI-powered KCET College & Branch Prediction Platform built using React, Node.js, Express, and MongoDB.

## 📌 Overview

KCET College Predictor helps Karnataka students estimate their chances of admission into Engineering colleges based on:

* KCET Rank
* Category
* Branch Preference
* Previous Year KEA Cutoffs

The platform analyzes historical cutoff data and generates:

* 🎯 Dream Colleges
* 🚀 Target Colleges
* ✅ Safe Colleges

along with branch recommendations and cutoff trends.

---

## ✨ Features

### 🔍 College Prediction

Predict eligible colleges based on:

* KCET Rank
* Category
* Preferred Branch

### 🎯 Dream / Target / Safe Classification

Results are intelligently classified into:

* Dream
* Target
* Safe

to simplify counselling decisions.

### 📈 Cutoff Trend Analysis

View previous years' cutoff trends for:

* CSE
* ISE
* AIML
* ECE
* EEE
* Mechanical

and other branches.

### 🏫 College Explorer

Search and compare colleges:

* RVCE
* PES University
* BMSCE
* MSRIT
* DSCE
* NIE

and more.

### 📊 Branch Recommendations

Get the best branch options available for your rank.

### ⚡ Fast Search & Filtering

Filter by:

* Category
* Branch
* Location
* College Type

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Data Source

* Karnataka Examinations Authority (KEA)
* Historical KCET Cutoff Data

---

## 📂 Project Structure

```bash
kcet-predictor/
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── scripts/
│   └── server.js
│
├── data/
│   ├── 2023.csv
│   ├── 2024.csv
│   └── 2025.csv
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/kcet-college-predictor.git

cd kcet-college-predictor
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string
# MONGO_URI is also supported as an alias for compatibility

JWT_SECRET=your_secret_key
```

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
cd client

npm run dev
```

---

## 🧠 Prediction Logic

The system compares the user's rank against previous-year closing ranks.

```text
Closing Rank >= User Rank
```

Classification:

```text
Dream  → Rank Difference < 1000

Target → Rank Difference < 5000

Safe   → Rank Difference > 5000
```

---

## 📊 Sample Output

```text
Rank: 8500
Category: GM
Branch: CSE
```

### Dream

* BMSCE CSE
* PES ISE

### Target

* MSRIT AIML
* DSCE CSE

### Safe

* NIE CSE
* SJCE ISE

---

## 🚀 Future Enhancements

* AI-Based Option Entry Optimizer
* Personalized Counselling Recommendations
* Seat Matrix Analysis
* College Placement Insights
* Branch Demand Forecasting
* Multi-Year Rank Prediction

---

## 🤝 Contributing

Contributions are welcome.

Fork the repository and submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Anoop A

Built to simplify KCET counselling and help students make better admission decisions.
