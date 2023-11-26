import { Box, Container, Typography } from '@mui/material';
// import SvgIcon from '../components/SvgIcon';

const Page404 = () => (
  <>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
        justifyContent: "center"
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "center"
          }}
        >
          <Box sx={{ textAlign: 'center', marginTop: "100px" }}>
            {/* <SvgIcon src="undraw_page_not_found_su7k.svg" /> */}
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            variant="h4"
            marginTop="100px"
          >
            404: The page you are looking for isn’t here
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="subtitle2"
          >
            You either tried some shady route or you came here by mistake.
            Whichever it is, we are working hard to solve the issue.
          </Typography>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page404;
