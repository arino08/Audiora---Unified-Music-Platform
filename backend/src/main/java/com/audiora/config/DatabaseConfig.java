package com.audiora.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Database configuration for production environment.
 * Fixes Render's DATABASE_URL format (postgresql://) to JDBC format (jdbc:postgresql://)
 */
@Configuration
@Profile("prod")
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");

        if (databaseUrl == null) {
            throw new IllegalStateException("DATABASE_URL environment variable is not set");
        }

        try {
            // Parse the DATABASE_URL
            URI dbUri = new URI(databaseUrl);

            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            String host = dbUri.getHost();
            int port = dbUri.getPort() != -1 ? dbUri.getPort() : 5432; // Default PostgreSQL port
            String path = dbUri.getPath();

            // Construct proper JDBC URL
            String jdbcUrl = String.format("jdbc:postgresql://%s:%d%s", host, port, path);

            logger.info("Connecting to PostgreSQL at host: {}, port: {}, database: {}", host, port, path);

            return DataSourceBuilder.create()
                    .url(jdbcUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();

        } catch (URISyntaxException e) {
            logger.error("Failed to parse DATABASE_URL: {}", databaseUrl, e);
            throw new IllegalStateException("Invalid DATABASE_URL format", e);
        } catch (Exception e) {
            logger.error("Failed to create DataSource", e);
            throw new IllegalStateException("Failed to configure database connection", e);
        }
    }
}
