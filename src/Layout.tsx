import { Flex, Box} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "layout/sidebar/Sidebar";
import { useState } from "react";
export function UserLayout() {
    const [isOpen, setIsOpen] = useState(false);
    return (
    <>
    <Sidebar onClose={() => setIsOpen(false)} />
    <Flex flexDir={"row"} justifyContent={"center"} style={{ marginLeft: isOpen ? '0' : '240px' }}>
            <Box flex={"1"} maxW={"100%"}>
                <Outlet />
            </Box>
      </Flex>
    </>
  );
}