import moment from "moment";
import {defineComponent, h, ref, toRef} from "vue";

export default defineComponent({
    props: {
        userPicture: { type: String, required: true },
        userName: { type: String, required: true },
        publicationDate: { type: String, required: true }
    },
    setup(props) {
        const userPicture = toRef(props, "userPicture");
        const userName = toRef(props, "userName");
        const publicationDate = toRef(props, "publicationDate");

        return () =>
            h("div", {
                class: "w-full flex items-center space-x-5",
                id: "user"
            }, [
                h("div", {
                    class: "rounded-full em:w-10 em:h-10 portrait:em:w-20 portrait:em:h-20 bg-contain",
                    style: {
                        backgroundImage: "url(" + userPicture.value + ")"
                    }
                }),
                h("div", {
                    class: "flex-col"
                }, [
                    h("div", {
                        class: "font-semibold em:text-xl portrait:em:text-4xl"
                    }, userName.value),
                    h("div", {
                        class: "text-gray-500 em:text-base portrait:em:text-2xl font-light"
                    }, moment(publicationDate.value).fromNow())
                ])
            ])
    }

})
