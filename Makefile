VERSION=`cut -d '"' -f2 $BUILDDIR/../version.js`

cordova-base:
	grunt dist-mobile

wp8-prod:
	cordova/build.sh WP8 --clear
	cordova/wp/fix-svg.sh
	echo -e "\a"

wp8-debug:
	cordova/build.sh WP8 --dbgjs
	cordova/wp/fix-svg.sh
	echo -e "\a"

ios:
	cordova/build.sh IOS --dbgjs
	cd ../luxalpabuilds/project-IOS && cordova build ios
	open ../luxalpabuilds/project-IOS/platforms/ios/LuxAlpa.xcodeproj

ios-prod:
	cordova/build.sh IOS --clear
	cd ../luxalpabuilds/project-IOS && cordova build ios

ios-debug:
	cordova/build.sh IOS --dbgjs
	cd ../luxalpabuilds/project-IOS && cordova build ios
	open ../luxalpabuilds/project-IOS/platforms/ios/LuxAlpa.xcodeproj

android:
	test -d "../luxalpabuilds" || mkdir ../luxalpabuilds
	cordova/build.sh ANDROID --clear
	cd ../luxalpabuilds/project-ANDROID && cordova build android 2>&1 >/dev/null
	mv ../luxalpabuilds/project-ANDROID/platforms/android/build/outputs/apk/android-debug.apk ../luxalpabuilds/LuxAlpa.apk

android-prod:
	cordova/build.sh ANDROID --clear
	cd ../luxalpabuilds/project-ANDROID && cordova build android 2>&1 >/dev/null
	mv ../luxalpabuilds/project-ANDROID/platforms/android/build/outputs/apk/android-debug.apk ../luxalpabuilds/LuxAlpa.apk

android-prod-fast:
	cordova/build.sh ANDROID
#	cd ../luxalpabuilds/project-ANDROID && cordova run android --device
	cd ../luxalpabuilds/project-ANDROID && cordova build android 2>&1 >/dev/null
	mv ../luxalpabuilds/project-ANDROID/platforms/android/build/outputs/apk/android-debug.apk ../luxalpabuilds/LuxAlpa.apk

android-debug:
	cordova/build.sh ANDROID --dbgjs --clear
	cd ../luxalpabuilds/project-ANDROID && cordova build android 2>&1 >/dev/null
	mv ../luxalpabuilds/project-ANDROID/platforms/android/build/outputs/apk/android-debug.apk ../luxalpabuilds/LuxAlpa.apk

android-debug-fast:
	cordova/build.sh ANDROID --dbgjs
	cd ../luxalpabuilds/project-ANDROID && cordova run android --device

win32:
	grunt.cmd desktop
	cp -rf node_modules ../luxalpabuilds/LuxAlpa/win32/
	grunt.cmd inno32

win64:
	grunt.cmd inno64

linux64:
	grunt desktop
	cp -rf node_modules ../luxalpabuilds/LuxAlpa/linux64/
	grunt linux64

osx64:
	grunt desktop
	cp -rf node_modules ../luxalpabuilds/LuxAlpa/osx64/LuxAlpa.app/Contents/Resources/app.nw/
	grunt dmg