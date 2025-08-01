import { styled } from "@stitches/react";
import { LibIcon } from "@/components/icon/LibIcon";

interface Props {
  icon: string;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const Button = styled("button", {
  display: "flex",
  borderRadius: "4px",
  flex: "1 15%",
  // alignSelf: "stretch",
  height: "auto",
  textAlign: "center",
  justifyContent: "center",
  alignContent: "center",
  padding: "2px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
});

export const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  return (
    <Button disabled={canClose === false} onClick={handleClick}>
      <LibIcon icon={icon} css={{ fontSize: iconSize }} />
    </Button>
  );
};
