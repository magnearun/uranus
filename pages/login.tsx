// auth.tsx
import React, { FC } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../src/firebase/clientApp';
import { getAuth, signOut } from '@firebase/auth';
import styled from '@emotion/styled';
import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from 'components/FormInput';
import Link from 'src/Link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

const auth = getAuth(firebase.app());

export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

export const OauthMuiLink = styled(MuiLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f6f7;
  border-radius: 1;
  padding: 0.6rem 0;
  column-gap: 1rem;
  text-decoration: none;
  color: #393e45;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #fff;
    box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
  }
`;

// 👇 Login Schema with Zod
const loginSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string().min(1, 'Password is required'),
});

type ILogin = TypeOf<typeof loginSchema>;

const LoginPage: FC = () => {
  const router = useRouter();
  const defaultValues: ILogin = {
    email: '',
    password: '',
  };

  const methods = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<ILogin> = (values: ILogin) => {
    console.log(values);
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push('/');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: '100%', height: '100%' }}
      >
        <Grid
          item
          sx={{ maxWidth: '70rem', width: '100%', backgroundColor: '#fff' }}
        >
          <FormProvider {...methods}>
            <Grid
              container
              sx={{
                boxShadow: { sm: '0 0 5px #ddd' },
                py: '6rem',
                px: '1rem',
              }}
            >
              <Grid
                item
                container
                justifyContent="center"
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: '45rem' },
                  marginInline: 'auto',
                }}
              >
                <Grid item xs={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ paddingRight: { sm: '3rem' } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{ textAlign: 'center', mb: '1.5rem' }}
                    >
                      Log into your account
                    </Typography>

                    <FormInput
                      label="Enter your email"
                      type="email"
                      name="email"
                      focused
                      required
                    />
                    <FormInput
                      type="password"
                      label="Password"
                      name="password"
                      required
                      focused
                    />

                    <LoadingButton
                      loading={false}
                      type="submit"
                      variant="contained"
                      sx={{
                        py: '0.8rem',
                        mt: 2,
                        width: '80%',
                        marginInline: 'auto',
                      }}
                    >
                      Login
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
