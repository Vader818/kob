<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <div class="card">
                    <div class="card-body">
                        <img :src="$store.state.user.photo" style="width: 100%" />
                    </div>
                </div>
            </div>

            <div class="col-9">
                <div class="card">
                    <div class="card-header">
                        <span style="font-size: 130%">我的Bot</span>
                        <button
                            type="button"
                            class="btn btn-primary float-end"
                            data-bs-toggle="modal"
                            data-bs-target="#add-bot-btn"
                        >
                            创建
                        </button>

                        <div class="modal fade" id="add-bot-btn" tabindex="-1">
                            <div class="modal-dialog modal-xl">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">创建Bot</h5>
                                        <button
                                            type="button"
                                            class="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>

                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="add-bot-title" class="form-label">名称</label>
                                            <input
                                                id="add-bot-title"
                                                v-model="botadd.title"
                                                type="text"
                                                class="form-control"
                                                placeholder="请输入Bot名称"
                                            />
                                        </div>

                                        <div class="mb-3">
                                            <label for="add-bot-description" class="form-label">简介</label>
                                            <textarea
                                                id="add-bot-description"
                                                v-model="botadd.description"
                                                class="form-control"
                                                rows="3"
                                                placeholder="请输入Bot简介"
                                            ></textarea>
                                        </div>

                                        <div class="mb-3">
                                            <label for="add-bot-code" class="form-label">代码</label>
                                            <VAceEditor
                                                id="add-bot-code"
                                                v-model:value="botadd.content"
                                                @init="editorInit"
                                                lang="c_cpp"
                                                theme="textmate"
                                                style="height: 300px"
                                            />
                                        </div>
                                    </div>

                                    <div class="modal-footer">
                                        <div class="error-message">{{ botadd.error_message }}</div>
                                        <button type="button" class="btn btn-primary" @click="add_bot">创建</button>
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">名称</th>
                                    <th scope="col">创建时间</th>
                                    <th scope="col">操作</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="bot in bots" :key="bot.id">
                                    <td>{{ bot.title }}</td>
                                    <td>{{ bot.createtime }}</td>
                                    <td>
                                        <button
                                            type="button"
                                            class="btn btn-secondary"
                                            data-bs-toggle="modal"
                                            :data-bs-target="'#update-bot-btn-' + bot.id"
                                        >
                                            修改
                                        </button>

                                        <div class="modal fade" :id="'update-bot-btn-' + bot.id" tabindex="-1">
                                            <div class="modal-dialog modal-xl">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">修改Bot</h5>
                                                        <button
                                                            type="button"
                                                            class="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        ></button>
                                                    </div>

                                                    <div class="modal-body">
                                                        <div class="mb-3">
                                                            <label class="form-label">名称</label>
                                                            <input
                                                                v-model="bot.title"
                                                                type="text"
                                                                class="form-control"
                                                                placeholder="请修改Bot名称"
                                                            />
                                                        </div>

                                                        <div class="mb-3">
                                                            <label class="form-label">简介</label>
                                                            <textarea
                                                                v-model="bot.description"
                                                                class="form-control"
                                                                rows="3"
                                                                placeholder="请修改Bot简介"
                                                            ></textarea>
                                                        </div>

                                                        <div class="mb-3">
                                                            <label class="form-label">代码</label>
                                                            <VAceEditor
                                                                v-model:value="bot.content"
                                                                @init="editorInit"
                                                                lang="c_cpp"
                                                                theme="textmate"
                                                                style="height: 300px"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div class="modal-footer">
                                                        <div class="error-message">{{ bot.error_message }}</div>
                                                        <button type="button" class="btn btn-primary" @click="update_bot(bot)">保存</button>
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="button" class="btn btn-danger" @click="remove_bot(bot)">删除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, onMounted } from "vue";
import $ from "jquery";
import { VAceEditor } from "vue3-ace-editor";
import ace from "ace-builds";

import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-textmate";

export default {
    components: {
        VAceEditor,
    },
    setup() {
        ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-noconflict/");

        const store = useStore();
        const bots = ref([]);

        const botadd = reactive({
            title: "",
            description: "",
            content: "",
            error_message: "",
        });

        const editorInit = () => {};

        const closeModal = (id) => {
            const modalEl = document.getElementById(id);
            if (!modalEl) return;

            const dismissBtn = modalEl.querySelector('[data-bs-dismiss="modal"]');
            if (dismissBtn) {
                dismissBtn.click();
            } else {
                modalEl.classList.remove("show");
                modalEl.style.display = "none";
                modalEl.setAttribute("aria-hidden", "true");
                modalEl.removeAttribute("aria-modal");
            }

            // 兜底清理，防止偶发残留遮罩导致页面灰掉
            setTimeout(() => {
                document.body.classList.remove("modal-open");
                document.body.style.removeProperty("padding-right");
                document.querySelectorAll(".modal-backdrop").forEach((node) => node.remove());
            }, 0);
        };

        const refresh_bots = () => {
            $.ajax({
                url: "http://127.0.0.1:3000/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = Array.isArray(resp) ? resp : [];
                },
                error(xhr) {
                    console.error("getlist failed:", xhr);
                },
            });
        };

        onMounted(() => {
            refresh_bots();
        });

        const add_bot = () => {
            botadd.error_message = "";
            $.ajax({
                url: "http://127.0.0.1:3000/user/bot/add/",
                type: "post",
                data: {
                    title: botadd.title,
                    description: botadd.description,
                    content: botadd.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        botadd.title = "";
                        botadd.description = "";
                        botadd.content = "";
                        closeModal("add-bot-btn");
                        refresh_bots();
                    } else {
                        botadd.error_message = resp.error_message;
                    }
                },
                error(xhr) {
                    botadd.error_message = "创建失败，请检查网络或后端日志";
                    console.error("add bot failed:", xhr);
                },
            });
        };

        const remove_bot = (bot) => {
            $.ajax({
                url: "http://127.0.0.1:3000/user/bot/remove/",
                type: "post",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                data: {
                    bot_id: bot.id,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        refresh_bots();
                    } else {
                        alert(resp.error_message);
                    }
                },
                error(xhr) {
                    console.error("remove bot failed:", xhr);
                },
            });
        };

        const update_bot = (bot) => {
            bot.error_message = "";
            $.ajax({
                url: "http://127.0.0.1:3000/user/bot/update/",
                type: "post",
                data: {
                    bot_id: bot.id,
                    title: bot.title,
                    description: bot.description,
                    content: bot.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        closeModal("update-bot-btn-" + bot.id);
                        refresh_bots();
                    } else {
                        bot.error_message = resp.error_message;
                    }
                },
                error(xhr) {
                    bot.error_message = "更新失败，请检查网络或后端日志";
                    console.error("update bot failed:", xhr);
                },
            });
        };

        return {
            bots,
            botadd,
            add_bot,
            remove_bot,
            update_bot,
            editorInit,
        };
    },
};
</script>

<style scoped>
div.card {
    margin-top: 20px;
}

div.error-message {
    color: red;
}
</style>