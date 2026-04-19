// import { AcGameObject } from "@/assets/scripts/AcGameObject";

export default {
    state: {
        is_record: false,
        a_username: "",
        a_photo: "",
        a_steps: [],
        b_username: "",
        b_photo: "",
        b_steps: [],
        record_loser: "",
    },
    getters: {
    },
    mutations: {
        updateIsRecord(state, is_record) {
            state.is_record = is_record;
        },
        updateSteps(state, data) {
            state.a_steps = data.a_steps;
            state.b_steps = data.b_steps;
        },
        updateRecordLoser(state, record_loser) {
            state.record_loser = record_loser;
        },
        updateAPhoto(state, a_photo) {
            state.a_photo = a_photo;
        },
        updateBPhoto(state, b_photo) {
            state.b_photo = b_photo;
        },
        updateAUsername(state, a_username) {
            state.a_username = a_username;
        },
        updateBUsername(state, b_username) {
            state.b_username = b_username;
        }
    },
    actions: {

    },
    modules: {
    }
};
