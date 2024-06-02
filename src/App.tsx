import * as React from 'react';
import { extendTheme, ChakraProvider, RadioGroup } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage  from './page/MainPage';
import { UserLayout } from 'Layout';
import { AuthProvider } from 'layout/sidebar/AuthContext';
import Login from 'page/user/Login';
import MyInfo from 'myinfo/MyInfo';
import RaidGroups from 'RaidGroup/RaidGroups';
import RaidSchedule from 'RaidManagement/RaidManagement';
import Main from 'RaidManagement/Main';
const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        textAlign: "center"
      },
    },
  },
  fonts: {
    body: `'Noto Sans KR Variable', sans-serif`,
  },
});


export const App = () => (
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<MainPage />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/myinfo" element={<MyInfo />} />
            <Route path="/raidmanagement" element={<Main />} />
            <Route path="/raidgroup" element={<RaidGroups />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </AuthProvider>
)
