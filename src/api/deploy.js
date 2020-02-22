import axios from '@/libs/api.request'

export const getDeployList = (params) => {
    return axios.request({
        url: 'api/deploy/',
        method: 'get',
        params
      })
}

export const createDeploy = (data) => {
  return axios.request({
      url: 'api/deploy/',
      method: 'post',
      data
    })
}

export const editDeploy = (id,data) => {
  return axios.request({
    url: 'api/deploy/' + id + '/',
    method: 'patch',
    data
  })
}

export const deleteDeploy = (id) => {
  return axios.request({
      url: 'api/deploy/' + id + '/',
      method: 'delete',
    })
}

export const getTagList = (params) => {
  return axios.request({
    url: 'api/tag/info/',
    method: 'get',
    params
  })
}