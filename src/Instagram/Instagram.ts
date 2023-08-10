import {
    ISlideContext,
    IPublicSlide,
    SlideModule,
    VueInstance,
} from "@comeen/comeen-play-sdk-js";

import Post from "../Components/Post";
import PostAttachments from "../Components/PostAttachments";

export default class InstagramSlideModule extends SlideModule {
    async onReady() {
        return true;
    };

    setup(props: Record<string, any>, vue: VueInstance, context: ISlideContext) {
        const { h, reactive, ref, computed } = vue;

        const slide = reactive(this.context.slide) as IPublicSlide

        const logo: string = "fab fa-instagram";
        const isPostWithAttachment = computed(() => {
            return !!slide.data.attachmentUrl;
        })
        const postAttachment = isPostWithAttachment.value ? ref(slide.data.attachmentUrl) : null;
        const text = ref(slide.data.text);
        const userPicture = ref(slide.data.user.profile_picture);
        const userName = ref(slide.data.user.name);
        const publicationDate = ref(slide.data.publicationDate);

        this.context.onPlay(async () => {
            this.context.anime({
                targets: "#post",
                translateX: [-40, 0],
                // opacity: [0, 1],
                duration: 600,
                easing: 'easeOutQuad'
            });
            this.context.anime({
                targets: "#user",
                translateX: [-40, 0],
                // opacity: [0, 1],
                duration: 600,
                delay: 250,
                easing: 'easeOutQuad'
            });
        });

        return () =>
            h("div", {
                class: "w-full h-full flex justify-center items-center"
            }, [
                isPostWithAttachment.value && h(PostAttachments, {
                    text: text.value,
                    userPicture: userPicture.value,
                    userName: userName.value,
                    publicationDate: publicationDate.value,
                    postAttachment: postAttachment.value,
                    class: "w-full h-full"
                }),
                h("i", {
                    class: "em:text-6xl absolute top-14 right-14 portrait:bottom-10 portrait:top-auto " + logo,
                    style: "color: #d62976",
                })
            ])
    }
}
