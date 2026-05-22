const { withAndroidStyles, AndroidConfig } = require('expo/config-plugins');

function withAndroidAccentColor(config, props = {}) {
  const { accentColor } = props;
  if (!accentColor) return config;

  return withAndroidStyles(config, (cfg) => {
    const parent = AndroidConfig.Styles.getAppThemeGroup();
    cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
      add: true,
      name: 'colorAccent',
      value: accentColor,
      parent,
    });
    cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
      add: true,
      name: 'colorControlActivated',
      value: accentColor,
      parent,
    });
    return cfg;
  });
}

module.exports = withAndroidAccentColor;
