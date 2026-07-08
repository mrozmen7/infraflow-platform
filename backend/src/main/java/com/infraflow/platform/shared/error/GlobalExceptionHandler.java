package com.infraflow.platform.shared.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  ResponseEntity<ApiError> handleNotFound(
    ResourceNotFoundException exception,
    HttpServletRequest request
  ) {
    return error(HttpStatus.NOT_FOUND, exception.getMessage(), request, List.of());
  }

  @ExceptionHandler(BusinessRuleViolationException.class)
  ResponseEntity<ApiError> handleBusinessRule(
    BusinessRuleViolationException exception,
    HttpServletRequest request
  ) {
    return error(HttpStatus.CONFLICT, exception.getMessage(), request, List.of());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> handleValidation(
    MethodArgumentNotValidException exception,
    HttpServletRequest request
  ) {
    List<ApiFieldError> fields = exception.getBindingResult().getFieldErrors().stream()
      .map(fieldError -> new ApiFieldError(fieldError.getField(), fieldError.getDefaultMessage()))
      .toList();

    return error(HttpStatus.BAD_REQUEST, "Request validation failed.", request, fields);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  ResponseEntity<ApiError> handleConstraintViolation(
    ConstraintViolationException exception,
    HttpServletRequest request
  ) {
    List<ApiFieldError> fields = exception.getConstraintViolations().stream()
      .map(violation -> new ApiFieldError(
        violation.getPropertyPath().toString(),
        violation.getMessage()
      ))
      .toList();

    return error(HttpStatus.BAD_REQUEST, "Request validation failed.", request, fields);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<ApiError> handleUnreadableMessage(
    HttpMessageNotReadableException exception,
    HttpServletRequest request
  ) {
    return error(HttpStatus.BAD_REQUEST, "Request body is malformed.", request, List.of());
  }

  private ResponseEntity<ApiError> error(
    HttpStatus status,
    String message,
    HttpServletRequest request,
    List<ApiFieldError> fields
  ) {
    return ResponseEntity.status(status)
      .body(new ApiError(
        Instant.now(),
        status.value(),
        status.getReasonPhrase(),
        message,
        request.getRequestURI(),
        fields
      ));
  }
}
