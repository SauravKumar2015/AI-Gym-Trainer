# Build stage: compile the application
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw
RUN ./mvnw -q clean package -DskipTests

# Runtime stage: run the packaged JAR
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT:-8080}"]
