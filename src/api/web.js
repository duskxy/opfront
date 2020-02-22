import axios from '@/libs/api.request'

export const getWebList = (params) => {
    return axios.request({
        url: 'api/web/',
        method: 'get',
        params
      })
}

export const createWeb = (data) => {
  return axios.request({
      url: 'api/web/',
      method: 'post',
      data
    })
}

export const deleteWeb = (id) => {
  return axios.request({
      url: 'api/web/' + id + '/',
      method: 'delete',
    })
}