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
            @on-change="handleGetDeployList"
            @on-click="handleGetDeployList"
            @on-enter="handleGetDeployList"
          />
        </Col>
        <Col span="12" style="text-align:right">
          <Button type="success" @click="addDeployModel">新增发布</Button>
        </Col>
      </Row>
    </div>
    <Table border :columns="columnsDeploy" :data="deployList"></Table>
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
      v-model="addDeploy"
      title="新增发布"
      width="700px"
      @on-ok="handleCreateDeploy"
      @on-cancel="cancel"
    >
      <Form ref="formDeployCreate" :model="formDeployCreate" :rules="ruleCustom" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="项目名：" prop="projectname">
              <Select
                v-model="formDeployCreate.projectname"
                style="width:200px"
                ref="projectname"
                @on-change="selectProjectChange"
              >
                <Option
                  v-for="item in projectList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="WEB：" prop="webname">
              <Select
                v-model="formDeployCreate.webname"
                style="width:200px"
                :label-in-value="true"
                ref="webname"
                @on-change="selectWebChange"
              >
                <Option
                  v-for="item in webList"
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
            <FormItem label="版本tag：" prop="version">
              <Select
                v-model="formDeployCreate.version"
                style="width:200px"
                :label-in-value="true"
                ref="version"
              >
                <Option
                  v-for="item in tagList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="版本描述：" prop="info">
              <Input type="text" v-model="formDeployCreate.info" style="width:200px"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="editDeploy"
      title="流程"
      width="600px"
      @on-ok="handleEditDeploy"
      @on-cancel="cancel"
    >
    <div class="dep-con">
      <p>当前正在进行第 {{ current + 1 }} 步</p>
        <Divider />
      <Steps :current="current">
        <Step title="待审核"></Step>
        <Step title="待上线"></Step>
        <Step title="已上线"></Step>
      </Steps>
      <!-- <Button type="primary" @click="next">Next step</Button> -->
        <Divider />
      <Form ref="formDeployEdit" :model="formDeployEdit" :rules="ruleCustom" :label-width="80">
        <FormItem label="项目名：" prop="projectname">
          <Input type="text" v-model="formDeployEdit.projectname" style="width:260px" disabled></Input>
        </FormItem>
                <FormItem label="web：" prop="webname">
          <Input type="text" v-model="formDeployEdit.webname" style="width:260px" disabled></Input>
        </FormItem>
        </FormItem>
                <FormItem label="申请人：" prop="applicant">
          <Input type="text" v-model="formDeployEdit.applicant" style="width:260px" disabled></Input>
        </FormItem>
                        <FormItem label="发布版本：" prop="version">
          <Input type="text" v-model="formDeployEdit.version" style="width:260px" disabled></Input>
        </FormItem>
                                <FormItem label="备注：" prop="desc">
          <Input type="text" v-model="formDeployEdit.info" style="width:260px" disabled></Input>
        </FormItem>
      </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getDeployList,
  createDeploy,
  deleteDeploy,
  getTagList,
  editDeploy
} from "@/api/deploy";
import { getProjectList } from "@/api/project";
import { Button } from "iview";
export default {
  name: "deploy",
  data() {
    return {
      getParams: {
        search: "",
        page: 1,
        pagesize: 10,
        statusmin: 2
      },
      total: 1,
      deployList: [],
      projectList: [],
      webList: [],
      tagList: [],
      editDeploy: false,
      addDeploy: false,
      isAble: false,
      current: 1,
      formDeployCreate: {
        id: "",
        projectname: "",
        webname: "",
        version: "",
        info: ""
      },
      formDeployEdit: {
        projectname: "",
        webname: "",
        applicant: "",
        version: "",
        info: "",
        status: ""
      },
      ostatus: [
        { color: "info", desc: "待审核" },
        { color: "primary", desc: "已审核" },
        { color: "success", desc: "已上线" },
        { color: "warning", desc: "已放弃" }
      ],
      cstatus: [
        { color: "info", desc: "审核" },
        { color: "primary", desc: "待上线" },
        { color: "success", desc: "已完成" },
        { color: "success", desc: "放弃" }
      ],
      ruleCustom: {
        // name: [{ required: true, message: "发布名不能为空", trigger: "blur" }]
      },
      columnsDeploy: [
                {
          title: "ID",
          key: "id"},
        {
          title: "项目",
          key: "projectname",
          render: (h, params) => {
            return h("Tag", {}, params.row.projectname.name);
          }
        },
        {
          title: "web",
          key: "webname",
          render: (h, params) => {
            return h("Tag", {}, params.row.webname.name);
          }
        },
        {
          title: "申请人",
          key: "applicant",
          render: (h, params) => {
            return h("span", {}, params.row.applicant.name);
          }
        },
        {
          title: "发布版本",
          key: "version"
        },
        {
          title: "备注",
          key: "info",
          render: (h,params) => {
              return h('span',{},params.row.info.slice(0,6) + '...') 
          },
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: this.ostatus[params.row.status].color,
                    shape: "circle",
                    size: "small"
                  }
                },
                this.ostatus[params.row.status].desc
              )
            ]);
          }
        },
        {
          title: "申请时间",
          key: "apply_time",
          render: (h,params) => {
            return h('span',{},params.row.apply_time.moment())
          }
        },
        {
          title: "操作",
          width: 150,
          align: "center",
          render: (h, params) => {
           if (params.row.status == 3) {
                return 
                // h("div",[h(Button,{
                //   props: {
                //     type: this.cstatus[params.row.status].color,
                //     size: "small"
                //   },
                // },this.cstatus[params.row.status].desc)])
              }
            if (params.row.status == 2) {
                return 
                // h("div",[h(Button,{
                //   props: {
                //     type: this.cstatus[params.row.status].color,
                //     size: "small"
                //   },
                // },this.cstatus[params.row.status].desc)])
              }
            return h("div", [
              h(
                Button,
                {
                  props: {
                    type: this.cstatus[params.row.status].color,
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editDeploy = true;
                      this.current = params.row.status;
                      this.formDeployEdit.id = params.row.id
                      this.formDeployEdit.projectname = params.row.projectname.name;
                      this.formDeployEdit.webname = params.row.webname.name
                      this.formDeployEdit.applicant = params.row.applicant.name
                      this.formDeployEdit.version = params.row.version
                      this.formDeployEdit.info = params.row.info
                      this.formDeployEdit.status = params.row.status
                    }
                  }
                },
                this.cstatus[params.row.status].desc
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
                      this.handDeleteDeploy(params.row.id, params.row.name);
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
                    "取消"
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.handleGetDeployList();
    this.handleGetProjectList();
  },
  methods: {
    notice(title, msg) {
      this.$Notice.success({
        title: title,
        duration: 6,
        desc: msg
      });
    },
    addDeployModel() {
      this.addDeploy = true;
      this.handleGetProjectList();
    },

    handleGetDeployList() {
      getDeployList(this.getParams).then(resp => {
        this.total = resp.data.count;
        this.deployList = resp.data.results;
      });
    },
    handleCreateDeploy() {
      this.$refs.formDeployCreate.validate(valid => {
        if (!valid) {
          return false;
        }
      });
      let data = this.formDeployCreate;
      createDeploy(data).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 201) {
          let title = "服务器提示";
          let msg = "发布 " + resp.data.name + " 创建成功";
          this.notice(title, msg);
        }
        this.handleGetDeployList();
        this.$bus.$emit("changeDeployData");
        this.$refs.formDeployCreate.resetFields();
      });
    },
    handDeleteDeploy(id) {
      deleteDeploy(id).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 204) {
          // let title = "服务器提示";
          // let msg = "用户 " + name + " 删除成功";
          // this.notice(title, msg);
        }
        let totalPage = Math.ceil((this.total - 1) / this.getParams.pagesize); // 总页数
        this.getParams.page =
          this.getParams.page > totalPage ? totalPage : this.getParams.page;
        this.getParams.page = this.getParams.page < 1 ? 1 : this.getParams.page;
        this.handleGetDeployList();
      });
    },

    formatProject(data, fidata) {
      let projectlist = [];
      let weblist = [];
      data.map(item => {
        projectlist.push({
          value: item.id,
          label: item.name
        });
      });
      data.map(item => {
        item.web.map(subitem => {
          weblist.push({
            id: item.id,
            value: subitem.id,
            label: subitem.name
          });
        });
      });

      this.projectList = projectlist;
      this.webList = weblist.filter(item => {
        return item.id == fidata;
      });
    },

    selectProjectChange(value) {
      this.handleGetProjectList(value);
    },

    selectWebChange(value) {
      let projectname =
        this.projectList.filter(item => {
          return item.value == this.$refs.projectname.value;
        })[0].label || "";
      let projectweb = projectname + value.label;
      let data = { web: value.label };
      getTagList(data).then(resp => {
        this.tagList = resp.data;
      });
    },

    handleGetProjectList(fldata) {
      getProjectList(this.getMaxParams).then(resp => {
        this.formatProject(resp.data.results, fldata);
      });
    },

    handleEditDeploy() {
        const {id,...data} = this.formDeployEdit
        const formdata = {'status':data.status + 1}
        editDeploy(id,formdata).then(resp => {
        this.handleGetDeployList()
        })
    },

    pageChange(page) {
      this.getParams.page = page;
      this.handleGetDeployList();
    },

    sizeChange(size) {
      this.getParams.pagesize = size;
      this.handleGetDeployList();
    },

    cancel() {
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
.dep-con {
  margin-left: 25px;
}
</style>