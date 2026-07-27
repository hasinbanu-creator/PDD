package com.civifix.mobile
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) { super.onCreate(null) }
  override fun getMainComponentName(): String = "civifix"
  override fun createReactActivityDelegate(): ReactActivityDelegate { return DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) }
}