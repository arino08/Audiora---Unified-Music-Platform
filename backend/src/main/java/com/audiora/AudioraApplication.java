package com.audiora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AudioraApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(AudioraApplication.class);
        app.run(args);
    }
}
