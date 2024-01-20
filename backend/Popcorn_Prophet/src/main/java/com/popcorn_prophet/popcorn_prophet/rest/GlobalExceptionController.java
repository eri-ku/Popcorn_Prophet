package com.popcorn_prophet.popcorn_prophet.rest;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionController {

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<String> handleExceptionAccess(AccessDeniedException e){
        return ResponseEntity.status(403).body("Access denied");
    }
    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<List<String>> handleExceptionNotValid(MethodArgumentNotValidException e){
        List<String> errors =  e.getBindingResult().getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList();

        return new ResponseEntity<>(errors,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler({MissingServletRequestPartException.class})
    public ResponseEntity<List<String>> handleExceptionMissingPosterImg(MissingServletRequestPartException e){
        return new ResponseEntity<>(Collections.singletonList("Poster is mandatory"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({Exception.class})
    public ResponseEntity<String> handleExceptionGlobal(Exception e){

        return ResponseEntity.status(500).body("Something went wrong");
    }

}
