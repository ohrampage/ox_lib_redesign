import { useNuiEvent } from "@/hooks/useNuiEvent";
import { styled } from "@stitches/react";
import { Flex } from "@/components/ui/flex";
import { useEffect, useState } from "react";
import type { ContextMenuProps } from "@/types";
import { ContextButton } from "./ContextButton";
import { fetchNui } from "@/utils/fetchNui";
import { HeaderButton } from "./HeaderButton";

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>("openContext", { id: id, back: true });
};

const Container = styled("div", {
  backgroundColor: "var(--black-a11)",
  backdropFilter: "blur(4px)",
  // color: "var(--white-a11)",
  borderRadius: 8,
  position: "absolute",
  top: "15%",
  right: "25%",
  width: "320px",
  height: "max-content",
  // maxHeight: "580px",
  // overflow: "hidden",
});

const Header = styled(Flex, {
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  backgroundColor: "var(--white-a1)",
  padding: 8,
  borderBottom: "1px solid var(--white-a2)",
});

const TitleContainer = styled("div", {
  borderRadius: "4px",
  flex: "1 85%",
});

const TitleText = styled("p", {
  color: "var(--slate-5)",
  textAlign: "center",
});

const ButtonsContainer = styled("div", {
  // height: '560px',
  height: "100%",
  overflowY: "scroll",
});

const ButtonsFlexWrapper = styled(Flex, {
  gap: "3px",
});

export const ContextMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: "",
    options: { "": { description: "", metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui("closeContext");
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (["Escape"].includes(e.code)) closeContext();
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [visible]);

  useNuiEvent("hideContext", () => setVisible(false));

  useNuiEvent<ContextMenuProps>("showContext", async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <Container>
      {visible && (
        <>
          <Header direction="row" justify="between" align="center">
            {contextMenu.menu && (
              <HeaderButton
                icon="chevron-left"
                iconSize={16}
                handleClick={() => openMenu(contextMenu.menu)}
              />
            )}
            <TitleContainer>
              <TitleText>{contextMenu.title}</TitleText>
            </TitleContainer>
            <HeaderButton
              icon="xmark"
              canClose={contextMenu.canClose}
              iconSize={18}
              handleClick={closeContext}
            />
          </Header>
          <ButtonsContainer>
            <ButtonsFlexWrapper direction="column">
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </ButtonsFlexWrapper>
          </ButtonsContainer>
        </>
      )}
    </Container>
  );
};
