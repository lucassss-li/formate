<template>
    <div class="informationManagment-container" v-loading="loading">
        <div class="search">
            <span>关键字：</span>
            <el-input
                size="medium"
                placeholder="请输入管理主体或负责人姓名"
                v-model="input"
                clearable
                class="search-input"
                @clear="search"
            >
            </el-input>
            <div class="search-btn" @click="search">搜索</div>
        </div>
        <div class="dataList">
            <div class="add" @click="showDialog">
                <span class="iconfont iconadd"></span>新增
            </div>
            <el-table
                :data="dataList"
                style="width: 100%"
                header-cell-class-name="header"
            >
                <el-table-column label="序号" align="center" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.index }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="管理主体" align="center">
                    <template slot-scope="scope">
                        <span
                            style="white-space: nowrap"
                            :title="scope.row.manageUnitName"
                            >{{ scope.row.manageUnitName | formateTitle }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="负责人姓名" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.responser }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="负责人电话" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.responserTel }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="法人姓名" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.legalHuman || "/" }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="法人电话" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.legalTel || "/" }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                        <span
                            class="iconfont iconzu947 operate"
                            @click="showDialog(scope)"
                        ></span>
                        <span
                            class="iconfont iconzu1039 operate"
                            @click="deleteItem(scope.row.manageUnitId)"
                        ></span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pageNav">
            <el-pagination
                background
                :current-page.sync="filte.pageNo"
                :page-sizes="[5, 10, 20]"
                :page-size.sync="filte.pageSize"
                layout="total,  prev, pager, next, sizes,jumper"
                :total.sync="total"
            >
            </el-pagination>
        </div>
        <el-dialog
            :visible.sync="dialogTableVisible"
            width="7.6rem"
            append-to-body
            :show-close="true"
            class="informationDialog"
            :title="selectedItem ? '编辑管理主体' : '新增管理主体'"
            destroy-on-close
        >
            <commonDetails :selectedItem="selectedItem"></commonDetails>
        </el-dialog>
    </div>
</template>

<script>
    import { getManageUnitList, deleteManageUnit } from "../../api/index";
    import commonDetails from "./details";
    import moment from "moment";
    export default {
        components: { commonDetails },
        filters: {
            formateTime(val) {
                return moment(val).format("YYYY-MM-DD HH:mm:ss");
            },
            formateTitle(val) {
                if (String(val).length < 10) {
                    return val;
                }
                return String(val).slice(0, 10) + "...";
            },
        },
        provide() {
            return {
                close: function (reset = false) {
                    this.dialogTableVisible = false;
                    reset && this.reset();
                }.bind(this),
            };
        },
        data() {
            return {
                loading: false,
                dialogTableVisible: false,
                input: "",
                filte: {
                    keywords: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: 0,
                dataList: [],
                selectedItem: null,
            };
        },
        created() {
            this.reset();
        },
        methods: {
            showDialog(selectedItem) {
                this.dialogTableVisible = true;
                if (selectedItem) {
                    this.selectedItem = selectedItem.row;
                }
            },
            search() {
                this.filte.keywords = this.input;
            },
            fetchList() {
                this.loading = true;
                getManageUnitList(this.filte).then((res) => {
                    this.dataList = res.data.result.records.map((item, index) => {
                        item.index = index + 1;
                        return item;
                    });
                    this.total = res.data.result.total;
                    this.loading = false;
                });
            },
            reset() {
                this.dialogTableVisible = false;
                this.input = "";
                this.filte.keywords = "";
                this.filte.pageNo = 1;
                this.filte.pageSize = 10;
                this.dataList = [];
                this.fetchList();
            },
            deleteItem(manageUnitId) {
                this.$confirm("确定删除该管理主体吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        deleteManageUnit(manageUnitId).then(() => {
                            this.reset();
                        });
                    })
                    .catch(() => {
                        console.log("cancel");
                    });
            },
        },
        watch: {
            filte: {
                deep: true,
                immediate: false,
                handler() {
                    this.fetchList();
                },
            },
            dialogTableVisible(val) {
                if (!val) this.selectedItem = null;
            },
        },
        computed: {},
    };
</script>


<style lang="less" scoped>
    .informationManagment-container {
        padding: 0.24rem 0.43rem 0 0.32rem;
        .search {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 0.3rem;
            margin-bottom: 0.48rem;
            span {
                font-size: 0.14rem;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                margin-right: 0.03rem;
            }
            .search-input {
                width: 2.5rem;
                margin-right: 0.6rem;
            }
            .search-btn {
                cursor: pointer;
                width: 0.75rem;
                height: 0.3rem;
                background-color: rgba(67, 129, 230, 1);
                border-radius: 0.04rem;
                font-size: 0.14rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 0.3rem;
                color: #ffffff;
                text-align: center;
            }
        }
        .dataList {
            border: 1px solid rgba(230, 234, 244, 1);
            position: relative;
            .add {
                border: 0.01rem solid rgba(67, 129, 230, 1);
                border-radius: 0.03rem;
                position: absolute;
                right: 0;
                top: -0.34rem;
                width: 0.6rem;
                height: 0.22rem;
                color: rgba(67, 129, 230, 1);
                font-size: 0.12rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                background-color: rgba(238, 244, 254, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                .iconadd {
                    margin-right: 0.04rem;
                }
            }
            /deep/.header {
                background-color: rgba(244, 246, 251, 1) !important;
                height: 0.49rem;
                padding: 0;
                color: rgba(98, 104, 122, 1);
            }
            /deep/.el-table__body {
                color: rgba(51, 51, 51, 1) !important;
            }
            /deep/.el-table th > .cell {
                color: rgba(98, 104, 122, 1) !important;
                .el-icon-arrow-down {
                    font-family: "iconfont" !important;
                    font-style: normal;
                    -webkit-font-smoothing: antialiased;
                    transform: translateX(-40%) scale(0.8);
                    &::before {
                        font-size: 0.01rem;
                        content: "\e652" !important;
                    }
                }
            }
            /deep/.el-table th > .cell:hover {
                .el-icon-arrow-down {
                    &::before {
                        color: rgba(67, 129, 230, 1) !important;
                    }
                }
            }
            /deep/.publishStatus {
                position: relative;
                &::before {
                    content: "";
                    border-radius: 50%;
                    width: 0.06rem;
                    height: 0.06rem;
                    position: absolute;
                    left: -0.15rem;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            /deep/.el-table__body {
                max-height: 57vh;
                overflow: auto;
                display: block;
            }
            /deep/.operate {
                color: rgba(67, 129, 230, 1);
                cursor: pointer;
            }
            /deep/.iconzu947,
            .operate,
            .iconzu1039 {
                font-size: 0.12rem;
            }
        }
        .pageNav {
            margin-top: 0.27rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .informationDialog {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        /deep/.el-dialog {
            border-radius: 0.04rem;
            .el-dialog__header {
                position: relative;
                border-radius: 0.04rem;
                background-color: rgba(246, 248, 252, 1);
                height: 0.5rem;
                box-sizing: border-box;
                padding: 0.2rem;
                .el-dialog__title {
                    font-size: 0.16rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #777d8a;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateY(-50%) translateX(-50%);
                }
                .el-dialog__headerbtn {
                    font-size: 0.25rem;
                    transform: translateY(-50%);
                    top: 50%;
                }
            }
            .el-dialog__body {
                padding: 0;
            }
        }
    }
</style>