import type { ThemeConfig } from 'antd'
import { cssVariables } from '../styles/variables'

export const theme: ThemeConfig = {
  token: {
    fontFamily: cssVariables.fontFamily,
    colorText: cssVariables.textColor,
    colorBgBase: cssVariables.bgColor,
    colorPrimary: cssVariables.primaryColor,
    colorPrimaryBg: cssVariables.primaryColor,
    colorTextBase: cssVariables.textColor,
    colorTextHeading: cssVariables.primaryColor,
    colorBgContainerDisabled: 'transparent',
    colorBgLayout: cssVariables.bgColor,
    colorSplit: 'transparent',
    fontSize: 14,
    lineHeight: 1.14,
    fontSizeHeading1: 22,
    borderRadius: 8,
    borderRadiusSM: 8,
    borderRadiusLG: 12,
    fontSizeIcon: 14,
    colorBorder: cssVariables.borderColor,
  },
  components: {
    Layout: {
      headerBg: cssVariables.bgColor,
      bodyBg: cssVariables.bgColor,
      footerBg: cssVariables.bgColor,
      headerHeight: 80,
      headerPadding: 0,
      siderBg: cssVariables.primaryColor,
    },
    Button: {
      controlHeight: 40,
      fontSize: 12,
    },
    Input: {
      colorBgContainer: cssVariables.bgColor,
      colorBorder: cssVariables.borderColor,
    },
    Menu: {
      darkItemBg: cssVariables.bgColor,
      darkItemSelectedBg: cssVariables.borderColor,
      darkItemSelectedColor: cssVariables.bgColor,
    },
  },
}
