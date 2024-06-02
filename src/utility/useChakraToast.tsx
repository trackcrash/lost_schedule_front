import { useToast } from "@chakra-ui/react";

interface ChakraToastProps {
  title: string;
  description?: string;
  status: "info" | "warning" | "success" | "error" | "loading" | undefined;
}

const useChakraToast = () => {
  const toast = useToast();
  const showToast = ({ title, description, status }: ChakraToastProps) => {
    if (title && status) {
      const toastOptions = {
        title: title,
        description: description,
        status: status,
        duration: 5000,
        isClosable: true,
      };

      toast(toastOptions);
    }
  };

  return showToast;
};

export default useChakraToast;
