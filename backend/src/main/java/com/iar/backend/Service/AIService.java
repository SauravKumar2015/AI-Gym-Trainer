package com.iar.backend.Service;

import com.iar.backend.Entity.*;
import com.iar.backend.Repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    private final AIRecommendationRepository aiRepository;
    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutRepository;
    private final DietPlanRepository dietRepository;
    private final ExerciseRepository exerciseRepository;
    private final MealRepository mealRepository;
    private final ProgressTrackingRepository progressRepository;
    private final GroqService groqService;
    private final GeminiService geminiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ─────────────────────────────────────────────
    // GENERATE WORKOUT
    // ─────────────────────────────────────────────
    public WorkoutPlanEntity generateWorkout() {
        var user = getAuthenticatedUser();

        double bmi = calculateBMI(user.getWeight(), user.getHeight());
        double bmr = calculateBMR(user);
        double tdee = calculateTDEE(bmr, user.getExperienceLevel());

        String prompt = String.format(
                "Generate a workout plan as STRICT JSON only, no extra text, no markdown.\n" +
                        "User profile:\n" +
                        "- Age: %d, Gender: %s\n" +
                        "- Weight: %.1fkg, Height: %.1fcm\n" +
                        "- BMI: %.1f (%s)\n" +
                        "- BMR: %.0f kcal/day, TDEE: %.0f kcal/day\n" +
                        "- Goal: %s, Level: %s\n" +
                        "Return exactly this structure:\n" +
                        "{\"title\":\"...\",\"goal\":\"...\",\"difficulty\":\"...\",\"durationWeeks\":8,\"description\":\"...\"}",
                user.getAge(), user.getGender(),
                user.getWeight(), user.getHeight(),
                bmi, getBMICategory(bmi),
                bmr, tdee,
                user.getFitnessGoal(), user.getExperienceLevel());

        String aiResponse = callAI(prompt);

        try {
            Map<String, Object> map = objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

            WorkoutPlanEntity workout = new WorkoutPlanEntity();
            workout.setTitle(getStr(map, "title", "AI Workout Plan"));
            workout.setGoal(getStr(map, "goal", user.getFitnessGoal()));
            workout.setDifficulty(getStr(map, "difficulty", "Intermediate"));
            workout.setDurationWeeks(getInt(map, "durationWeeks", 4));
            workout.setDescription(getStr(map, "description", "AI generated workout"));
            workout.setCreatedBy(user.getId());

            WorkoutPlanEntity saved = workoutRepository.save(workout);

            saveRecommendation(user, "WORKOUT", saved.getId(), map,
                    saved.getTitle(), saved.getGoal(), saved.getDifficulty(),
                    saved.getDurationWeeks(), 0, "");

            user.getWorkoutPlans().add(saved);
            userRepository.save(user);

            return saved;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to parse AI workout response: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE DIET
    // ─────────────────────────────────────────────
    public DietPlanEntity generateDiet() {
        var user = getAuthenticatedUser();

        double bmi = calculateBMI(user.getWeight(), user.getHeight());
        double bmr = calculateBMR(user);
        double tdee = calculateTDEE(bmr, user.getExperienceLevel());

        int targetCalories = switch (user.getFitnessGoal().toLowerCase()) {
            case "weight loss" -> (int) (tdee - 500);
            case "muscle gain" -> (int) (tdee + 300);
            default -> (int) tdee;
        };

        String prompt = String.format(
                "Generate a diet plan as STRICT JSON only, no extra text, no markdown.\n" +
                        "User profile:\n" +
                        "- Age: %d, Gender: %s\n" +
                        "- Weight: %.1fkg, Height: %.1fcm\n" +
                        "- BMI: %.1f (%s)\n" +
                        "- BMR: %.0f kcal/day, TDEE: %.0f kcal/day\n" +
                        "- Target calories for %s: %d kcal/day\n" +
                        "- Goal: %s, Level: %s\n" +
                        "Return exactly this structure:\n" +
                        "{\"title\":\"...\",\"goal\":\"...\",\"dailyCalories\":%d,\"dietType\":\"...\",\"description\":\"...\"}",
                user.getAge(), user.getGender(),
                user.getWeight(), user.getHeight(),
                bmi, getBMICategory(bmi),
                bmr, tdee,
                user.getFitnessGoal(), targetCalories,
                user.getFitnessGoal(), user.getExperienceLevel(),
                targetCalories);

        String aiResponse = callAI(prompt);

        try {
            Map<String, Object> map = objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

            DietPlanEntity diet = new DietPlanEntity();
            diet.setTitle(getStr(map, "title", "AI Diet Plan"));
            diet.setGoal(getStr(map, "goal", user.getFitnessGoal()));
            diet.setDailyCalories(getInt(map, "dailyCalories", targetCalories));
            diet.setDietType(getStr(map, "dietType", "balanced"));
            diet.setDescription(getStr(map, "description", "AI generated diet"));
            diet.setCreatedBy(user.getId());

            DietPlanEntity saved = dietRepository.save(diet);

            saveRecommendation(user, "DIET", saved.getId(), map,
                    saved.getTitle(), saved.getGoal(), "", 0,
                    saved.getDailyCalories(), saved.getDietType());

            user.getDietPlans().add(saved);
            userRepository.save(user);

            return saved;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to parse AI diet response: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS FOR WORKOUT
    // ─────────────────────────────────────────────
    public Map<String, Object> generateWorkoutTips(String workoutTitle) {
        var user = getAuthenticatedUser();

        String prompt = String.format(
                "Generate 5 specific workout tips as STRICT JSON only, no extra text.\n" +
                        "Workout: %s\n" +
                        "User: %s, Level: %s\n" +
                        "Return exactly: {\"tips\":[\"tip1\",\"tip2\",\"tip3\",\"tip4\",\"tip5\"]}",
                workoutTitle, user.getFitnessGoal(), user.getExperienceLevel());

        String aiResponse = callAI(prompt);

        try {
            return objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

        } catch (Exception e) {
            return Map.of(
                    "tips", List.of(
                            "Focus on proper form over heavy weights",
                            "Rest 48-72 hours between muscle groups",
                            "Track your progress weekly",
                            "Warm up properly before each session",
                            "Progressive overload is key to growth"));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS FOR DIET
    // ─────────────────────────────────────────────
    public Map<String, Object> generateDietTips(String dietTitle) {
        var user = getAuthenticatedUser();

        String prompt = String.format(
                "Generate 5 specific diet tips as STRICT JSON only, no extra text.\n" +
                        "Diet: %s\n" +
                        "Goal: %s\n" +
                        "Return exactly: {\"tips\":[\"tip1\",\"tip2\",\"tip3\",\"tip4\",\"tip5\"]}",
                dietTitle, user.getFitnessGoal());

        String aiResponse = callAI(prompt);

        try {
            return objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

        } catch (Exception e) {
            return Map.of(
                    "tips", List.of(
                            "Prepare meals in advance for consistency",
                            "Stay hydrated throughout the day",
                            "Track macros weekly",
                            "Balance carbs and protein in each meal",
                            "Plan meals around your workout schedule"));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS FOR MEAL
    // ─────────────────────────────────────────────
    public Map<String, Object> generateMealTips(String mealName, double protein, double carbs, double fats) {
        String prompt = String.format(
                "Generate 5 tips for eating this meal as STRICT JSON only.\n" +
                        "Meal: %s\n" +
                        "Macros: P%.1fg C%.1fg F%.1fg\n" +
                        "Return exactly: {\"tips\":[\"tip1\",\"tip2\",\"tip3\",\"tip4\",\"tip5\"]}",
                mealName, protein, carbs, fats);

        String aiResponse = callAI(prompt);

        try {
            return objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

        } catch (Exception e) {
            return Map.of(
                    "tips", List.of(
                            "Eat with other meals for balanced nutrition",
                            "Preparation time: 15-20 minutes",
                            "Best consumed within 2 hours of preparation",
                            "Pair with adequate water intake",
                            "Track intake consistently for best results"));
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE TIPS FOR EXERCISE
    // ─────────────────────────────────────────────
    public Map<String, Object> generateExerciseTips(String exerciseName, String muscleGroup) {
        String prompt = String.format(
                "Generate 5 form/technique tips for this exercise as STRICT JSON only.\n" +
                        "Exercise: %s\n" +
                        "Muscle Group: %s\n" +
                        "Return exactly: {\"tips\":[\"tip1\",\"tip2\",\"tip3\",\"tip4\",\"tip5\"]}",
                exerciseName, muscleGroup);

        String aiResponse = callAI(prompt);

        try {
            return objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

        } catch (Exception e) {
            return Map.of(
                    "tips", List.of(
                            "Control the movement - avoid swinging",
                            "Full range of motion for maximum benefit",
                            "Rest 60-90 seconds between sets",
                            "Maintain strict form before increasing weight",
                            "Breathe properly - exhale on exertion"));
        }
    }

    public ExerciseEntity generateExercise() {
        var user = getAuthenticatedUser();

        String prompt = String.format(
                "Generate an exercise as STRICT JSON only, no extra text, no markdown.\n" +
                        "User profile:\n" +
                        "- Experience Level: %s\n" +
                        "- Fitness Goal: %s\n" +
                        "Return exactly this structure:\n" +
                        "{\"name\":\"...\",\"muscleGroup\":\"...\",\"equipment\":\"...\",\"difficulty\":\"...\",\"instructions\":\"...\"}",
                user.getExperienceLevel(), user.getFitnessGoal());

        String aiResponse = callAI(prompt);

        try {
            Map<String, Object> map = objectMapper.readValue(cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    }

            );

            ExerciseEntity exercise = new ExerciseEntity();
            exercise.setName(getStr(map, "name", "AI Exercise"));
            exercise.setMuscleGroup(getStr(map, "muscleGroup", "Full Body"));
            exercise.setEquipment(getStr(map, "equipment", "None"));
            exercise.setDifficulty(getStr(map, "difficulty", user.getExperienceLevel()));
            exercise.setInstructions(getStr(map, "instructions", "Follow the exercise properly"));
            exercise.setCreatedBy(user.getId());

            ExerciseEntity saved = exerciseRepository.save(exercise);

            saveRecommendation(user, "EXERCISE", saved.getId(), map,
                    saved.getName(), saved.getMuscleGroup(), saved.getDifficulty(), 0, 0, "");

            return saved;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to parse AI exercise response: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE MEALS
    // ─────────────────────────────────────────────
    public MealEntity generateMeal() {
        var user = getAuthenticatedUser();

        double bmi = calculateBMI(user.getWeight(), user.getHeight());
        double bmr = calculateBMR(user);
        double tdee = calculateTDEE(bmr, user.getExperienceLevel());

        String prompt = String.format(
                "Generate a healthy meal as STRICT JSON only, no extra text, no markdown.\n" +
                        "User profile:\n" +
                        "- Age: %d, Gender: %s\n" +
                        "- BMI: %.1f (%s)\n" +
                        "- TDEE: %.0f kcal/day\n" +
                        "- Goal: %s\n" +
                        "Return exactly this structure:\n" +
                        "{\"name\":\"...\",\"mealType\":\"breakfast|lunch|dinner|snack\",\"calories\":2000,\"protein\":50.5,\"carbs\":75.0,\"fats\":30.0}",
                user.getAge(), user.getGender(),
                bmi, getBMICategory(bmi),
                tdee,
                user.getFitnessGoal());

        String aiResponse = callAI(prompt);

        try {
            Map<String, Object> map = objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

            MealEntity meal = new MealEntity();
            meal.setName(getStr(map, "name", "AI Generated Meal"));
            meal.setMealType(getStr(map, "mealType", "lunch"));
            meal.setCalories(getInt(map, "calories", 500));
            meal.setProtein(getDouble(map, "protein", 20.0));
            meal.setCarbs(getDouble(map, "carbs", 50.0));
            meal.setFats(getDouble(map, "fats", 15.0));
            meal.setCreatedBy(user.getId());

            MealEntity saved = mealRepository.save(meal);

            saveRecommendation(user, "MEAL", saved.getId(), map,
                    saved.getName(), saved.getMealType(), "", 0, saved.getCalories(), "");

            return saved;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to parse AI meal response: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // GENERATE PROGRESS PLAN
    // ─────────────────────────────────────────────
    public ProgressTrackingEntity generateProgressPlan() {
        var user = getAuthenticatedUser();

        double bmi = calculateBMI(user.getWeight(), user.getHeight());
        double bmr = calculateBMR(user);
        double tdee = calculateTDEE(bmr, user.getExperienceLevel());

        String prompt = String.format(
                "Generate a progress tracking plan as STRICT JSON only, no extra text, no markdown.\n" +
                        "User profile:\n" +
                        "- Current Weight: %.1fkg, Height: %.1fcm\n" +
                        "- BMI: %.1f (%s)\n" +
                        "- BMR: %.0f, TDEE: %.0f\n" +
                        "- Goal: %s\n" +
                        "Estimate weight/body fat change for this fitness goal.\n" +
                        "Return exactly this structure:\n" +
                        "{\"weight\":%.1f,\"bodyFatPercentage\":15.0}",
                user.getWeight(), user.getHeight(),
                bmi, getBMICategory(bmi),
                bmr, tdee,
                user.getFitnessGoal(),
                user.getWeight());

        String aiResponse = callAI(prompt);

        try {
            Map<String, Object> map = objectMapper.readValue(
                    cleanJson(aiResponse),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

            ProgressTrackingEntity progress = new ProgressTrackingEntity();
            progress.setUserId(user.getId());
            progress.setWeight(getDouble(map, "weight", user.getWeight()));
            progress.setBodyFatPercentage(getDouble(map, "bodyFatPercentage", 20.0));
            progress.setRecordDate(java.time.LocalDate.now());
            progress.setCreatedBy(user.getId());

            ProgressTrackingEntity saved = progressRepository.save(progress);

            saveRecommendation(user, "PROGRESS", saved.getId(), map,
                    "Progress Plan", user.getFitnessGoal(), "", 0, 0, "");

            return saved;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to parse AI progress response: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // GET RECOMMENDATIONS
    // ─────────────────────────────────────────────
    public List<AIRecommendationEntity> getUserRecommendations() {
        var user = getAuthenticatedUser();
        return aiRepository.findByUserId(user.getId());
    }

    // ─────────────────────────────────────────────
    // HEALTH METRICS
    // ─────────────────────────────────────────────
    public Map<String, Object> getHealthMetrics() {
        var user = getAuthenticatedUser();

        double bmi = calculateBMI(user.getWeight(), user.getHeight());
        double bmr = calculateBMR(user);
        double tdee = calculateTDEE(bmr, user.getExperienceLevel());

        return Map.of(
                "bmi", Math.round(bmi * 10.0) / 10.0,
                "bmiCategory", getBMICategory(bmi),
                "bmr", Math.round(bmr),
                "tdee", Math.round(tdee),
                "targetCaloriesLoss", Math.round(tdee - 500),
                "targetCaloriesGain", Math.round(tdee + 300),
                "targetCaloriesMaintain", Math.round(tdee));
    }

    // ─────────────────────────────────────────────
    // PRIVATE — AI CALLER (Groq → Gemini fallback)
    // ─────────────────────────────────────────────
    private String callAI(String prompt) {
        try {
            String response = groqService.generate(prompt);
            if (response != null && !response.isBlank()) {
                System.out.println("✅ Groq responded successfully");
                return response;
            }
        } catch (ResponseStatusException e) {
            if (e.getStatusCode().value() == 429) {
                System.err.println("⚠️ Groq quota hit, falling back to Gemini...");
            } else {
                throw e;
            }
        } catch (Exception e) {
            System.err.println("⚠️ Groq failed: " + e.getMessage() + ", falling back to Gemini...");
        }

        try {
            String response = geminiService.generate(prompt);
            if (response != null && !response.isBlank()) {
                System.out.println("✅ Gemini fallback responded successfully");
                return response;
            }
        } catch (ResponseStatusException e) {
            if (e.getStatusCode().value() == 429) {
                throw new ResponseStatusException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Both Groq and Gemini quota exhausted. Try again tomorrow.");
            }
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "All AI providers failed: " + e.getMessage());
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "All AI providers returned empty response");
    }

    // ─────────────────────────────────────────────
    // PRIVATE — SAVE RECOMMENDATION
    // ─────────────────────────────────────────────
    private void saveRecommendation(
            UserEntity user,
            String type,
            String referenceId,
            Map<String, Object> map,
            String title,
            String goal,
            String difficulty,
            int durationWeeks,
            int dailyCalories,
            String dietType) {
        AIRecommendationEntity rec = new AIRecommendationEntity();
        rec.setUserId(user.getId());
        rec.setRecommendationType(type);
        rec.setReferenceId(referenceId);
        rec.setCreatedDate(LocalDateTime.now());
        rec.setGeneratedAt(LocalDateTime.now());

        if (type.equals("WORKOUT")) {
            rec.setWorkoutSuggestion(String.format(
                    "Follow a %d-week %s workout plan titled '%s' at %s difficulty level.",
                    durationWeeks, goal, title, difficulty));
            rec.setDietSuggestion(null);
            rec.setContent(String.format(
                    "Generated a %d-week %s workout plan titled '%s' with %s difficulty.",
                    durationWeeks, goal, title, difficulty));
        } else if (type.equals("DIET")) {
            rec.setDietSuggestion(String.format(
                    "Follow a %s diet plan titled '%s' targeting %s with %d daily calories.",
                    dietType, title, goal, dailyCalories));
            rec.setWorkoutSuggestion(null);
            rec.setContent(String.format(
                    "Generated a %s diet plan titled '%s' targeting %s with %d daily calories.",
                    dietType, title, goal, dailyCalories));
        } else if (type.equals("EXERCISE")) {
            rec.setContent(String.format(
                    "Generated exercise '%s' for %s muscle group at %s difficulty.",
                    title, goal, difficulty));
            rec.setWorkoutSuggestion("Try this new exercise: " + title);
            rec.setDietSuggestion(null);
        } else if (type.equals("MEAL")) {
            rec.setContent(String.format(
                    "Generated meal '%s' (%s) with %d calories.",
                    title, goal, dailyCalories));
            rec.setDietSuggestion("Try this meal: " + title);
            rec.setWorkoutSuggestion(null);
        } else if (type.equals("PROGRESS")) {
            rec.setContent(String.format(
                    "Generated progress tracking plan for %s goal.",
                    goal));
            rec.setWorkoutSuggestion(null);
            rec.setDietSuggestion(null);
        }

        AIRecommendationEntity saved = aiRepository.save(rec);
        user.getAiRecommendations().add(saved);
        userRepository.save(user);
    }

    // ─────────────────────────────────────────────
    // PRIVATE — BMI / BMR / TDEE
    // ─────────────────────────────────────────────
    private double calculateBMI(double weightKg, double heightCm) {
        double heightM = heightCm / 100.0;
        return weightKg / (heightM * heightM);
    }

    private String getBMICategory(double bmi) {
        if (bmi < 18.5)
            return "Underweight";
        if (bmi < 25.0)
            return "Normal";
        if (bmi < 30.0)
            return "Overweight";
        return "Obese";
    }

    private double calculateBMR(UserEntity user) {
        double bmr = 10 * user.getWeight()
                + 6.25 * user.getHeight()
                - 5 * user.getAge();
        return "male".equalsIgnoreCase(user.getGender()) ? bmr + 5 : bmr - 161;
    }

    private double calculateTDEE(double bmr, String experienceLevel) {
        return switch (experienceLevel.toLowerCase()) {
            case "beginner" -> bmr * 1.375;
            case "intermediate" -> bmr * 1.55;
            case "advanced" -> bmr * 1.725;
            default -> bmr * 1.2;
        };
    }

    // ─────────────────────────────────────────────
    // PRIVATE — UTILITY
    // ─────────────────────────────────────────────
    private String cleanJson(String response) {
        return response
                .replaceAll("(?s)```json", "")
                .replaceAll("```", "")
                .trim();
    }

    private String getStr(Map<String, Object> map, String key, String fallback) {
        Object val = map.get(key);
        return val instanceof String s ? s : fallback;
    }

    private int getInt(Map<String, Object> map, String key, int fallback) {
        Object val = map.get(key);
        if (val instanceof Integer i)
            return i;
        if (val instanceof Number n)
            return n.intValue();
        return fallback;
    }

    private double getDouble(Map<String, Object> map, String key, double fallback) {
        Object val = map.get(key);
        if (val instanceof Double d)
            return d;
        if (val instanceof Number n)
            return n.doubleValue();
        return fallback;
    }

    private UserEntity getAuthenticatedUser() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }
}