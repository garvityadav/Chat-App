import styled from "styled-components";

export const MainPageWrapper = styled.div`
  display: grid;
  border: 2px solid black;
  grid-template-columns: 1fr 3fr;
  gap: 16px;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 16px;
  /* overflow: hidden; */
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;
