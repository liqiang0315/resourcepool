/*******************************************************************************
 * Copyright (c) 2005, 2014 springside.github.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *******************************************************************************/
package com.hp.xo.newngecc.service.repository;

import static org.assertj.core.api.Assertions.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.metamodel.EntityType;
import javax.persistence.metamodel.Metamodel;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

@ContextConfiguration(locations = { "/applicationContext-service.xml" })
public class JpaMappingTest extends  AbstractJUnit4SpringContextTests {

	private static Logger logger = LoggerFactory.getLogger(JpaMappingTest.class);

	@PersistenceContext
	private EntityManager em;
 
	@Test
	public void allClassMapping() throws Exception {
		Metamodel model = em.getEntityManagerFactory().getMetamodel();
		assertThat(model.getEntities()).as("No entity mapping found").isNotEmpty();

		for (EntityType entityType : model.getEntities()) {
			String entityName = entityType.getName();
			em.createQuery("select o from " + entityName + " o").getResultList();
			logger.info("ok: " + entityName);
		}
	}
}
