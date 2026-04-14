// const { getDefaultConfig } = require("expo/metro-config");

// const config = getDefaultConfig(__dirname);

// module.exports = config;

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Add .xlsx as a supported asset
config.resolver.assetExts.push("xlsx");

// 🚀 Ignore build directories to prevent ENOENT errors on Windows
config.resolver.blockList = [
  /.*\/node_modules\/.*\/build\/.*/,
];

module.exports = withNativeWind(config, { input: "./global.css" });
