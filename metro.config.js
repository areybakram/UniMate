// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');
 
// const config = getDefaultConfig(__dirname)
 
// module.exports = withNativeWind(config, { input: './global.css' })

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Add .xlsx as a supported asset
config.resolver.assetExts.push("xlsx");

module.exports = withNativeWind(config, { input: "./global.css" });
