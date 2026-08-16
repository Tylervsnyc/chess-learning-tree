fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Create app record, cert, profile, archive, upload to TestFlight

### ios upload

```sh
[bundle exec] fastlane ios upload
```

Upload the built IPA to TestFlight

### ios status

```sh
[bundle exec] fastlane ios status
```

Show latest TestFlight build processing status

### ios invite

```sh
[bundle exec] fastlane ios invite
```

Distribute latest build to internal testers

### ios add_tester

```sh
[bundle exec] fastlane ios add_tester
```

Add Tyler as internal tester

### ios debug_dist

```sh
[bundle exec] fastlane ios debug_dist
```

Debug build distribution state

### ios fix_compliance

```sh
[bundle exec] fastlane ios fix_compliance
```

Set export compliance on latest build

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
