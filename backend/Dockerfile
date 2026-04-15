# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Build the app
RUN chmod +x mvnw || true
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/*.jar"]
