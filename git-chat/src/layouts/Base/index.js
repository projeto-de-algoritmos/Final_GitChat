import { Grid } from '@chakra-ui/react';
import { Sidebar } from 'src/components/Sidebar';

export const BaseLayout = ({ children }) => {
  return (
    // <Grid>
    //   <S.Main>
    //     <Sidebar />

    //     <S.Content hasPageTitle={!!pageTitle}>{children}</S.Content>
    //   </S.Main>
    // </Grid>

    <Grid templateColumns="300px 1fr" height="100vh">
      <Sidebar />
      {children}
    </Grid>
  );
};
