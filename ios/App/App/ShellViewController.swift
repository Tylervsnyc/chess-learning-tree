import UIKit
import Capacitor

/**
 * ShellViewController — the app's root view controller (Main.storyboard).
 *
 * WHY THIS EXISTS. `ios.contentInset` is 'always', so the web view is inset
 * below the status bar and above the home indicator. Those two strips are the
 * web view's NATIVE scroll-view background, not the page: Capacitor pins it to
 * `.systemBackground` (white) at launch, and WebKit only sometimes paints the
 * page colour over it. That is why the strips came and went — white on some
 * launches, matching on others.
 *
 * Now the web tells the native side what colour it is painting
 * (lib/shell-chrome.ts → ShellBackground.setColor), and the strips are set to
 * that colour explicitly, every time.
 */
class ShellViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(ShellBackgroundPlugin())
    }
}

@objc(ShellBackgroundPlugin)
public class ShellBackgroundPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ShellBackgroundPlugin"
    public let jsName = "ShellBackground"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setColor", returnType: CAPPluginReturnPromise)
    ]

    @objc func setColor(_ call: CAPPluginCall) {
        guard let hex = call.getString("color"), let color = UIColor.capacitor.color(fromHex: hex) else {
            call.reject("color must be a hex string like #131a2e")
            return
        }
        DispatchQueue.main.async { [weak self] in
            guard let webView = self?.bridge?.webView else { return }
            webView.backgroundColor = color
            webView.scrollView.backgroundColor = color
            webView.superview?.backgroundColor = color
            call.resolve()
        }
    }
}
