import styled from "styled-components";

export const TypeWriterLoading = styled.h1`
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 0.15em solid orange; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: 0.15em; /* Adjust as needed */
  animation: typing ${(props) => props.speed}s steps(40, end),
    blink-caret 0.75s step-end infinite;
  color: white;
`;
