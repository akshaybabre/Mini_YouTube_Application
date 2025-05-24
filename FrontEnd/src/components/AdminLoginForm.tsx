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
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AdminLoginData {
  name: string;
  password: string;
}

const initialValues: AdminLoginData = {
  name: '',
  password: ''
};

const validationSchema = yup.object({
  name: yup.string().required('Admin ID is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[0-9]/, 'Include at least one number')
    .required('Password is required')
});

const AdminLoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (
    values: AdminLoginData,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/admin/login', values);
      const { token, admin } = response.data;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('admin', JSON.stringify(admin));

      resetForm();
      navigate('/adminDash');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: '#f7f9fc',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" mb={2} color="primary">
            Admin Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
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
                    label="Admin ID"
                    error={touched.name && !!errors.name}
                    helperText={<ErrorMessage name="name" />}
                    fullWidth
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
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePassword}
                                edge="end"
                                aria-label="toggle password visibility"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  </Field>

                  <Button type="submit" variant="contained" color="primary" size="large">
                    Login as Admin
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLoginForm;