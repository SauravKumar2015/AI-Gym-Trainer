# AI Gym Trainer - API Testing Guide

**Base URL:** `http://localhost:8080`

---

## 1. HEALTH & STATUS ENDPOINTS

### 1.1 Health Status

**URL:** `GET /api/health/status`  
**Authorization:** None  
**Body:** None

**Response:**

```json
{
  "database": "CONNECTED",
  "message": "Application and database are running successfully",
  "status": "UP",
  "timestamp": "2026-03-07 10:14:03"
}
```

### 1.2 Database Health

**URL:** `GET /api/health/database`  
**Authorization:** None  
**Body:** None

**Response:**

```json
{
  "connection_type": "MongoDB",
  "database_status": "✓ CONNECTED",
  "health": "HEALTHY",
  "timestamp": "2026-03-07 10:14:34"
}
```

---

## 2. AUTHENTICATION ENDPOINTS

### 2.1 Register User

**URL:** `POST /api/auth/register`  
**Authorization:** None  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "name": "vishal kumar",
  "email": "vishal@gmail.com",
  "password": "vishal123",
  "phone": "7970973532",
  "age": "21",
  "gender": "Male",
  "height": 5.5,
  "weight": 51,
  "fitnessGoal": "Muscle Gain",
  "experienceLevel": "Beginner"
}
```

**Response:**

```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2.2 Login User

**URL:** `POST /api/auth/login`  
**Authorization:** None  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "email": "saurav@gmail.com",
  "password": "saurav12345"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzYXVyYXZAZ21haWwuY29tIiwiaWF0IjoxNzcyODU4ODEyLCJleHAiOjE3NzI4OTQ4MTJ9.9mWZl0JrRRSIeL4iV7ewu57qv4Jl5i9OaNKKXETe3Zx7rnU_CYAdzrp66V1mBhWr"
}
```

---

## 3. USER ENDPOINTS

### 3.1 Get User Profile

**URL:** `GET /api/users/profile`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
{
  "id": "69abae927d9a13059bfdf36b",
  "email": "saurav@gmail.com",
  "password": "$2a$10$s7Gc/8Z5KikT/v9GZn3VVOlJe.8hbGAUoQLztG6IqvOJQmUa.5f/q",
  "phone": "7970973532",
  "age": 21,
  "gender": "Male",
  "height": 5.5,
  "weight": 51.0,
  "fitnessGoal": "Muscle Gain",
  "experienceLevel": "Beginner",
  "role": "user",
  "createdAt": "2026-03-07T10:20:26.186",
  "resetToken": null,
  "resetTokenExpiry": null,
  "dietPlans": [],
  "exercisePlans": [],
  "meals": [],
  "workoutPlans": [],
  "progressTracking": [],
  "workoutLogs": [],
  "aiRecommendations": [],
  "name": "saurav kumar"
}
```

### 3.2 Update User Profile

**URL:** `PUT /api/users/update`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "name": "anupama",
  "email": "anupama@example.com",
  "phone": "9876543210",
  "age": 28,
  "gender": "Male",
  "height": 5.9,
  "weight": 76.0,
  "fitnessGoal": "Muscle Gain",
  "experienceLevel": "Intermediate"
}
```

**Response:**

```json
{
  "message": "Email updated. Use the returned token for subsequent requests.",
  "user": {
    "id": "69abae927d9a13059bfdf36b",
    "email": "anupama@example.com",
    "password": "$2a$10$tLGF94/5cNLvx4Nu1Qb.VeyUESIKNaA3gWQUyP722Da3qnvbouoE6",
    "phone": "9876543210",
    "age": 28,
    "gender": "Male",
    "height": 5.9,
    "weight": 76.0,
    "fitnessGoal": "Muscle Gain",
    "experienceLevel": "Intermediate",
    "role": "user",
    "createdAt": "2026-03-07T10:20:26.186",
    "resetToken": null,
    "resetTokenExpiry": null,
    "dietPlans": [],
    "exercisePlans": [],
    "meals": [],
    "workoutPlans": [],
    "progressTracking": [],
    "workoutLogs": [],
    "aiRecommendations": [],
    "name": "anupama"
  },
  "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhbnVwYW1hQGV4YW1wbGUuY29tIiwiaWF0IjoxNzcyODU5NTM4LCJleHAiOjE3NzI4OTU1Mzh9.8aRxRMv2RUzB_F2AXART4ra3BuigJErD1PUIFcHiZ2pR0mS92hDrXDynaQkS68bE"
}
```

### 3.3 Change Password

**URL:** `POST /api/users/change-password`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "oldPassword": "vishal",
  "newPassword": "hemant123"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

### 3.4 Delete User

**URL:** `DELETE /api/users/delete`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

### 3.5 Notes about changing email

When updating the user's `email` via `PUT /api/users/update`, the backend will persist the new email, however the JWT your client already holds was issued earlier and still contains the old email. After changing `email` you MUST re-authenticate (call `POST /api/auth/login`) to receive a new token that contains the updated email — otherwise subsequent authenticated requests will continue to be authorized against the email embedded in the original token.

### 3.6 Forgot Password

**URL:** `POST /api/users/forgot-password`  
**Authorization:** None  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "email": "saurav@gmail.com"
}
```

**Response (testing):**

```json
{
  Reset token generated: a69e534a-9aef-4ac7-82ff-7ce450a52b18
}
```

Note: In production the reset token should be emailed to the user. The current implementation returns the token for testing only.

### 3.7 Reset Password

**URL:** `POST /api/users/reset-password`  
**Authorization:** None  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "token": "a69e534a-9aef-4ac7-82ff-7ce450a52b18",
  "newPassword": "vishal"
}
```

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

---

## 4. DIET ENDPOINTS

### 4.1 Get All Diet Plans

**URL:** `GET /api/diets`  
**Authorization:** Bearer Token (Required)  
**Body:** None

> Note: This endpoint returns only diet plans created by the currently authenticated user.

**Response:**

```json
[
  {
    "id": "699abbb9ee6b0f5b2ac68844",
    "title": "High Calorie Weight Loss",
    "goal": "Gain loss",
    "dailyCalories": 2200,
    "dietType": "veg",
    "description": "Vegetarian diet for weight Gain",
    "createdBy": "69993090373536304e91f673"
  },
  {
    "id": "699abbbfee6b0f5b2ac68845",
    "title": "High Calorie Weight Loss",
    "goal": "Gain loss",
    "dailyCalories": 2200,
    "dietType": "veg",
    "description": "Vegetarian diet for weight Gain",
    "createdBy": "69993090373536304e91f673"
  }
]
```

### 4.2 Get Diet Plan by ID

**URL:** `GET localhost:8080/api/diets/69abb2d07d9a13059bfdf36d`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
{
  "id": "69abb2d07d9a13059bfdf36d",
  "title": "low Calorie Weight gain",
  "goal": "Gain weight",
  "dailyCalories": 2200,
  "dietType": "non-veg",
  "description": "non-Vegetarian diet for weight Gain",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 4.3 Create Diet Plan

**URL:** `POST /api/diets`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "title": "low Calorie Weight gain",
  "goal": "Gain weight",
  "dailyCalories": 2200,
  "dietType": "non-veg",
  "description": "non-Vegetarian diet for weight Gain"
}
```

**Response:**

```json
{
  "id": "69abb3197d9a13059bfdf36e",
  "title": "low Calorie Weight gain",
  "goal": "Gain weight",
  "dailyCalories": 2200,
  "dietType": "non-veg",
  "description": "non-Vegetarian diet for weight Gain",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 4.4 Delete Diet Plan

**URL:** `DELETE /api/diets/{id}`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
"Diet deleted successfully"
```

---

## 5. EXERCISE ENDPOINTS

### 5.1 Get All Exercises

**URL:** `GET /api/exercises`  
**Authorization:** Bearer Token (Required)  
**Body:** None

> Note: This endpoint returns only exercises created by the currently authenticated user.

**Response:**

```json
{
  "id": "69abb41d7d9a13059bfdf36f",
  "name": "vishal",
  "muscleGroup": "chest",
  "equipment": "Barbell",
  "difficulty": "Beginner",
  "videoUrl": "https://example.com/squat.mp4",
  "instructions": "Stand with feet shoulder-width apart, lower body...",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 5.2 Create Exercise

**URL:** `POST /api/exercises`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "name": "vishal",
  "muscleGroup": "chest",
  "equipment": "Barbell",
  "difficulty": "Beginner",
  "videoUrl": "https://example.com/squat.mp4",
  "instructions": "Stand with feet shoulder-width apart, lower body..."
}
```

**Response:**

```json
{
  "id": "69abb41d7d9a13059bfdf36f",
  "name": "vishal",
  "muscleGroup": "chest",
  "equipment": "Barbell",
  "difficulty": "Beginner",
  "videoUrl": "https://example.com/squat.mp4",
  "instructions": "Stand with feet shoulder-width apart, lower body...",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 5.3 Delete Exercise

**URL:** `DELETE /api/exercises/{id}`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
"Exercise deleted successfully"
```

---

## 6. MEAL ENDPOINTS

### 6.1 Get All Meals

**URL:** `GET /api/meals`  
**Authorization:** Bearer Token (Required)  
**Body:** None

> Note: This endpoint returns only meals created by the currently authenticated user.

**Response:**

```json
[
  {
    "id": "69abb4997d9a13059bfdf370",
    "name": "soya curry",
    "mealType": "veg",
    "calories": 5000,
    "protein": 12.0,
    "carbs": 230.0,
    "fats": 0.9,
    "createdBy": "69abb1e27d9a13059bfdf36c"
  }
]
```

### 6.2 Create Meal

**URL:** `POST /api/meals`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "name": "soya curry",
  "mealType": "veg",
  "calories": 5000,
  "protein": 12,
  "carbs": 230,
  "fats": 0.9,
  "type": "carbs"
}
```

**Response:**

```json
{
  "id": "69abb4997d9a13059bfdf370",
  "name": "soya curry",
  "mealType": "veg",
  "calories": 5000,
  "protein": 12.0,
  "carbs": 230.0,
  "fats": 0.9,
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 6.3 Delete Meal

**URL:** `DELETE /api/meals/{id}`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
"Meal deleted successfully"
```

---

## 7. WORKOUT ENDPOINTS

### 7.1 Get All Workouts

**URL:** `GET /api/workouts`  
**Authorization:** Bearer Token (Required)  
**Body:** None

> Note: This endpoint returns only workouts created by the currently authenticated user.

**Response:**

```json
[
  {
    "id": "69abb88c7d9a13059bfdf371",
    "title": "full body checkup",
    "goal": "relese strain",
    "difficulty": "Advanced",
    "durationWeeks": 8,
    "description": null,
    "createdBy": "69abb1e27d9a13059bfdf36c"
  },
  {
    "id": "69abb8e07d9a13059bfdf372",
    "title": "full body checkup",
    "goal": "relese strain",
    "difficulty": "Advanced",
    "durationWeeks": 8,
    "description": "To gaim Muscle you need to eat more healty foods",
    "createdBy": "69abb1e27d9a13059bfdf36c"
  }
]
```

### 7.2 Get Workout by ID

**URL:** `GET localhost:8080/api/workouts/69abb8e07d9a13059bfdf372`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
{
  "id": "69abb8e07d9a13059bfdf372",
  "title": "full body checkup",
  "goal": "relese strain",
  "difficulty": "Advanced",
  "durationWeeks": 8,
  "description": "To gaim Muscle you need to eat more healty foods",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 7.3 Create Workout

**URL:** `POST /api/workouts`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "title": "full body checkup",
  "goal": "relese strain",
  "durationWeeks": 8,
  "difficulty": "Advanced",
  "description": "To gaim Muscle you need to eat more healty foods",
  "exercises": ["Squat", "Deadlift", "Bench Press", "Rows"]
}
```

**Response:**

```json
{
  "id": "69abb8e07d9a13059bfdf372",
  "title": "full body checkup",
  "goal": "relese strain",
  "difficulty": "Advanced",
  "durationWeeks": 8,
  "description": "To gaim Muscle you need to eat more healty foods",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 7.4 Delete Workout

**URL:** `DELETE /api/workouts/{id}`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
"Workout deleted successfully"
```

---

## 8. PROGRESS TRACKING ENDPOINTS

### 8.1 Log Progress

**URL:** `POST /api/progress/log`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "userId": "6999230d1897244abc5d7308",
  "weight": 75.5,
  "bodyFatPercentage": 18.5,
  "muscleGain": 2.5,
  "notes": "Good progress this week"
}
```

**Response:**

```json
{
  "id": "69abb9f37d9a13059bfdf373",
  "userId": "6999230d1897244abc5d7308",
  "weight": 75.5,
  "bodyFatPercentage": 18.5,
  "recordDate": "2026-03-07",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 8.2 Get Progress History

**URL:** `GET /api/progress/history?userId=65a1b2c3d4e5f6g7h8i9j0k1`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
{
  "id": "69abb9f37d9a13059bfdf373",
  "userId": "6999230d1897244abc5d7308",
  "weight": 75.5,
  "bodyFatPercentage": 18.5,
  "recordDate": "2026-03-07",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

---

## 9. WORKOUT LOG ENDPOINTS

### 9.1 Add Workout Log

**URL:** `POST /api/workout-log/add`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "userId": "6999230d1897244abc5d7308",
  "exerciseId": "699bd24cb9f3452119aaed43",
  "exerciseName": "Bench Press",
  "sets": 4,
  "reps": 8,
  "weightUsed": 100,
  "duration": 30,
  "notes": "Felt strong today"
}
```

**Response:**

```json
{
  "id": "69abbad57d9a13059bfdf374",
  "userId": "69abb1e27d9a13059bfdf36c",
  "exerciseId": "699bd24cb9f3452119aaed43",
  "sets": 4,
  "reps": 8,
  "weightUsed": 100.0,
  "workoutDate": "2026-03-07",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 9.2 Get User Workout Logs

**URL:** `GET /api/workout-log/user/{userId}`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
[
  {
    "id": "69abbad57d9a13059bfdf374",
    "userId": "69abb1e27d9a13059bfdf36c",
    "exerciseId": "699bd24cb9f3452119aaed43",
    "sets": 4,
    "reps": 8,
    "weightUsed": 100.0,
    "workoutDate": "2026-03-07",
    "createdBy": "69abb1e27d9a13059bfdf36c"
  }
]
```

---

## 11. AI ENDPOINTS

### 11.1 Generate Workout

**URL:** `POST /api/ai/generate-workout`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Response:**

```json
{
  "id": "69ae66d44dda6f473aac9610",
  "title": "Beginner Muscle Gain Workout Plan",
  "goal": "Muscle Gain",
  "difficulty": "Beginner",
  "durationWeeks": 8,
  "description": "Given the user's profile, this 8-week workout plan focuses on gradual weight gain and muscle development, considering the user's high BMI and low TDEE. The plan will include 3-4 sets of 8-12 reps for each exercise, with a caloric surplus of 250-500 calories above the TDEE to support muscle growth. The workout routine will be divided into 4 days: Chest and Triceps, Back and Biceps, Legs, and Shoulders and Abs, with at least one day of rest in between. Progressive overload and proper nutrition will be emphasized throughout the plan to ensure safe and effective muscle gain.",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 11.2 Generate Diet

**URL:** `POST /api/ai/generate-diet`  
**Authorization:** Bearer Token (Required)  
**Content-Type:** `application/json`

**Response:**

```json
{
  "id": "69ae67024dda6f473aac9612",
  "title": "Muscle Gain Diet Plan for Beginners",
  "goal": "Muscle Gain",
  "dailyCalories": 911,
  "dietType": "High Protein",
  "description": "A calorie-controlled diet with a balance of protein, carbohydrates, and healthy fats to support muscle growth and development, with a daily caloric intake of 911 kcal to promote muscle gain in a beginner male",
  "createdBy": "69abb1e27d9a13059bfdf36c"
}
```

### 11.3 Get Recommendations

**URL:** `GET /api/ai/recommendations/{userId}`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
[
  {
    "id": "69ae66d44dda6f473aac9611",
    "userId": "69abb1e27d9a13059bfdf36c",
    "workoutSuggestion": "Follow a 8-week Muscle Gain workout plan titled 'Beginner Muscle Gain Workout Plan' at Beginner difficulty level.",
    "dietSuggestion": null,
    "generatedAt": "2026-03-09T11:51:08.732",
    "recommendationType": "WORKOUT",
    "referenceId": "69ae66d44dda6f473aac9610",
    "createdDate": "2026-03-09T11:51:08.732",
    "content": "Generated a 8-week Muscle Gain workout plan titled 'Beginner Muscle Gain Workout Plan' with Beginner difficulty."
  },
  {
    "id": "69ae67024dda6f473aac9613",
    "userId": "69abb1e27d9a13059bfdf36c",
    "workoutSuggestion": null,
    "dietSuggestion": "Follow a High Protein diet plan titled 'Muscle Gain Diet Plan for Beginners' targeting Muscle Gain with 911 daily calories.",
    "generatedAt": "2026-03-09T11:51:54.848",
    "recommendationType": "DIET",
    "referenceId": "69ae67024dda6f473aac9612",
    "createdDate": "2026-03-09T11:51:54.848",
    "content": "Generated a High Protein diet plan titled 'Muscle Gain Diet Plan for Beginners' targeting Muscle Gain with 911 daily calories."
  }
]
```

#### 11.4 Test Health Metrices

**URL:** `GET http://localhost:8080/api/ai/health-metrics`  
**Authorization:** Bearer Token (Required)  
**Body:** None

**Response:**

```json
{
  "bmiCategory": "Obese",
  "targetCaloriesMaintain": 611,
  "bmi": 16859.5,
  "tdee": 611,
  "targetCaloriesGain": 911,
  "targetCaloriesLoss": 111,
  "bmr": 444
}
```
