#!/bin/bash
set -e


flutterVersion=("3.16.9" "3.16.8" "3.13.7" "3.10.6")

dartVersion=("3.2.6" "3.2.5" "3.1.3" "3.0.6")



cd /home/developer && git clone $1


appFlutterVersion=$(grep "flutter: " "/home/developer/$2/pubspec.lock" | awk -F'[">=/-/<]' '{print $4}')

appDartVersion=$(grep "dart: " "/home/developer/$2/pubspec.lock" | awk -F'[">=/-/<]' '{print $4}')
string_length=${#appDartVersion}
substring="${appDartVersion:0:string_length-1}"

currentFlutterVersion=$(grep "flutter: " "/home/developer/$2/pubspec.lock" | awk -F'[">=/-/<]' '{print $4}')



for (( i = 0; i < ${#dartVersion[@]}; i++ ));
do
  if [[ ${dartVersion[i]} == $substring ]]
  then
    currentFlutterVersion=${flutterVersion[i]};
    echo "Flutter value found $currentFlutterVersion";
  fi
done

cd /home/developer/$2 && fvm install $currentFlutterVersion && fvm use $currentFlutterVersion && fvm flutter build apk --release

mkdir /home/src/server/apks/$2
cp /home/developer/$2/build/app/outputs/flutter-apk/app-release.apk /home/src/server/apks/$2


