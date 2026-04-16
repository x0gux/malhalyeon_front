import styled from "@emotion/styled";
import font from "@/packages/design-system/src/font";

const Button = ({text, onClick,type}: {type : 'primary' | 'secondary',text: string, onClick: () => void}) => {
    if(type == 'primary'){
        return(
            <PrimaryButton onClick={onClick}>
                {text}
            </PrimaryButton>
        )
    }else{
        return(
            <SecondaryButton onClick={onClick}>
                {text}
            </SecondaryButton>
        )
    }

}

export default Button;


const PrimaryButton = styled.button`
  ${font.Btn1};
  width: 100%;
  padding : 3%;
  background-color: #FF4D4D;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.8;
  }
`;

const SecondaryButton = styled.button`
  ${font.Btn1};
  width: 100%;
  padding : 3%;
  background-color: #ffffff;
  color: #FF4D4D;
  border: 1px solid #FF4D4D;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: #fff0f0;
  }
`;