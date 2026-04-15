# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Maven manually (since mvnw is broken)
RUN apt-get update && apt-get install -y maven

# Build the application
RUN mvn clean package -DskipTests

# Expose port (Render will override with PORT)
EXPOSE 8080

# Run the application
CMD ["sh", "-c", "java -jar target/*.jar --server.port=$PORT"]
