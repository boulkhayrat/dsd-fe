import axios from 'axios'
import { config } from '../../Constants'
import { parseJwt } from './Helpers'

export const uploadApi = {
    uploadPDF,
}

// Upload PDF function
function uploadPDF(user, file) {
  const url = '/api/upload/pdf'
  const formData = new FormData();
  formData.append('file', file);
  
  return instance.post(url, formData, {
    headers: {
      'Authorization': bearerAuth(user),
      'Content-Type': 'multipart/form-data',
    }
  })
}

// -- Axios instance
const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.request.use(function (config) {
  // If token is expired, redirect user to login
  if (config.headers.Authorization) {
    const token = config.headers.Authorization.split(' ')[1]
    const data = parseJwt(token)
    if (Date.now() > data.exp * 1000) {
      window.location.href = "/login"
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// -- Helper functions
function bearerAuth(user) {
  return `Bearer ${user.accessToken}`
}
