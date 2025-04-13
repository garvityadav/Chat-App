import styled from "styled-components";

export const SingleChatStyle = styled.div<{
  $backgroundColor?: string;
  $borderRadius: string;
  $order: string;
  $textAlign: string;
}>`
  background-color: ${(props) => props.$backgroundColor || "grey"};
  border-radius: ${(props) => props.$borderRadius};
  padding: 10px 15px;
  width: 40%;
  height: auto;
  margin: 10px 10px;
  text-align: ${(props) => props.$textAlign};
  order: ${(props) => props.$order};
`;
