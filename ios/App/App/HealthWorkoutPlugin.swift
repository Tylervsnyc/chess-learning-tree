import Foundation
import Capacitor
import HealthKit

/**
 * HealthWorkout — local Capacitor plugin for the Chess Boxing shell.
 *
 * One job: save a finished Chess Boxing session into Apple Health as a
 * boxing workout (closes the Move ring). Write-only — we never read any
 * health data. The web app calls it via `window.Capacitor.Plugins.HealthWorkout`
 * (see lib/health/apple-health.ts); registered in BridgeViewController.
 */
@objc(HealthWorkoutPlugin)
public class HealthWorkoutPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HealthWorkoutPlugin"
    public let jsName = "HealthWorkout"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "saveWorkout", returnType: CAPPluginReturnPromise),
    ]

    private let store = HKHealthStore()

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }

    @objc func saveWorkout(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["saved": false, "reason": "unavailable"])
            return
        }
        guard
            let startMs = call.getDouble("startMs"),
            let endMs = call.getDouble("endMs"),
            endMs > startMs
        else {
            call.reject("saveWorkout needs startMs/endMs with endMs > startMs")
            return
        }
        let calories = call.getDouble("calories") ?? 0
        let start = Date(timeIntervalSince1970: startMs / 1000)
        let end = Date(timeIntervalSince1970: endMs / 1000)

        guard let energyType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned) else {
            call.reject("HealthKit energy type unavailable")
            return
        }
        let shareTypes: Set<HKSampleType> = [HKObjectType.workoutType(), energyType]

        store.requestAuthorization(toShare: shareTypes, read: []) { [weak self] _, error in
            guard let self = self else { return }
            if let error = error {
                call.resolve(["saved": false, "reason": error.localizedDescription])
                return
            }
            // requestAuthorization "success" only means the prompt flow ran —
            // check the actual write permission the user landed on.
            guard self.store.authorizationStatus(for: HKObjectType.workoutType()) == .sharingAuthorized else {
                call.resolve(["saved": false, "reason": "denied"])
                return
            }

            let config = HKWorkoutConfiguration()
            config.activityType = .boxing
            config.locationType = .indoor

            let builder = HKWorkoutBuilder(healthStore: self.store, configuration: config, device: .local())
            builder.beginCollection(withStart: start) { began, error in
                guard began, error == nil else {
                    call.resolve(["saved": false, "reason": error?.localizedDescription ?? "beginCollection failed"])
                    return
                }

                let finish: () -> Void = {
                    builder.endCollection(withEnd: end) { ended, error in
                        guard ended, error == nil else {
                            call.resolve(["saved": false, "reason": error?.localizedDescription ?? "endCollection failed"])
                            return
                        }
                        builder.finishWorkout { workout, error in
                            if let error = error {
                                call.resolve(["saved": false, "reason": error.localizedDescription])
                            } else {
                                call.resolve(["saved": workout != nil])
                            }
                        }
                    }
                }

                if calories > 0,
                   self.store.authorizationStatus(for: energyType) == .sharingAuthorized {
                    let sample = HKQuantitySample(
                        type: energyType,
                        quantity: HKQuantity(unit: .kilocalorie(), doubleValue: calories),
                        start: start,
                        end: end
                    )
                    builder.add([sample]) { _, _ in finish() }
                } else {
                    finish()
                }
            }
        }
    }
}
