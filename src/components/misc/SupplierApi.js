import axios from 'axios'
import { config } from '../../Constants'
import { parseJwt } from './Helpers'

export const supplierApi = {
  authenticate,
  signup,
  numberOfUsers,
  numberOfSuppliers,
  getUsers,
  deleteUser,
  getSuppliers,
  deleteSupplier,
  createSupplier,
  searchSuppliers,
  editSupplier,
  getUserMe
}

function authenticate(username, password) {
  return instance.post('/auth/authenticate', { username, password }, {
    headers: { 'Content-type': 'application/json' }
  })
}

function signup(user) {
  return instance.post('/auth/signup', user, {
    headers: { 'Content-type': 'application/json' }
  })
}

function numberOfUsers() {
  return instance.get('/public/numberOfUsers')
}

function numberOfSuppliers() {
  return instance.get('/public/numberOfSuppliers')
}

function getUsers(user, username) {
  const url = username ? `/api/users/${username}` : '/api/users'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function deleteUser(user, username) {
  return instance.delete(`/api/users/${username}`, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function getSuppliers(user, text) {
  const url = text ? `/api/suppliers?text=${text}` : '/api/suppliers'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function deleteSupplier(user, supplierId) {
  return instance.delete(`/api/suppliers/${supplierId}`, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function createSupplier(user, supplier) {
  return instance.post('/api/suppliers', supplier, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(user)
    }
  })
}

function searchSuppliers(user, description,reference, status) {
  const params = new URLSearchParams();
  if (description) params.append('description', description);
  if(reference) params.append('reference', reference);
  if (status) params.append('status', status);
  const url = `/api/suppliers/search?${params.toString()}`;
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  });
}

function getUserMe(user) {
  return instance.get('/api/users/me', {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function editSupplier(user, supplierId, updatedSupplier) {
  return instance.put(`/api/suppliers/${supplierId}`, updatedSupplier, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(user)
    }
  })
}


// -- Axios

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