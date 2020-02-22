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
            @on-change="handleGetWebList"
            @on-click="handleGetWebList"
            @on-enter="handleGetWebList"
          />
        </Col>
        <Col span="12" style="text-align:right">
          <Button type="success" @click="addWebModel">新增WEB</Button>
        </Col>
      </Row>
    </div>
    <Table border :columns="columnsWeb" :data="webList"></Table>
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
      v-model="addWeb"
      title="新增WEB"
      width="500px"
      @on-ok="handleCreateWeb"
      @on-cancel="cancel"
    >
      <Form ref="formWebCreate" :model="formWebCreate" :rules="ruleCustom" :label-width="80">
        <FormItem label="WEB名：" prop="name">
          <Input type="text" v-model="formWebCreate.name"></Input>
        </FormItem>
        <FormItem label="項目：" prop="projectname">
          <Select v-model="formWebCreate.projectname" style="width:200px">
            <Option
              v-for="item in projectList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：" prop="desc">
          <Input type="text" v-model="formWebCreate.desc"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getWebList, createWeb, deleteWeb } from "@/api/web";
import { getProjectList } from "@/api/project";
import { Button } from "iview";
export default {
  name: "web",
  data() {
    return {
      getParams: {
        search: "",
        page: 1,
        pagesize: 10
      },
      total: 1,
      webList: [],
      addWeb: false,
      projectList: [],
      formWebCreate: {
        name: "",
        desc: "",
        projectname: ""
      },
      ruleCustom: {
        name: [{ required: true, message: "WEB名不能为空", trigger: "blur" }]
      },
      getMaxParams: {
        page: 1,
        pagesize: 10000,
        search: ""
      },
      columnsWeb: [
        {
          title: "项目名",
          render: (h, params) => {
            if (Object.keys(params.row.projectname).length == 0) {
              return h("Tag", {})
            } else {
              return h("Tag", {}, params.row.projectname.name);
            }
          }
        },
        {
          title: "WEB名",
          render: (h, params) => {
            return h("Tag", {}, params.row.name);
          }
        },
        {
          title: "备注",
          key: "desc"
        },
        {
          title: "操作",
          width: 150,
          align: "center",
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
                    marginRight: "12px"
                  },
                  on: {
                    click: () => {}
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
                      this.handDeleteWeb(params.row.id, params.row.name);
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
      ]
    };
  },
  mounted() {
    this.handleGetWebList();
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
    handleGetWebList() {
      getWebList(this.getParams).then(resp => {
        this.total = resp.data.count;
        this.webList = resp.data.results;
      });
    },
    handleCreateWeb() {
      this.$refs.formWebCreate.validate(valid => {
        if (!valid) {
          return false;
        }
      });
      let data = this.formWebCreate;
      createWeb(data).then(resp => {
        let httpstatus = resp.status;
        if (httpstatus == 201) {
          let title = "服务器提示";
          let msg = "WEB " + resp.data.name + " 创建成功";
          this.notice(title, msg);
        }
        this.handleGetWebList();
        this.$refs.formWebCreate.resetFields();
      });
    },

    handDeleteWeb(id, name) {
      deleteWeb(id).then(resp => {
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
        this.handleGetWebList();
      });
    },

    formatProject(data) {
      let projectlist = [];
      data.map(item => {
        projectlist.push({
          value: item.id,
          label: item.name
        });
      });
      this.projectList = projectlist;
      this.formWebCreate.projectname = projectlist.length > 0 ? projectlist[0].value : ""
    },

    handleGetProjectList() {
      getProjectList(this.getMaxParams).then(resp => {
        this.formatProject(resp.data.results);
      });
    },

    addWebModel() {
      this.handleGetProjectList();
      this.addWeb = true;
    },

    pageChange(page) {
      this.getParams.page = page;
      this.handleGetWebList();
    },

    sizeChange(size) {
      this.getParams.pagesize = size;
      this.handleGetWebList();
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
</style>