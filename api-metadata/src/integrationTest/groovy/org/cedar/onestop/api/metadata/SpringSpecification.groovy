package org.cedar.onestop.api.metadata

import spock.lang.Shared
import spock.lang.Specification

// see: https://github.com/spockframework/spock/issues/76#issuecomment-448972279
class SpringSpecification extends Specification {

  @Shared
  Closure cleanupClosure

  @Shared boolean setupSpecDone = false

  def setup() {
    if (!setupSpecDone) {
      setupSpecWithSpring()
      setupSpecDone = true
    }

    cleanupClosure = this.&cleanupSpecWithSpring
  }

  def cleanupSpec() {
    cleanupClosure?.run()
  }

  def setupSpecWithSpring() {
    // override this if Spring Beans are needed in setupSpec
  }

  def cleanupSpecWithSpring() {
    // override this if Spring Beans are needed in cleanupSpec
  }
}