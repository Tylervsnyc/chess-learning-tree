import UIKit
import Capacitor

/**
 * Custom bridge VC so app-local plugins (not shipped as npm packages) get
 * registered with the Capacitor bridge. Main.storyboard points here instead
 * of the stock CAPBridgeViewController.
 */
class BridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(HealthWorkoutPlugin())
    }
}
