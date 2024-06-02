
import { Flex } from "@chakra-ui/react";
import GoogleLoginButton from "./googleLogin/GoogleLogin";
import { useAuth } from "layout/sidebar/AuthContext";


const Login: React.FC = () => {
  const { setIsLoggedIn } = useAuth();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Flex h={"50vh"} flexDirection={"column"} justifyContent={"center"}>
      <GoogleLoginButton onSuccess={handleLoginSuccess} />
    </Flex>
  );
};

export default Login;
