'use strict';

angular.module('copayApp.controllers').controller('disclaimerController',
  function($scope, $timeout, storageService, applicationService, gettextCatalog, isCordova, uxLanguage, go, $rootScope, profileService) {

	if (!isCordova && process.platform === 'win32' && navigator.userAgent.indexOf('Windows NT 5.1') >= 0)
		$rootScope.$emit('Local/ShowAlert', "Windows XP is not supported", 'fi-alert', function() {
			process.exit();
		});
	
    $scope.agree = function(noWallet) {
      if (isCordova) {
        window.plugins.spinnerDialog.show(null, gettextCatalog.getString('Loading...'), true);
      }
      $scope.loading = true;

      // 点击配置数据库存储信息(全节点/轻节点？)页面continue后的响应函数
      if (!isCordova) {
        self.wallet_type = 'light'
        var bLight = (self.wallet_type === 'light');	//是否轻节点
        var fs = require('fs' + '');
        var desktopApp = require('luxalpacore/desktop_app.js');
        var appDataDir = desktopApp.getAppDataDir();
        var userConfFile = appDataDir + '/conf.json';
        fs.writeFile(userConfFile, JSON.stringify({bLight: bLight}, null, '\t'), 'utf8', function (err) {
          if (err)
            throw Error('failed to write conf.json: ' + err);
          var conf = require('luxalpacore/conf.js');
          if (!conf.bLight)
            throw Error("Failed to switch to light, please restart the app");
          $timeout(function () {
            $scope.$apply();
          });
        });
      }
      

      // 点击欢迎页面上GET STARTED按钮后的响应函数
      $scope.index.splashClick=true;
      if (self.creatingProfile)		//是否完成
        return console.log('already creating profile');
      self.creatingProfile = true;

      //设置状态标识，用于解决创建钱包生成口令后，没有进行口令校验的情况下，关闭app再次打开app可以跳过校验直接进入首页的bug
      storageService.hashaschoosen(1, function (err) {});

      $timeout(function () {
        profileService.create({noWallet: noWallet}, function (err) {
          if (err) {
            self.creatingProfile = false;
            $log.warn(err);
            self.error = err;
            $timeout(function () {
              $scope.$apply();
            });
          }
        });
      }, 100);

      $timeout(function() {
        storageService.setDisclaimerFlag(function(err) {
            $timeout(function() {
                if (isCordova)
                    window.plugins.spinnerDialog.hide();
                // why reload the page?
                //applicationService.restart();
                go.path('createWallet');
            }, 1000);
        });
      }, 100);
    };
    // 点击设备名设置页面上continue按钮后的响应函数
		$scope.saveDeviceName = function () {
			console.log('saveDeviceName: ' + self.deviceName);
			var device = require('luxalpacore/device.js');
			device.setDeviceName(self.deviceName);
			var opts = {deviceName: self.deviceName};

			configService.set(opts, function (err) {
				$timeout(function () {
					if (err)
						self.$emit('Local/DeviceError', err);
					self.bDeviceNameSet = true;
				});
			});
		};
   
    
    $scope.init = function() {
      storageService.getDisclaimerFlag(function(err, val) {
        $scope.lang = uxLanguage.currentLanguage;
        $scope.agreed = val;
        $timeout(function() {
          $scope.$digest();
        }, 1);
      });
    };
  });
