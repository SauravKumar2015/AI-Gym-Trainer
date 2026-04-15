# FitAI Pro — AI Gym Trainer & Diet Planner

A full-stack AI-powered fitness and nutrition platform.
Backend built with Java 17 + Spring Boot 3.5, frontend with React 18 + Vite,
database on MongoDB Atlas, and AI powered by Google Gemini and Groq.

---

## Repository Structure

```
AI-Gym-Trainer/
├── backend/                   # Spring Boot 3.5 REST API
├── frontend/                  # React + Vite single-file SPA
└── README.md
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SauravKumar2015/AI-Gym-Trainer.git
cd AI-Gym-Trainer
```

### 2. Run the Backend

```bash
cd backend
# Configure application.properties first (see Backend Configuration below)
mvn clean install
mvn spring-boot:run
```

Backend starts at → `http://localhost:8080`

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at → `http://localhost:5173`

---

# Backend

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.5 |
| Database | MongoDB Atlas (Cloud-hosted) |
| ORM | Spring Data MongoDB |
| Authentication | JWT (JSON Web Tokens) |
| Security | Spring Security 6 |
| AI Integration | Google Gemini API, Groq API |
| Build Tool | Maven |
| Utilities | Lombok |

## Prerequisites

- Java 17+
- Maven 3.8+
- MongoDB Atlas account with a cluster and connection URI ready

## Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# MongoDB Atlas
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/AiGymTrainer_db?retryWrites=true&w=majority

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# Google Gemini API
gemini.api.key=your_gemini_api_key

# Groq API
groq.api.key=your_groq_api_key
```

> Get your Atlas URI from **Atlas Dashboard → Database → Connect → Drivers**.  
> Whitelist your IP under **Atlas → Network Access** before connecting.

## Project Structure

```
backend/
│
├── src/
│   ├── main/
│   │   ├── java/com/iar/backend/
│   │   │
│   │   ├── Config/
│   │   │   ├── CorsConfig.java                   # CORS configuration
│   │   │   └── SecurityConfig.java               # Spring Security setup
│   │   │
│   │   ├── Controller/
│   │   │   ├── AuthController.java               # Register, login, password reset
│   │   │   ├── UserController.java               # Profile management
│   │   │   ├── WorkoutController.java            # Workout plans CRUD
│   │   │   ├── WorkoutLogController.java         # Workout session logs
│   │   │   ├── ExerciseController.java           # Exercise library
│   │   │   ├── DietController.java               # Diet plans CRUD
│   │   │   ├── MealController.java               # Meal logging
│   │   │   ├── ProgressController.java           # Progress tracking
│   │   │   ├── AIController.java                 # AI generation endpoints
│   │   │   ├── AdminController.java              # Admin-only operations
│   │   │   └── HealthController.java             # App & DB health check
│   │   │
│   │   ├── Dto/
│   │   │   ├── AuthRequest.java                  # Login request body
│   │   │   ├── AuthResponse.java                 # JWT response body
│   │   │   ├── RegisterRequest.java              # Registration body
│   │   │   ├── ChangePasswordRequest.java        # Change password body
│   │   │   ├── ForgotPasswordRequest.java        # Forgot password body
│   │   │   ├── ResetPasswordRequest.java         # Reset password body
│   │   │   ├── DietRequest.java                  # Diet plan creation body
│   │   │   └── WorkoutRequest.java               # Workout creation body
│   │   │
│   │   ├── Entity/
│   │   │   ├── UserEntity.java                   # User document
│   │   │   ├── WorkoutPlanEntity.java            # Workout plan document
│   │   │   ├── ExerciseEntity.java               # Exercise document
│   │   │   ├── UserWorkoutLogEntity.java         # Workout log document
│   │   │   ├── DietPlanEntity.java               # Diet plan document
│   │   │   ├── MealEntity.java                   # Meal log document
│   │   │   ├── ProgressTrackingEntity.java       # Progress entry document
│   │   │   └── AIRecommendationEntity.java       # Stored AI responses
│   │   │
│   │   ├── Repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── WorkoutPlanRepository.java
│   │   │   ├── ExerciseRepository.java
│   │   │   ├── UserWorkoutLogRepository.java
│   │   │   ├── DietPlanRepository.java
│   │   │   ├── MealRepository.java
│   │   │   ├── ProgressTrackingRepository.java
│   │   │   └── AIRecommendationRepository.java
│   │   │
│   │   ├── Service/
│   │   │   ├── AuthService.java                  # Auth business logic
│   │   │   ├── UserService.java                  # Profile business logic
│   │   │   ├── WorkoutService.java               # Workout plan logic
│   │   │   ├── WorkoutLogService.java            # Workout log logic
│   │   │   ├── ExerciseService.java              # Exercise library logic
│   │   │   ├── DietService.java                  # Diet plan logic
│   │   │   ├── MealService.java                  # Meal tracking logic
│   │   │   ├── ProgressService.java              # Progress logic
│   │   │   ├── AIService.java                    # AI provider orchestration
│   │   │   ├── GeminiService.java                # Google Gemini integration
│   │   │   └── GroqService.java                  # Groq API integration
│   │   │
│   │   ├── Jwt/
│   │   │   ├── JwtAuthenticationFilter.java      # JWT request filter
│   │   │   └── JwtService.java                   # Token generation & validation
│   │   │
│   │   ├── Health/
│   │   │   ├── ApplicationStartupCheck.java      # Startup health check
│   │   │   └── DatabaseHealthCheck.java          # MongoDB connectivity check
│   │   │
│   │   └── AiGymTrainerApplication.java          # Spring Boot entry point
│   │
│   └── resources/
│       └── application.properties
│
├── pom.xml
└── README.md
```

## Build for Production

```bash
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

# Frontend

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Hooks) |
| Build Tool | Vite |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | Tailwind CSS |
| Fonts | Google Fonts — Outfit |
| State Management | React `useState` / `useContext` |
| Routing | Custom in-app router (no React Router) |

## Prerequisites

- Node.js 18+
- npm

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx          # Fixed horizontal navbar, responsive
│   │   └── ui/
│   │       ├── GlassCard.jsx       # Glassmorphism card
│   │       ├── GradientBtn.jsx     # Gradient buttons (5 variants)
│   │       ├── InputField.jsx      # Styled input with icon support
│   │       ├── StatCard.jsx        # Metric stat cards
│   │       ├── ProgressBar.jsx     # Animated progress bars
│   │       ├── DifficultyBadge.jsx # Beginner / Intermediate / Advanced
│   │       ├── Spinner.jsx         # Loading spinner
│   │       ├── Toast.jsx           # Toast notifications
│   │       ├── ApiError.jsx        # API error state
│   │       ├── EmptyState.jsx      # Empty list state
│   │       └── LoadingSkeleton.jsx # Skeleton loaders
│   ├── context/
│   │   └── AuthContext.jsx         # JWT auth, session restore
│   ├── data/
│   │   └── mockData.js             # Demo data & option arrays
│   ├── hooks/
│   │   └── useToast.js             # Toast state hook
│   ├── pages/
│   │   ├── LandingPage.jsx         # Public landing page
│   │   ├── LoginPage.jsx           # Login form
│   │   ├── RegisterPage.jsx        # 2-step registration
│   │   ├── DashboardPage.jsx       # Main dashboard + AI generator
│   │   ├── WorkoutsPage.jsx        # Workout plans
│   │   ├── DietPage.jsx            # Diet plans
│   │   ├── ExercisesPage.jsx       # Exercise library
│   │   ├── MealsPage.jsx           # Meal tracker + macros
│   │   ├── ProgressPage.jsx        # Progress logging + chart
│   │   └── ProfilePage.jsx         # Profile edit + password
│   ├── router/
│   │   └── AppRouter.jsx           # Protected & guest routes
│   ├── services/
│   │   ├── api.js                  # Axios instance + JWT interceptor
│   │   ├── authService.js          # Auth API calls
│   │   ├── workoutService.js       # Workout & exercise APIs
│   │   └── dietService.js          # Diet, meals, progress, AI APIs
│   ├── utils/
│   │   └── helpers.js              # BMI, formatting utils
│   ├── App.jsx                     # Root component
│   ├── index.css                   # Global CSS (no Tailwind)
│   ├── main.jsx                    # Entry point
│   └── styles.js                   # Shared style tokens
├── .env                            # Environment variables
├── index.html
├── package.json
└── vite.config.js                  # Dev proxy → :8080
```

### What's Inside `main.jsx`

| Section | Description |
|---|---|
| `AuthContext` | Global auth state via React Context |
| `RouterContext` | In-app page navigation |
| Mock Data | Weight, calorie, workout, and diet datasets |
| `GlassCard` | Glassmorphism card component |
| `GradientBtn` | Gradient button — primary / green / danger variants |
| `StatCard` | Metric display card with trend indicator |
| `ProgressBar` | Animated progress bar with 4 color variants |
| `DifficultyBadge` | Beginner / Intermediate / Advanced pill badge |
| `Toast` | Auto-dismiss notification |
| `LoadingSkeleton` | Pulse skeleton loader |
| `Navbar` | Fixed responsive navbar with mobile hamburger menu |
| `LandingPage` | Public hero section, features, testimonials, CTA |
| `LoginPage` | Email/password login form |
| `RegisterPage` | 2-step registration — account info → body metrics |
| `DashboardPage` | Stats overview, calorie chart, workout & diet summary |
| `WorkoutsPage` | Filterable workout cards by muscle group & difficulty |
| `DietPage` | Meal plan tabs with macro progress bars |
| `ProgressPage` | Weight & calorie charts, BMI, streak, achievements |
| `ProfilePage` | Editable profile with BMI calculator & goal selector |
| `App` | Root — routing logic, auth handlers, page rendering |

## Pages & Navigation

| Route | Page | Auth Required |
|---|---|---|
| `home` | Landing Page | No |
| `login` | Login | No |
| `register` | Register | No |
| `dashboard` | Dashboard | Yes |
| `workouts` | Workout Plans | Yes |
| `diet` | Diet Plans | Yes |
| `progress` | Progress Tracking | Yes |
| `profile` | My Profile | Yes |

> Unauthenticated users accessing protected pages are automatically redirected to login.

## Build for Production

```bash
cd frontend
npm run build
# Output → frontend/dist/
```

---

# Features

- **Landing Page** — hero section, feature highlights, testimonials, and CTA
- **Two-Step Registration** — account info followed by body metrics (age, height, weight, gender, goal)
- **Dashboard** — weekly calorie bar chart, monthly goal radial chart, workout & diet summary
- **Workouts** — filterable by muscle group and difficulty, showing sets / reps / calories / duration
- **Diet Plans** — tabbed meal plans (breakfast, lunch, dinner, snacks) with macro progress bars
- **Progress Tracking** — weight trend chart, calorie line chart, BMI, streak counter, and achievement badges
- **Profile Editor** — inline editing with save/cancel, auto BMI calculation, and fitness goal selector
- **AI-Generated Plans** — personalized workout and diet plans via Google Gemini and Groq
- **JWT Authentication** — secure login with token-based session management
- **Responsive Design** — mobile hamburger menu with adaptive grid layouts

---

# API Reference

All protected endpoints require the following header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| POST | `/api/auth/forgot-password` | Send password reset link | No |
| POST | `/api/auth/reset-password` | Reset password via token | No |
| POST | `/api/users/change-password` | Change current password | Yes |

### User Profile

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/profile` | Get logged-in user profile | Yes |
| PUT | `/api/users/update` | Update profile info | Yes |

### Workouts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/workouts` | List all workout plans | Yes |
| POST | `/api/workouts` | Create a workout plan | Yes |
| GET | `/api/exercises` | List all exercises | Yes |
| POST | `/api/exercises` | Add a new exercise | Yes |

### Diet & Meals

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/diets` | List all diet plans | Yes |
| POST | `/api/diets` | Create a diet plan | Yes |
| GET | `/api/meals` | List logged meals | Yes |
| POST | `/api/meals` | Log a meal | Yes |

### Progress Tracking

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/progress/log` | Log a progress entry | Yes |
| GET | `/api/progress/history` | Get full progress history | Yes |

### AI Features

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/ai/generate-workout` | Generate AI workout plan | Yes |
| POST | `/api/ai/generate-diet` | Generate AI diet plan | Yes |
| GET | `/api/ai/recommendations/{id}` | Get AI recommendations by user | Yes |
| GET | `/api/ai/health-metrics` | Get BMI, BMR, TDEE | Yes |

### Health Monitoring

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/health/status` | App & database health check | No |

---

# Security

Spring Security 6 is configured with:

- **JWT Authentication Filter** — validates token on every protected request
- **BCrypt Password Hashing** — all passwords encrypted at rest
- **CORS Policy** — configured to allow requests from `http://localhost:5173`

---

# AI Integration

AI endpoints are orchestrated through `AIService.java` using two providers:

| Provider | Service File | Usage |
|---|---|---|
| Google Gemini | `GeminiService.java` | Detailed workout & diet plan generation |
| Groq API | `GroqService.java` | Fast recommendations & health metric insights |

---

# Database

| Property | Value |
|---|---|
| Name | `AiGymTrainer_db` |
| Type | MongoDB Atlas (Cloud-hosted) |
| URI Format | `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/AiGymTrainer_db` |

---

## Author

**Saurav Kumar**
GitHub → [SauravKumar2015](https://github.com/SauravKumar2015)

---

© 2025 FitAI Pro — AI Gym Trainer & Diet Planner System.