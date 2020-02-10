<template>
  <div>
  <div class="head-sea">
      <Row>
        <Col span="12"><Input search enter-button placeholder="搜索" style="width: 300px" /></Col>
        <Col span="12" style="text-align:right"><Button type="success">新增用户</Button></Col>
     </Row>
  </div>
     <Table border :columns="columnsUser" :data="userList"></Table>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
    name: 'user',
    data() {
        return {
                 columnsUser: [
                    {
                        title: '用户名',
                        key: 'name'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '角色',
                        key: 'role'
                    },
                    {
                        title: '属组',
                        key: 'group'
                    }
                ],
                userList: []
        }
    },
    methods: {
        handleGetUserList() {
            getUserInfo().then(resp => {
                console.log(resp)
                this.userList = resp.data
            })
        }
    }
}
</script>

<style>
.head-sea {
    margin-bottom: 10px;
}

</style>