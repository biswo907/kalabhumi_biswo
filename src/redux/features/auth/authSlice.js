import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

//import axios from 'axios';
import axios from 'react-native-axios';
import {APIURL} from '../../../constants/resource.jsx';
import {fetch} from 'react-native-ssl-pinning';
const apiUrl = APIURL.apiUrl;

export const loginmobile = createAsyncThunk('loginmobile', async data => {
  console.log('loginmobile base64data: ', data);
  try {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'text/plain'},
      body: data,
      sslPinning: {
        certs: ['mycert'],
      },
    };
    const response = await fetch(
      apiUrl + '/allowAll/generate-otp',
      requestOptions,
    );
    const responseData = await response.json();
    console.log('loginmobile response', responseData);
    return responseData;
  } catch (error) {
    console.log('error loginmobile', error);
  }
});

export const login = createAsyncThunk('login', async data => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'text/plain'},
      body: data,
      sslPinning: {
        certs: ['mycert'],
      },
    };
    const response = await fetch(
      apiUrl + '/allowAll/authenticate',
      requestOptions,
    );
    const responseData = await response.json();
    console.log('login response', responseData);
    return responseData;
  } catch (error) {
    console.log('error login', error);
  }
});

export const logout = createAsyncThunk('logout', async token => {
  console.log('logout token: ', token);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: '',
    sslPinning: {
      certs: ['mycert'],
    },
  };
  const response = await fetch(apiUrl + '/sign-off', requestOptions);
  const responseData = await response.json();
  console.log('logout response', responseData);
  return responseData;
});

export const fetchUser = createAsyncThunk('fetchUser', async token => {
  // console.log('fetchUser token: ', token);
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      body: '',
      sslPinning: {
        certs: ['mycert'],
      },
    };
    const response = await fetch(apiUrl + '/user/get-profile', requestOptions);
    const responseData = await response.json();
    // console.log('GetProfile response', responseData);
    return responseData;
  } catch (error) {
    console.log('error Profile', error);
  }
});

export const fetchUserSSS = createAsyncThunk('fetchUser', async token => {
  // console.log('fetchUser token: ', token);
  try {
    // console.log("user in api call: ", data.token);
    const response = await axios({
      method: 'post',
      url: apiUrl + '/user/get-profile',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('get-profile ', response.data);

    return response.data;
  } catch (error) {
    console.log('error ', error);
  }
});

export const getAllState = createAsyncThunk('getAllState', async token => {
  console.log('getAllState token: ', token);
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      sslPinning: {
        certs: ['mycert'],
      },
    };
    const response = await fetch(apiUrl + '/mst/get-states', requestOptions);
    const responseData = await response.json();
    console.log('getAllState response BSRRRRRRRRRRR', responseData);
    return responseData;
  } catch (error) {
    console.log('error getAllState', error);
  }
});

export const getAllStateSSSSS = createAsyncThunk('getAllState', async token => {
  console.log('getAllState token: ', token);
  try {
    // console.log("user in api call: ", data.token);
    const response = await axios({
      method: 'get',
      url: apiUrl + '/mst/get-states',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log('error ', error);
  }
});

export const updateUser = createAsyncThunk('updateUser', async data => {
  try {
    console.log('Update Profile data', data, data.postbase64Data);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
      body: data.postbase64Data,
      sslPinning: {
        certs: ['mycert'],
      },
    };
    const response = await fetch(
      apiUrl + '/user/update-profile',
      requestOptions,
    );
    const responseData = await response.json();
    console.log('Update Profile response', responseData);
    return responseData;
  } catch (error) {
    console.log('error Update Profile', error);
  }
});

export const updateUserDDDDD = createAsyncThunk('updateUser', async data => {
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl + '/user/update-profile',
      data: data.postbase64Data,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('error ', error);
  }
});

export const saveReview = createAsyncThunk('saveReview', async data => {
  console.log('JJJJJJJJJ', data);
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
      body: data.postbase64Data,
      sslPinning: {
        certs: ['mycert'],
      },
    };
    const response = await fetch(apiUrl + '/rating/save', requestOptions);
    const responseData = await response.json();
    console.log('Save Review response', responseData);
    return responseData;
  } catch (error) {
    console.log('error Save Review', error);
  }
});

export const saveReviewSSSS = createAsyncThunk('saveReview', async data => {
  try {
    const response = await axios({
      method: 'post',
      url: apiUrl + '/rating/save',
      body: data.postbase64Data,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('error ', error);
  }
});

const initialState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // saveLogin
    saveLogin: (state, action) => {
      state.signin = action.payload;
    },

    deleteLogin: (state, action) => {
      state.signin = null;
    },
    saveUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      // console.log("login payoad: ", action.payload);

      state.login = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      // console.log("error payoad: ", action.payload);
      // state.login = action.payload
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      // console.log("logout payoad: ", action.payload);
      // state.login = action.payload
    });
    builder.addCase(logout.rejected, (state, action) => {
      // console.log("logout error payoad: ", action.payload);
      // state.login = action.payload
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      // console.log("fetch user payload: ", action.payload);

      state.user = action.payload;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      // console.log("fetchUser error payload: ", action.payload);
      // state.login = action.payload
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      // console.log("updateUser payload: ", action.payload);

      state.user = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      // console.log("updateUser error payload: ", action.payload);
      // state.login = action.payload
    });
  },
});

// export const { saveLogin, deleteLogin, saveUser } = authSlice.actions;
export default authSlice.reducer;
