import {Box, Flex, Image, Text} from "@chakra-ui/react";
interface googleLoginProps {
    onSuccess: () => void;
}

const GoogleLoginButton: React.FC<googleLoginProps> = ({ onSuccess }) => {
  const BASE_URL = `https://loaschedule.site`;
  const googleURL = `${BASE_URL}/login/google`;

  return (
    <Box position={"relative"}>
      <Flex justifyContent={"center"}>
        <Flex cursor={"pointer"} onClick={() => window.location.replace(googleURL)}>
          <Text
            position={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%, -50%)"}
            color={"black"}
            fontWeight={"bold"}
            fontSize={"xl"}
          >
            구글 로그인
          </Text>
          <Image alt={"googleLogin"} src={"/GoogleLoginIcon.png"} />
        </Flex>
      </Flex>
    </Box>
  );
};
export default GoogleLoginButton;