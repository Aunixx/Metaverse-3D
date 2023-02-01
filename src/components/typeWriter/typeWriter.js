import styled from "styled-components";

export const TypeWriterLoading = styled.h1`
  color: #fff;
  font-family: monospace;
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: 0.15em; /* Adjust as needed */
  animation: typing 3s steps(50, end), blink-caret 0.1s step-end infinite;
  width: 1000px;
  margin: 0 auto;
  text-align: center;
`;
