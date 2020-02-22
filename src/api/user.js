import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'login/',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'api/user/info/',
    params: {
      token
    },
    method: 'get'
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: 'api/user/',
    method: 'get',
    params
  })
}

export const createUser = (data) => {
  return axios.request({
    url: 'api/user/',
    method: 'post',
    data
  })
}

export const editUser = (id,data) => {
  return axios.request({
    url: 'api/user/' + id + '/',
    method: 'patch',
    data
  })
}

export const deleteUser = (id) => {
  return axios.request({
    url: 'api/user/' + id + '/',
    method: 'delete',
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
