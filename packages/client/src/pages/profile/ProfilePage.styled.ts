import styled from 'styled-components'
import { Form, Typography } from 'antd'
import { cssVariables } from '@/styles/variables'

const { Link: AntLink } = Typography

export const ProfilePageWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  box-sizing: border-box;
`

export const ProfileCollapseWrapper = styled.div`
  width: 600px;
  max-width: 100%;
  overflow: hidden;
  padding: 20px 0;
  box-sizing: border-box;

  .ant-collapse {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ant-collapse .ant-collapse-item {
    border: none;
    border-radius: 16px !important;
    overflow: hidden;
  }

  .ant-collapse .ant-collapse-header {
    padding: 16px;
    align-items: center;
    border-radius: 16px !important;
  }

  .ant-collapse .ant-collapse-content-box {
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
`

export const ProfileLoading = styled.p`
  text-align: center;
  padding: 60px 20px;
`

export const ProfileError = styled.p`
  text-align: center;
  padding: 60px 20px;
  color: ${cssVariables.errorColor};
`

export const ProfileAvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`

export const AvatarOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: ${cssVariables.overlayColor};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;

  span {
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }
`

export const AvatarWrapper = styled.label`
  position: relative;
  display: block;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &:hover ${AvatarOverlay} {
    opacity: 1;
  }
`

export const AvatarFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const ProfileForm = styled(Form)`
  width: 100%;

  .ant-form-item-label {
    text-align: left !important;
    min-width: 180px;
    flex: 0 0 180px;
  }

  .ant-form-item-label > label {
    white-space: nowrap;
  }

  .ant-input,
  .ant-input-password .ant-input {
    border-radius: 8px;
  }
`

export const ProfileSubmitRow = styled(Form.Item)`
  margin-bottom: 0;
  margin-top: 16px;
`

export const WebApiSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
`

export const WebApiStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${cssVariables.bgColor};
`

export const WebApiStatusText = styled.span`
  margin-left: 4px;
`

export const WebApiErrorBlock = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
`

export const GeoResult = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: ${cssVariables.bgColor};
  border: 1px solid ${cssVariables.borderColor};
`

export const GeoCoords = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const GeoMapLink = styled(AntLink)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 4px;
`

export const NotificationSettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${cssVariables.bgColor};
  border: 1px solid ${cssVariables.borderColor};
`

export const NotificationSettingLabel = styled.span`
  font-size: 14px;
`

export const StatusIcon = styled.span<{ $granted: boolean }>`
  color: ${({ $granted }) =>
    $granted ? cssVariables.primaryColor : cssVariables.errorColor};
  font-size: 16px;
`

export const SectionHint = styled.p`
  color: ${cssVariables.labelColor};
  margin: 0 0 4px;
  font-size: 13px;
`
