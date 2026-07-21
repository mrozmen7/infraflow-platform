# syntax=docker/dockerfile:1

# Build stage: compile and package the Spring Boot application.
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn --batch-mode --quiet dependency:go-offline
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn --batch-mode --quiet package -DskipTests

# Runtime stage: minimal JRE image running as a non-root user.
FROM eclipse-temurin:21-jre
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system infraflow \
  && useradd --system --gid infraflow --home /app infraflow
WORKDIR /app
COPY --from=build --chown=infraflow:infraflow /workspace/target/infraflow-backend-*.jar app.jar
USER infraflow
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
