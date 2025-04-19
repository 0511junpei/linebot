import { HStack, StackProps } from "@yamada-ui/react";
import { FC, memo } from "react";

interface HeaderProps extends StackProps {
  isCenter?: boolean;
}

export const Header: FC<HeaderProps> = memo(({ children, ...rest }) => {
  return (
    <HStack borderBottomWidth="1px" gap="sm" h="14" px="md" w="full" {...rest}>
      {children}
    </HStack>
  );
});

Header.displayName = "Header";
