package org.cedar.onestop.elastic.common

import groovy.util.logging.Slf4j
import org.elasticsearch.Version
import org.springframework.beans.BeansException
import org.springframework.beans.factory.BeanDefinitionStoreException
import org.springframework.beans.factory.config.BeanFactoryPostProcessor
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory
import org.springframework.beans.factory.support.BeanDefinitionBuilder
import org.springframework.beans.factory.support.BeanDefinitionRegistry
import org.springframework.boot.test.context.TestComponent
import org.springframework.context.annotation.Profile

@Slf4j
@Profile("integration")
@TestComponent
class ElasticsearchTestContainerBeanFactory implements BeanFactoryPostProcessor {

  // ElasticsearchTestContainer-related constants
  static final String ELASTICSEARCH_DOCKER_IMAGE_NAME = "docker.elastic.co/elasticsearch/elasticsearch"
  static final String ELASTICSEARCH_TEST_CONTAINER_BEAN_PREFIX = "elasticsearchTestContainer_"

  // ElasticsearchConfig-related constants
  static final String ELASTICSEARCH_CONFIG_TEST_PREFIX = 'prefix-'
  static final Integer ELASTICSEARCH_CONFIG_TEST_MAX_TASKS = 10
  static final Integer ELASTICSEARCH_CONFIG_TEST_REQUESTS_PER_SECOND = null
  static final Integer ELASTICSEARCH_CONFIG_TEST_SITEMAP_SCROLL_SIZE = 2
  static final Integer ELASTICSEARCH_CONFIG_TEST_SITEMAP_COLLECTIONS_PER_SUBMAP = 5
  static final String ELASTICSEARCH_CONFIG_BEAN_PREFIX = "elasticsearchConfig_"

  static getElasticsearchTestContainerDockerImageName(Version version) {
    return "${ELASTICSEARCH_DOCKER_IMAGE_NAME}:${version.toString()}"
  }

  static getElasticsearchTestContainerBeanName(Version version) {
    return "${ELASTICSEARCH_TEST_CONTAINER_BEAN_PREFIX}${version.toString()}"
  }

  private static registerElasticsearchTestContainerBean(final BeanDefinitionRegistry registry, String beanName, String dockerImageName) {
    registry.registerBeanDefinition(beanName, BeanDefinitionBuilder
      // the class of the bean being created:
      // a wrapper around the test container's ElasticsearchContainer
      // which give control over configuration and starting/stopping, for example
      .rootBeanDefinition(ElasticsearchTestContainer)
      // use start method of the test container library upon bean initialization
      // note: we override the start method so that we can extract the host and create a test rest client
      .setInitMethodName('start')
      // use the test container's library to stop/cleanup the container when bean is destroyed
      .setDestroyMethodName('stop')
      // the single expected constructor arg of ElasticsearchTestContainer is the docker image name
      .addConstructorArgValue(dockerImageName)
      .getBeanDefinition()
    )
  }

  private static registerElasticsearchConfigBean(final BeanDefinitionRegistry registry, String beanName, Version version) {
    registry.registerBeanDefinition(beanName, BeanDefinitionBuilder
      // the class of the bean being created:
      .rootBeanDefinition(ElasticsearchConfig)
      // constructor params given in order
      .addConstructorArgValue(ELASTICSEARCH_CONFIG_TEST_PREFIX)
      .addConstructorArgValue(ELASTICSEARCH_CONFIG_TEST_MAX_TASKS)
      .addConstructorArgValue(ELASTICSEARCH_CONFIG_TEST_REQUESTS_PER_SECOND)
      .addConstructorArgValue(ELASTICSEARCH_CONFIG_TEST_SITEMAP_SCROLL_SIZE)
      .addConstructorArgValue(ELASTICSEARCH_CONFIG_TEST_SITEMAP_COLLECTIONS_PER_SUBMAP)
      .getBeanDefinition()
    )
  }

  static getElasticsearchConfigBeanName(Version version) {
    return "${ELASTICSEARCH_CONFIG_BEAN_PREFIX}${version.toString()}"
  }


  @Override
  void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    final BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory

    // create an ElasticsearchTestContainer bean for either:
    // a) the latest supported version
    // b) or all compatible versions (if backward compatibility check enabled)
    ElasticsearchTestVersion.testVersions().each { Version version ->
      String dockerImageName = getElasticsearchTestContainerDockerImageName(version)
      String beanName = getElasticsearchTestContainerBeanName(version)
      log.info("Dynamically creating test container bean for Elasticsearch version: ${version.toString()}")
      log.info("Docker image used: ${dockerImageName}")
      log.info("Bean name: ${beanName}")
      try {
        registerElasticsearchTestContainerBean(registry, beanName, dockerImageName)
      } catch( BeanDefinitionStoreException e) {
        log.error("Failed to dynamically create test container bean for Elasticsearch version: ${version.toString()}", e)
      }
    }

    // create an ElasticsearchConfig bean for either:
    // a) the latest supported version
    // b) or all compatible versions (if backward compatibility check enabled)
    ElasticsearchTestVersion.testVersions().each { Version version ->
      String beanName = getElasticsearchConfigBeanName(version)
      log.info("Dynamically creating Elasticsearch config bean for Elasticsearch version: ${version.toString()}")
      log.info("Bean name: ${beanName}")
      try {
        registerElasticsearchConfigBean(registry, beanName, version)
      } catch( BeanDefinitionStoreException e) {
        log.error("Failed to dynamically create Elasticsearch config bean for Elasticsearch version: ${version.toString()}", e)
      }
    }
  }
}
