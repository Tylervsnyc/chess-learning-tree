import Foundation
import Capacitor

/**
 * StaticExportRouter — how both iOS apps (Chess Boxing, Chess Path) map a
 * capacitor://localhost URL to a file in the offline bundle.
 *
 * WHY THIS EXISTS. The bundle is a Next.js static export with
 * `trailingSlash: true`: every page is a FOLDER (`play/index.html`,
 * `lesson/1.1.1/index.html`) with its RSC payload beside it (`index.txt`).
 * Capacitor's default router doesn't know that layout. It has one rule:
 * no file extension in the URL → the ROOT index.html, extension → that exact
 * file, missing → the request fails. Two things broke on it:
 *
 *   - Every tactic lesson (2026-10-02). Lesson ids are dotted (`1.1.1`), so
 *     both Next and Capacitor read the last `.1` as a file extension. Tapping
 *     Start Lesson asked for `/lesson/1.1.1.txt` (Next's RSC URL for a
 *     path it won't add a trailing slash to), which doesn't exist, then fell
 *     back to loading `/lesson/1.1.1`, a folder, which also failed. The tap
 *     did nothing, for all 446 lessons.
 *   - Any full-page load of a non-home page (`/path/`, `/play/`) got the HOME
 *     page's HTML instead of its own.
 *
 * This resolves URLs the way a static web host does. Rules, in order:
 *   1. the exact file, if it exists
 *   2. a folder → its index.html            (/play/, /lesson/1.1.1)
 *   3. `X.txt` missing → `X/index.txt`       (/lesson/1.1.1.txt, RSC payload)
 *   4. an unknown extensionless route → the root index.html (Capacitor's
 *      default, kept so the app shell still boots for any route)
 *   5. otherwise the path as asked, so the request fails like a 404
 *
 * scripts/build-offline.mjs mirrors these rules (resolveLikeApp) and fails
 * the build if any exported page or its RSC payload doesn't resolve. Change
 * both together.
 *
 * Known limit, not fixable here: Capacitor picks the response Content-Type
 * from the REQUESTED URL's extension, in a private code path. A full-page
 * load of a dotted URL (`/lesson/1.1.1`) is sent as application/octet-stream.
 * Taps are client-side navigations (RSC `.txt`, served as text/plain), so
 * they're unaffected; app code must not full-page-load a dotted URL.
 */
public struct StaticExportRouter: Router {
    public var basePath: String = ""

    public init() {}

    public func route(for path: String) -> String {
        // Never resolve outside the bundle.
        if path.split(separator: "/").contains("..") {
            return basePath + "/index.html"
        }

        let full = basePath + path

        if isFile(full) { return full }

        let folderIndex = (full as NSString).appendingPathComponent("index.html")
        if isFile(folderIndex) { return folderIndex }

        if path.hasSuffix(".txt") {
            let rscPayload = String(full.dropLast(4)) + "/index.txt"
            if isFile(rscPayload) { return rscPayload }
        }

        if URL(fileURLWithPath: path).pathExtension.isEmpty {
            return basePath + "/index.html"
        }

        return full
    }

    private func isFile(_ path: String) -> Bool {
        var isDirectory: ObjCBool = false
        return FileManager.default.fileExists(atPath: path, isDirectory: &isDirectory) && !isDirectory.boolValue
    }
}

/// Root view controller base for both apps: Capacitor with StaticExportRouter.
class StaticExportBridgeViewController: CAPBridgeViewController {
    override func router() -> Router {
        return StaticExportRouter()
    }
}
