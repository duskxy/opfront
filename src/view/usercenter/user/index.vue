<template>
  <div>
    <div class="head-sea">
      <Row>
        <Col span="12">
          <Input
            v-model="getParams.search"
            search
            enter-button
            placeholder="搜索"
            style="width: 300px"
            @on-change="handleGetUserList"
            @on-click="handleGetUserList"
            @on-enter="handleGetUserList"
          />
        </Col>
        <Col span="12" style="text-align:right">
          <Button type="success" @click="addUserModel">新增用户</Button>
        </Col>
      </Row>
    </div>
    <Table border :columns="columnsUser" :data="userList"></Table>
    <div class="page">
      <Page
        :total="total"
        show-sizer
        :current="getParams.page"
        @on-change="pageChange"
        @on-page-size-change="sizeChange"
      />
    </div>
    <Modal
      v-model="addUser"
      title="新增用户"
      width="700px"
      @on-ok="handleCreateUser"
      @on-cancel="cancel"
    >
      <Form ref="formUserCreate" :model="formUserCreate" :rules="ruleCustom" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="用户名：" prop="username">
              <Input type="text" v-model="formUserCreate.username"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱：" prop="email">
              <Input type="text" v-model="formUserCreate.email"></Input>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span="12">
            <FormItem label="密码：" prop="password">
              <Input type="password" v-model="formUserCreate.password"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="属组：" prop="groups">
              <Select v-model="formUserCreate.groups[0]" style="width:200px">
                <Option
                  v-for="item in groupsList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span="12">
            <FormItem label="角色：" prop="role">
              <Select v-model="formUserCreate.role" style="width:200px">
                <Option
                  v-for="item in roleList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上级：">
              <Select v-model="formUserCreate.leader" style="width:200px">
                <Option
                  v-for="item in userDetailList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <FormItem label="系统身份：">
          <CheckboxGroup v-model="createSysaccount">
            <Checkbox label="is_active">已激活</Checkbox>
            <Checkbox label="is_superuser">管理员</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model="editUser"
      title="修改用户"
      width="700px"
      @on-ok="handleEditUser"
      @on-cancel="cancel"
    >
      <Form ref="formUserEdit" :model="formUserEdit" :rules="ruleCustom" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="用户名：" prop="username">
              <Input type="text" v-model="formUserEdit.username"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱：" prop="email">
              <Input type="text" v-model="formUserEdit.email"></Input>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span="12">
            <FormItem label="密码：" prop="password">
              <Input type="password" v-model="formUserEdit.password"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="属组：" prop="groups">
              <Select v-model="formUserEdit.groups[0]" style="width:200px">
                <Option
                  v-for="item in groupsList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span="12">
            <FormItem label="角色：" prop="role">
              <Select v-model="formUserEdit.role" style="width:200px">
                <Option
                  v-for="item in roleList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上级：">
              <!-- <Select v-model='formUserEdit.leader' style='width:200px'> -->
              <Select v-model="formUserEdit.leader" style="width:200px">
                <Option
                  v-for="item in userDetailList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <FormItem label="系统身份：">
          <CheckboxGroup v-model="updateSysaccount">
            <Checkbox label="is_active">已激活</Checkbox>
            <Checkbox label="is_superuser">管理员</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  getUserInfo,
  getUserList,
  createUser,
  editUser,
  deleteUser
} from "@/api/user";
import { getGroupList } from "@/api/group";
import { Modal, Button } from "iview";
export default {
  name: "user",
  components: { Modal },
  data() {
    return {
      formUserCreate: {
        username: "",
        email: "",
        groups: [],
        role: "test",
        leader: "",
        password: ""
      },
      baseAuth: ["is_active", "is_superuser"],
      createSysaccount: ["is_active"],
      updateSysaccount: [],
      formUserEdit: {
        username: "",
        email: "",
        groups: [],
        role: "",
        leader: "",
        password: ""
      },
      ruleCustom: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }]
      },

      roleList: [
        {
          value: "developer",
          label: "研发"
        },
        {
          value: "developer_manager",
          label: "研发经理"
        },
        {
          value: "developer_supremo",
          label: "研发总监"
        },
        {
          value: "test",
          label: "测试"
        },
        {
          value: "sa",
          label: "系统管理员"
        }
      ],
      addUser: false,
      editUser: false,
      total: 1,
      getParams: {
        search: "",
        page: 1,
        pagesize: 10
      },
      userDetailList: [],
      groupsList: [],
      getMaxParams: {
        page: 1,
        pagesize: 10000,
        search: ""
      },
      columnsUser: [
        {
          title: "用户名",
          render: (h, params) => {
            return h("Tag", {}, params.row.username);
          }
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "角色",
          render: (h, params) => {
            return h("span", {}, params.row.role.rules);
          }
        },
        {
          title: "上级",
          render: (h, params) => {
            return h("span", {}, params.row.leader.leaders);
          }
        },
        {
          title: "属组",
          render: (h, params) => {
            return h("span", {}, params.row.groups.name);
          }
        },
        {
          title: "操作",
          key: "active",
          render: (h, params) => {
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.editUser = true;
                      this.handleGetGroupList();
                      this.formUserEdit.id = params.row.id;
                      this.formUserEdit.username = params.row.username;
                      this.formUserEdit.email = params.row.email;
                      this.formUserEdit.groups =
                        JSON.stringify(params.row.groups) == "{}"
                          ? []
                          : [params.row.groups.id];
                      this.formUserEdit.role = params.row.role.id;
                      this.formUserEdit.leader = params.row.leader.id;
                      this.formUserEdit.password = params.row.password;
                      let sysaccount = [];
                      if (params.row.is_superuser == true) {
                        sysaccount.push("is_superuser");
                      }
                      if (params.row.is_active == true) {
                        sysaccount.push("is_active");
                      }
                      this.updateSysaccount = sysaccount;
                    }
                  }
                },
                "修改"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "你确定要删除吗?"
                  },
                  on: {
                    "on-ok": () => {
                      this.handDeleteUser(params.row.id, params.row.username);
                    }
                  }
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "warning",
                        size: "small"
                      }
                    },
                    "删除"
                  )
                ]
              )
            ]);
          }
        }
      ],
      userList: []
    };
  },
  mounted() {
    this.handleGetUserList();
    this.handleGetGroupList();
  },

  methods: {
    notice(title, msg) {
      this.$Notice.success({
        title: title,
        duration: 6,
        desc: msg
      });
    },

    addUserModel() {
      this.handleGetGroupList();
      this.addUser = true;
    },

    pageChange(page) {
      this.getParams.page = page;
      this.handleGetUserList();
    },

    sizeChange(size) {
      this.getParams.pagesize = size;
      this.handleGetUserList();
    },

    handleUserDetailList(data) {
      let objdata = [];
      for (let i in data) {
        objdata.push({
          value: data[i].id,
          label: data[i].username
        });
      }
      this.userDetailList = objdata;
      this.formUserCreate.leader = objdata.length > 0 ? objdata[0].value : "";
    },

    handleGetUserList() {
      getUserList(this.getParams).then(resp => {
        this.total = resp.data.count;
        this.userList = resp.data.results;
        this.handleUserDetailList(resp.data.results);
      });
    },

    getSysaccount(sysaccount, data) {
      for (let auth in this.baseAuth) {
        data[this.baseAuth[auth]] = 0;
      }
      for (let auth in sysaccount) {
        data[sysaccount[auth]] = 1;
      }
      return data;
    },

    handleCreateUser() {
      this.$refs.formUserCreate.validate(valid => {
        if (!valid) {
          return false;
        }
        let sysaccount = this.createSysaccount;
        let data = this.formUserCreate;
        data = this.getSysaccount(sysaccount, data);
        createUser(data).then(resp => {
          let httpstatus = resp.status;
          if (httpstatus == 201) {
            let title = "服务器提示";
            let msg = "用户 " + resp.data.username + " 创建成功";
            this.notice(title, msg);
          }
          this.handleGetUserList();
          this.$refs.formUserCreate.resetFields();
        });
      });
    },

    handDeleteUser(id, name) {
      deleteUser(id).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 204) {
          let title = "服务器提示";
          let msg = "用户 " + name + " 删除成功";
          this.notice(title, msg);
        }
        let totalPage = Math.ceil((this.total - 1) / this.getParams.pagesize); // 总页数
        this.getParams.page =
          this.getParams.page > totalPage ? totalPage : this.getParams.page;
        this.getParams.page = this.getParams.page < 1 ? 1 : this.getParams.page;
        this.handleGetUserList();
      });
    },

    handleEditUser() {
      let sysaccount = this.updateSysaccount;
      let data = this.formUserEdit;
      data = this.getSysaccount(sysaccount, data);
      editUser(this.formUserEdit.id, data).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 200) {
          let title = "服务器提示";
          let msg = "用户 " + resp.data.username + " 修改成功";
          this.notice(title, msg);
        }
        this.handleGetUserList();
      });
    },
    formatGroup(data) {
      let grouplist = [];
      data.map(item => {
        grouplist.push({
          label: item.name,
          value: item.id
        });
      });
      this.groupsList = grouplist;
      this.formUserCreate.groups =
        grouplist.length > 0 ? [grouplist[0].value] : [];
    },
    handleGetGroupList() {
      getGroupList().then(resp => {
        this.formatGroup(resp.data.results);
      });
    },

    cancel() {
      // this.$refs.formUserCreate.resetFields();
      this.$Message.info("Clicked cancel");
    }
  }
};
</script>

<style>
.head-sea {
  margin-bottom: 10px;
}
.page {
  margin-top: 10px;
}
</style>