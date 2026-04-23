import styled from 'styled-components'

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 16px;
  width: 100%;
`

export const Comments = styled.div`
  max-height: 40vh;
  overflow-y: auto;
  margin-bottom: 16;
`
