package com.safeevent.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.safeevent.backend.model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
}