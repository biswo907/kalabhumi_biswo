import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'react-native-axios';
//const apiUrl = 'http://209.97.136.18:8080/kalabhoomi/api';
import {APIURL} from '../../../constants/resource.jsx';
import {fetch} from 'react-native-ssl-pinning';
const apiUrl = APIURL.apiUrl;

export const fetchDataByQrcode = createAsyncThunk(
  'fetchDataByQrcode',
  async data => {
    console.log('fetchUser token: ', data.token);
    console.log('data.postbase64Data: ', data.postbase64Data);
    const response = await axios({
      method: 'post',
      url: apiUrl + '/qr/fetch-data',
      data: data.postbase64Data,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
    });
    console.log('resqr ', response.data);
    return response.data;
  },
);

export const fetchSectionData = createAsyncThunk(
  'fetchSectionData',
  async data => {
    console.log('fetchUser token: ', data.token);
    console.log('data.postbase64Data: ', data.postbase64Data);
    const response = await axios({
      method: 'post',
      url: apiUrl + '/qr/gallery-section-artifacts',
      data: data.postbase64Data,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
    });
    console.log('resqr ', response.data);
    return response.data;
  },
);

export const fetchArtifactData = createAsyncThunk(
  'fetchArtifactData',
  async data => {
    console.log('artifact_token: ', data.token);
    console.log('artifact_postbase64Data: ', data.postbase64Data);
    const response = await axios({
      method: 'post',
      url: apiUrl + '/qr/get-artifact',
      data: data.postbase64Data,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
    });
    console.log('resqr ', response.data);
    return response.data;
  },
);

export const fetchRatingDataByQrcode = createAsyncThunk(
  'fetchRatingDataByQrcode',
  async data => {
    console.log('fetchUser Ajay token......... ', data.token);
    console.log('data. Ajay postbase64Data.......', data.postbase64Data);
    const response = await axios({
      method: 'post',
      url: apiUrl + '/rating/list',
      data: data.postbase64Data,
      headers: {
        'Content-Type': 'text/plain',
        Authorization: `Bearer ${data.token}`,
      },
    });
    console.log('resqr ', response.data);
    return response.data;
  },
);
// export const fetchAllGalleryData = createAsyncThunk(
//   'fetchAllGalleryData',
//   async data => {
//     // console.log('fetchUser Ajay token......... ', data.token);
//     // console.log('data. Ajay postbase64Data.......', data.postbase64Data);
//     const response = await axios({
//       method: 'post',
//       url: apiUrl + '/mst/all-gallery',
//       headers: {
//         'Content-Type': 'text/plain',
//         Authorization: `Bearer ${data.token}`,
//       },
//     });
//     console.log('alldata ', response.data);
//     return response.data;
//   },
// );
export const fetchAllGalleryData = createAsyncThunk(
  'fetchAllGalleryData',
  async token => {
    // console.log('getAllState token: ', token);
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
      const response = await fetch(apiUrl + '/mst/all-gallery', requestOptions);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log('error all data', error);
    }
  },
);
const initialState = {};

const qrcodeSlice = createSlice({
  name: 'qrcode',
  initialState,
  reducers: {},
  extraReducers: builder => {},
});

export default qrcodeSlice.reducer;
