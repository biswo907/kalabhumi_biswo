#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <TrustKit/TrustKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSDictionary *trustKitConfig =
    @{
      kTSKSwizzleNetworkDelegates: @YES,
      kTSKPinnedDomains: @{
          @"sslpinning.com" : @{
              kTSKIncludeSubdomains: @YES,
              kTSKEnforcePinning: @YES,
              kTSKDisableDefaultReportUri: @YES,
              kTSKPublicKeyHashes : @[
                @"4a6cPehI7OG6cuDZka5NDZ7FR8a60d3auda+sKfg4Ng=",
                @"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
              ],
          },
      }};
    [TrustKit initSharedInstanceWithConfiguration:trustKitConfig];
  
  
  
  self.moduleName = @"KalabhoomiApp";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
