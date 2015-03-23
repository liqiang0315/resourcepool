/**
 * 
 */
package com.hp.avmon.common.sqlgenerator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author muzh
 *
 */
@Documented 
@Retention(RetentionPolicy.RUNTIME) 
@Target(ElementType.FIELD) 
public @interface FieldAnnotation {
	String fieldName(); 
    FieldType fieldType(); 
    boolean pk(); 
}