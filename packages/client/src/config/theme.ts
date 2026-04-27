import type { ThemeConfig } from 'antd'
import { cssVariables } from '@/styles/variables'

export const theme: ThemeConfig = {
  token: {
    fontFamily: cssVariables.fontFamily,
    colorText: cssVariables.textColor,
    colorBgBase: cssVariables.bgColor,
    colorPrimary: cssVariables.primaryColor,
    colorPrimaryBg: cssVariables.primaryColor,
    colorTextBase: cssVariables.textColor,
    colorTextHeading: cssVariables.primaryColor,
    colorTextDescription: cssVariables.placeholder,
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
      headerBg: cssVariables.bgContainerLight,
      bodyBg: 'transparent',
      footerBg: cssVariables.bgContainerLight,
      headerHeight: 80,
      headerPadding: 0,
      siderBg: cssVariables.primaryColor,
    },
    Button: {
      controlHeight: 40,
      controlHeightSM: 28,
      fontSize: 12,
    },
    Input: {
      colorBgContainer: cssVariables.bgColor,
      colorBorder: cssVariables.borderColor,
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: cssVariables.borderColor,
      darkItemSelectedColor: cssVariables.bgColor,
      collapsedWidth: 200,
      activeBarWidth: 200,
    },
    Card: {
      colorBgContainer: 'transparent',
    },
  },
}
