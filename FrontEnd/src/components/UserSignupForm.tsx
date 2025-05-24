// frontend/src/components/UserSignupForm.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { useAuth } from '../services/AuthContext';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const initialValues: FormData = {
  name: '',
  email: '',
  password: '',
};

const validationSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[0-9]/, 'Include at least one number')
    .required('Password is required'),
});

const SignupForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, googleAuth, error, loading } = useAuth();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (
    values: FormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    await signup(values.email, values.password, values.name);
    if (!error) {
      resetForm();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: '#f7f9fc',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" mb={2} color="primary">
            Sign Up
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Typography>Loading...</Typography>
            </Box>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form noValidate>
                <Stack spacing={2}>
                  <Field
                    name="name"
                    as={TextField}
                    label="Name"
                    error={touched.name && !!errors.name}
                    helperText={<ErrorMessage name="name" />}
                    fullWidth
                    disabled={loading}
                  />
                  <Field
                    name="email"
                    as={TextField}
                    label="Email"
                    type="email"
                    error={touched.email && !!errors.email}
                    helperText={<ErrorMessage name="email" />}
                    fullWidth
                    disabled={loading}
                  />
                  <Field name="password">
                    {({ field }: any) => (
                      <TextField
                        {...field}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={touched.password && !!errors.password}
                        helperText={<ErrorMessage name="password" />}
                        fullWidth
                        disabled={loading}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePassword}
                                edge="end"
                                aria-label="toggle password visibility"
                                disabled={loading}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Field>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                  >
                    Sign Up
                  </Button>

                  <Typography variant="body2" mt={1}>
                    — or —
                  </Typography>

                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={googleAuth}
                    disabled={loading}
                  >
                    Sign up with Google
                  </Button>

                  <Typography variant="body2" mt={2}>
                    Already have an account? <Link to="/login">Login</Link>
                  </Typography>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupForm;