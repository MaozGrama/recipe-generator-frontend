

#### README - Frontend (English)

```markdown
# Recipe Generator Frontend

This is the frontend for the Recipe Generator application, built with React and Vite. It provides a user interface for authentication, recipe browsing, favorites, ratings, and deals.

## Overview
- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite
- **Deployment**: Vercel
- **API Integration**: Connects to `https://recipe-generator-backend-five.vercel.app/api`

## Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Vercel CLI (for deployment)

## Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/recipe_generator.git
   cd recipe_generator/frontend

Install Dependencies
bashnpm install

Configure Environment Variables

Create a .env file in the root directory with the following:
textVITE_API_URL=http://localhost:5000

Update VITE_API_URL to https://recipe-generator-backend-five.vercel.app for production.


Run Locally
bashnpm run dev

The app will run on http://localhost:5173.



Deployment

Install Vercel CLI
bashnpm install -g vercel

Deploy to Vercel
bash vercel --prod

Set VITE_API_URL in the Vercel dashboard under "Settings" > "Environment Variables".



Usage

Login: Navigate to /login and use user@example.com with pass123 (or register a new user).
Features: Browse recipes, add to favorites, rate recipes, and view deals.
CORS: Configured to work with the backend’s CORS settings.

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

License
MIT License - See LICENSE file for details.
Contact
For issues, contact the project maintainers via the GitHub issues page.
text#### קובץ README - Frontend (עברית)

```markdown
# ממשק משתמש של מחולל מתכונים

זהו ממשק המשתמש של יישום מחולל המתכונים, שבנוי עם React ו-Vite. הוא מספק ממשק משתמש לאימות, גלישה במתכונים, מועדפים, דירוגים ועסקאות.

## סקירה
- **שפה**: TypeScript
- **מסגרת**: React
- **כלי בנייה**: Vite
- **פריסה**: Vercel
- **שילוב API**: מתחבר ל-`https://recipe-generator-backend-five.vercel.app/api`

## דרישות מוקדמות
- Node.js (גרסה 18 או חדשה יותר)
- npm או yarn
- כלי שורת הפקודה של Vercel (לפריסה)

## התקנה
1. **שכפול המאגר**
   ```bash
   git clone https://github.com/your-username/recipe_generator.git
   cd recipe_generator/frontend

התקנת תלויות
bash npm install

הגדרת משתני סביבה

צור קובץ .env בשרשור התיקייה עם התוכן הבא:
VITE_API_URL=http://localhost:5000

עדכן את VITE_API_URL ל-https://recipe-generator-backend-five.vercel.app עבור ייצור.


הרצה מקומית
bash npm run dev

האפליקציה תרוץ ב-http://localhost:5173.



פריסה

התקנת כלי שורת הפקודה של Vercel
bash npm install -g vercel

פריסה ל-Vercel
bash vercel --prod

הגדר את VITE_API_URL בלוח הבקרה של Vercel תחת "הגדרות" > "משתני סביבה".



שימוש

התחברות: עבור ל-/login והשתמש ב-test@gmail.com עם pass123 (או הרשם כמשתמש חדש).
תכונות: גלוש במתכונים, הוסף למועדפים, דרג מתכונים וצפה בעסקאות.
CORS: מוגדר לעבודה עם הגדרות CORS של השרת האחורי.



צור ענף חדש במאגר.
צור ענף תכונה (git checkout -b feature-name).
בצע שינויים ורשום אותם (git commit -m "הוספת תכונה").
דחוף את הענף (git push origin feature-name).
פתח בקשת משיכה.

רישיון
רישיון MIT - ראה קובץ LICENSE לפרטים.
יצירת קשר

לבעיות, צור קשר עם אנשי התמיכה של הפרויקט דרך דף הבעיות ב-GitHub.
