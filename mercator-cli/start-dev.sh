#!/bin/sh
set -e

../gradlew bootJar
SPRING_PROFILES_ACTIVE=dev java -jar build/libs/mercator-cli-0.0.1-SNAPSHOT.jar

