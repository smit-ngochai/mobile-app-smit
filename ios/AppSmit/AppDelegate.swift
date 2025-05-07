import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase

@main
class AppDelegate: RCTAppDelegate {
  // Thêm biến static để lưu trạng thái orientation
  static var orientationLock = UIInterfaceOrientationMask.all
  
  // Thêm window tùy chỉnh
  var launchScreenWindow: UIWindow?
  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
    
    // Chuẩn bị React Native
    self.moduleName = "AppSmit"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]
    
    // Khởi tạo React Native (bước này sẽ tạo window chính và bắt đầu tải JS bundle)
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    // Tạo một window mới cho launch screen
    launchScreenWindow = UIWindow(frame: UIScreen.main.bounds)
    if let window = launchScreenWindow {
      window.rootViewController = UIStoryboard(name: "LaunchScreen", bundle: nil).instantiateInitialViewController()
      window.windowLevel = .alert + 1 // Đặt cao hơn window chính
      window.makeKeyAndVisible()
    }
    
    // Sau 3 giây, ẩn launch screen window
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
      UIView.animate(withDuration: 0.3, animations: {
        self.launchScreenWindow?.alpha = 0
      }, completion: { _ in
        self.launchScreenWindow = nil
      })
    }
    
    return result
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  // Thêm phương thức này để kiểm soát orientation
  override func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return AppDelegate.orientationLock
  }
}
