/**
 * Calculate BMI from weight (kg) and height (ft)
 * Converts height from feet to meters before calculation
 */
export const calcBMI = (weightKg, heightFt) => {
  if (!weightKg || !heightFt) return null;
  const heightM = parseFloat(heightFt) * 0.3048;
  return (parseFloat(weightKg) / (heightM * heightM)).toFixed(1);
};

/**
 * Get BMI category label
 */
export const getBMICategory = (bmi) => {
  const b = parseFloat(bmi);
  if (isNaN(b)) return "Unknown";
  if (b < 18.5) return "Underweight";
  if (b < 25) return "Normal";
  if (b < 30) return "Overweight";
  return "Obese";
};

/**
 * Format a date string or Date object
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get initials from a full name
 */
export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/**
 * Safely parse float, returning 0 if invalid
 */
export const safeFloat = (v) => parseFloat(v) || 0;

/**
 * Safely parse int, returning 0 if invalid
 */
export const safeInt = (v) => parseInt(v) || 0;

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * Capitalize first letter
 */
export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Sum a field from an array of objects
 */
export const sumField = (arr = [], field) =>
  arr.reduce((acc, item) => acc + (parseFloat(item[field]) || 0), 0);
